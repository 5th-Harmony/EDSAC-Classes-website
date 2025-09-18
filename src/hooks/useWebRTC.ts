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
      await consume(socketConnection, roomId, data.producerId, data.peerId);
    });

    socketConnection.on('transport-created', async (data) => {
      if (data.direction === 'send') {
        try {
          const transport = device!.createSendTransport(data);
          
          transport.on('connect', ({ dtlsParameters }, callback, errback) => {
            socketConnection.emit('connect-transport', {
              roomId,
              transportId: transport.id,
              dtlsParameters
            });
            // Server-side will respond with 'transport-connected'
          });

          transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
            socketConnection.emit('produce', {
              roomId,
              transportId: transport.id,
              kind,
              rtpParameters
            });
            // Server-side will respond with 'produced'
          });

          sendTransportRef.current = transport;
        } catch (error) {
          console.error('Error creating send transport:', error);
        }
      } else if (data.direction === 'recv') {
        try {
          const transport = device!.createRecvTransport(data);
          
          transport.on('connect', ({ dtlsParameters }, callback, errback) => {
            socketConnection.emit('connect-transport', {
              roomId,
              transportId: transport.id,
              dtlsParameters
            });
            // Server-side will respond with 'transport-connected'
          });

          recvTransportRef.current = transport;
        } catch (error) {
          console.error('Error creating recv transport:', error);
        }
      }
    });

    socketConnection.on('transport-connected', ({ transportId }) => {
      const transport = sendTransportRef.current?.id === transportId 
        ? sendTransportRef.current 
        : recvTransportRef.current;
      
      if (transport) {
        // Mediasoup's transport.on('connect') callback can now be called
        // This is handled internally by the mediasoup-client library
      }
    });

    socketConnection.on('produced', ({ producerId, kind }) => {
      // This confirms that the server has created the producer
      console.log(`Produced ${kind} with id ${producerId}`);
    });

    socketConnection.on('consumed', async (data) => {
      const { consumerId, producerId, kind, rtpParameters } = data;
      
      const consumer = await recvTransportRef.current!.consume({
        id: consumerId,
        producerId,
        kind,
        rtpParameters,
      });

      consumersRef.current.set(consumerId, consumer);

      const stream = new MediaStream();
      stream.addTrack(consumer.track);

      setRemoteStreams(prev => {
        const newStreams = new Map(prev);
        // The key should be the peerId associated with this producer
        // This part needs the peerId from the 'new-producer' event
        // For now, we'll use producerId as a placeholder key
        newStreams.set(producerId, stream);
        return newStreams;
      });
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
    socket.emit('create-transport', { roomId, direction: 'send' });
  };

  const createRecvTransport = async (socket: Socket, roomId: string) => {
    socket.emit('create-transport', { roomId, direction: 'recv' });
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

  const consume = async (socket: Socket, roomId: string, producerId: string, peerId: string) => {
    if (!recvTransportRef.current || !device) return;

    socket.emit('consume', {
      roomId,
      transportId: recvTransportRef.current.id,
      producerId,
      rtpCapabilities: device.rtpCapabilities
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
