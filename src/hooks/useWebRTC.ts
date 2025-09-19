import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Device, types } from 'mediasoup-client';

interface Peer {
  id: string;
  userId: number;
  userName: string;
  role: 'host' | 'participant';
}

interface UseWebRTCProps {
  roomId: string;
  token: string;
  onPeerJoined?: (peer: Peer) => void;
  onPeerLeft?: (peer: Peer) => void;
  onChatMessage?: (message: any) => void;
}

export const useWebRTC = ({ roomId, token, onPeerJoined, onPeerLeft, onChatMessage }: UseWebRTCProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());

  const sendTransportRef = useRef<types.Transport | null>(null);
  const recvTransportRef = useRef<types.Transport | null>(null);
  const producersRef = useRef<Map<string, types.Producer>>(new Map());
  const consumersRef = useRef<Map<string, types.Consumer>>(new Map());

  useEffect(() => {
    const socketConnection = io('http://localhost:3001', {
      auth: { token }
    });

    socketConnection.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socketConnection.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socketConnection.on('room-joined', async (data) => {
      console.log('Joined room:', data);
      setPeers(data.peers);

      // Initialize mediasoup device
      const newDevice = new Device();
      await newDevice.load({ routerRtpCapabilities: data.rtpCapabilities });
      setDevice(newDevice);

      // Create transports
      await createSendTransport(socketConnection, roomId);
      await createRecvTransport(socketConnection, roomId);
    });

    socketConnection.on('peer-joined', (peer) => {
      console.log('Peer joined:', peer);
      setPeers(prev => [...prev, peer]);
      onPeerJoined?.(peer);
    });

    socketConnection.on('peer-left', (peer) => {
      console.log('Peer left:', peer);
      setPeers(prev => prev.filter(p => p.id !== peer.peerId));
      
      // Clean up remote stream
      setRemoteStreams(prev => {
        const newStreams = new Map(prev);
        newStreams.delete(peer.peerId);
        return newStreams;
      });
      
      onPeerLeft?.(peer);
    });

    socketConnection.on('new-producer', async (data) => {
      console.log('New producer:', data);
      await consume(socketConnection, roomId, data.producerId);
    });

    socketConnection.on('chat-message', (message) => {
      onChatMessage?.(message);
    });

    socketConnection.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, [roomId, token]);

  const joinRoom = () => {
    if (socket) {
      socket.emit('join-room', { roomId });
    }
  };

  const createSendTransport = async (socket: Socket, roomId: string) => {
    return new Promise<void>((resolve, reject) => {
      socket.emit('create-transport', { roomId, direction: 'send' });

      socket.on('transport-created', async (data) => {
        if (data.direction === 'send') {
          try {
            const transport = device!.createSendTransport(data);
            
            transport.on('connect', ({ dtlsParameters }, callback, errback) => {
              socket.emit('connect-transport', {
                roomId,
                transportId: transport.id,
                dtlsParameters
              });

              socket.on('transport-connected', (response) => {
                if (response.transportId === transport.id) {
                  callback();
                }
              });
            });

            transport.on('produce', ({ kind, rtpParameters }, callback, errback) => {
              socket.emit('produce', {
                roomId,
                transportId: transport.id,
                kind,
                rtpParameters
              });

              socket.on('produced', (response) => {
                callback({ id: response.producerId });
              });
            });

            sendTransportRef.current = transport;
            resolve();
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  };

  const createRecvTransport = async (socket: Socket, roomId: string) => {
    return new Promise<void>((resolve, reject) => {
      socket.emit('create-transport', { roomId, direction: 'recv' });

      socket.on('transport-created', async (data) => {
        if (data.direction === 'recv') {
          try {
            const transport = device!.createRecvTransport(data);
            
            transport.on('connect', ({ dtlsParameters }, callback, errback) => {
              socket.emit('connect-transport', {
                roomId,
                transportId: transport.id,
                dtlsParameters
              });

              socket.on('transport-connected', (response) => {
                if (response.transportId === transport.id) {
                  callback();
                }
              });
            });

            recvTransportRef.current = transport;
            resolve();
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  };

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      setLocalStream(stream);

      // Produce video and audio
      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];

      if (sendTransportRef.current) {
        const videoProducer = await sendTransportRef.current.produce({
          track: videoTrack,
          encodings: [{ maxBitrate: 100000 }],
          codecOptions: { videoGoogleStartBitrate: 1000 }
        });

        const audioProducer = await sendTransportRef.current.produce({
          track: audioTrack
        });

        producersRef.current.set('video', videoProducer);
        producersRef.current.set('audio', audioProducer);
      }
    } catch (error) {
      console.error('Error starting video:', error);
    }
  };

  const stopVideo = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    producersRef.current.forEach(producer => producer.close());
    producersRef.current.clear();
  };

  const consume = async (socket: Socket, roomId: string, producerId: string) => {
    if (!recvTransportRef.current || !device) return;

    socket.emit('consume', {
      roomId,
      transportId: recvTransportRef.current.id,
      producerId,
      rtpCapabilities: device.rtpCapabilities
    });

    socket.on('consumed', async (data) => {
      if (data.producerId === producerId) {
        const consumer = await recvTransportRef.current!.consume({
          id: data.consumerId,
          producerId: data.producerId,
          kind: data.kind,
          rtpParameters: data.rtpParameters
        });

        consumersRef.current.set(data.consumerId, consumer);

        // Resume consumer
        socket.emit('resume-consumer', { roomId, consumerId: data.consumerId });

        // Add track to remote stream
        const stream = new MediaStream([consumer.track]);
        setRemoteStreams(prev => new Map(prev.set(data.producerId, stream)));
      }
    });
  };

  const sendChatMessage = (message: string) => {
    if (socket) {
      socket.emit('chat-message', { roomId, message });
    }
  };

  return {
    isConnected,
    peers,
    localStream,
    remoteStreams,
    joinRoom,
    startVideo,
    stopVideo,
    sendChatMessage
  };
};
