# ENIAC Classes - WebRTC Integration Guide

## Step 1: mediasoup Server Setup

### 1.1 Install Additional Dependencies
```bash
# Add to your existing backend project
npm install uuid @types/uuid
```

### 1.2 mediasoup Configuration
Create `src/config/mediasoup.ts`:
```typescript
import { RtpCodecCapability, TransportListenIp, WorkerLogLevel } from 'mediasoup/node/lib/types';

export const config = {
  // Worker settings
  worker: {
    rtcMinPort: 10000,
    rtcMaxPort: 10100,
    logLevel: 'warn' as WorkerLogLevel,
    logTags: [
      'info',
      'ice',
      'dtls',
      'rtp',
      'srtp',
      'rtcp',
    ],
  },
  // Router settings
  router: {
    mediaCodecs: [
      {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
      },
      {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
        parameters: {
          'x-google-start-bitrate': 1000,
        },
      },
      {
        kind: 'video',
        mimeType: 'video/VP9',
        clockRate: 90000,
        parameters: {
          'profile-id': 2,
          'x-google-start-bitrate': 1000,
        },
      },
      {
        kind: 'video',
        mimeType: 'video/h264',
        clockRate: 90000,
        parameters: {
          'packetization-mode': 1,
          'profile-level-id': '4d0032',
          'level-asymmetry-allowed': 1,
          'x-google-start-bitrate': 1000,
        },
      },
    ] as RtpCodecCapability[],
  },
  // WebRTC transport settings
  webRtcTransport: {
    listenIps: [
      {
        ip: process.env.MEDIASOUP_LISTEN_IP || '0.0.0.0',
        announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP,
      },
    ] as TransportListenIp[],
    maxIncomingBitrate: 1500000,
    initialAvailableOutgoingBitrate: 1000000,
  },
};
```

### 1.3 mediasoup Worker Manager
Create `src/lib/mediasoup.ts`:
```typescript
import * as mediasoup from 'mediasoup';
import { Worker, Router } from 'mediasoup/node/lib/types';
import { config } from '../config/mediasoup';

class MediasoupManager {
  private workers: Worker[] = [];
  private routers: Map<string, Router> = new Map();
  private nextWorkerIdx = 0;

  async init() {
    const numWorkers = Object.keys(require('os').cpus()).length;
    
    for (let i = 0; i < numWorkers; i++) {
      const worker = await mediasoup.createWorker({
        logLevel: config.worker.logLevel,
        logTags: config.worker.logTags,
        rtcMinPort: config.worker.rtcMinPort,
        rtcMaxPort: config.worker.rtcMaxPort,
      });

      worker.on('died', () => {
        console.error('mediasoup worker died, exiting in 2 seconds... [pid:%d]', worker.pid);
        setTimeout(() => process.exit(1), 2000);
      });

      this.workers.push(worker);
    }

    console.log(`Created ${numWorkers} mediasoup workers`);
  }

  getNextWorker(): Worker {
    const worker = this.workers[this.nextWorkerIdx];
    this.nextWorkerIdx = (this.nextWorkerIdx + 1) % this.workers.length;
    return worker;
  }

  async createRouter(roomId: string): Promise<Router> {
    const worker = this.getNextWorker();
    const router = await worker.createRouter({
      mediaCodecs: config.router.mediaCodecs,
    });

    this.routers.set(roomId, router);
    return router;
  }

  getRouter(roomId: string): Router | undefined {
    return this.routers.get(roomId);
  }

  deleteRouter(roomId: string) {
    const router = this.routers.get(roomId);
    if (router) {
      router.close();
      this.routers.delete(roomId);
    }
  }
}

export const mediasoupManager = new MediasoupManager();
```

## Step 2: Room Management System

### 2.1 Room Class
Create `src/lib/Room.ts`:
```typescript
import { Router, WebRtcTransport, Producer, Consumer } from 'mediasoup/node/lib/types';
import { mediasoupManager } from './mediasoup';
import { config } from '../config/mediasoup';

export interface Peer {
  id: string;
  userId: number;
  userName: string;
  role: 'host' | 'participant';
  transports: Map<string, WebRtcTransport>;
  producers: Map<string, Producer>;
  consumers: Map<string, Consumer>;
}

export class Room {
  public id: string;
  public router: Router;
  public peers: Map<string, Peer> = new Map();
  public isActive: boolean = false;

  constructor(roomId: string, router: Router) {
    this.id = roomId;
    this.router = router;
  }

  addPeer(peerId: string, userId: number, userName: string, role: 'host' | 'participant'): Peer {
    const peer: Peer = {
      id: peerId,
      userId,
      userName,
      role,
      transports: new Map(),
      producers: new Map(),
      consumers: new Map(),
    };

    this.peers.set(peerId, peer);
    return peer;
  }

  removePeer(peerId: string) {
    const peer = this.peers.get(peerId);
    if (peer) {
      // Close all transports
      peer.transports.forEach(transport => transport.close());
      
      // Close all producers
      peer.producers.forEach(producer => producer.close());
      
      // Close all consumers
      peer.consumers.forEach(consumer => consumer.close());
      
      this.peers.delete(peerId);
    }
  }

  async createWebRtcTransport(peerId: string) {
    const peer = this.peers.get(peerId);
    if (!peer) throw new Error('Peer not found');

    const transport = await this.router.createWebRtcTransport({
      listenIps: config.webRtcTransport.listenIps,
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate: config.webRtcTransport.initialAvailableOutgoingBitrate,
    });

    transport.on('dtlsstatechange', (dtlsState) => {
      if (dtlsState === 'closed') {
        transport.close();
      }
    });

    peer.transports.set(transport.id, transport);
    return transport;
  }

  async createProducer(peerId: string, transportId: string, rtpParameters: any, kind: 'audio' | 'video') {
    const peer = this.peers.get(peerId);
    if (!peer) throw new Error('Peer not found');

    const transport = peer.transports.get(transportId);
    if (!transport) throw new Error('Transport not found');

    const producer = await transport.produce({
      kind,
      rtpParameters,
    });

    peer.producers.set(producer.id, producer);

    // Create consumers for all other peers
    for (const [otherPeerId, otherPeer] of this.peers) {
      if (otherPeerId !== peerId) {
        await this.createConsumer(otherPeerId, producer.id);
      }
    }

    return producer;
  }

  async createConsumer(peerId: string, producerId: string) {
    const peer = this.peers.get(peerId);
    if (!peer) throw new Error('Peer not found');

    const producer = this.getProducerById(producerId);
    if (!producer) throw new Error('Producer not found');

    // Find a suitable transport for consuming
    const transport = Array.from(peer.transports.values())[0];
    if (!transport) throw new Error('No transport available');

    if (!this.router.canConsume({ producerId, rtpCapabilities: transport.rtpCapabilities })) {
      throw new Error('Cannot consume');
    }

    const consumer = await transport.consume({
      producerId,
      rtpCapabilities: transport.rtpCapabilities,
      paused: true,
    });

    peer.consumers.set(consumer.id, consumer);
    return consumer;
  }

  private getProducerById(producerId: string): Producer | undefined {
    for (const peer of this.peers.values()) {
      const producer = peer.producers.get(producerId);
      if (producer) return producer;
    }
    return undefined;
  }

  getPeerList() {
    return Array.from(this.peers.values()).map(peer => ({
      id: peer.id,
      userId: peer.userId,
      userName: peer.userName,
      role: peer.role,
    }));
  }

  close() {
    this.peers.forEach(peer => {
      peer.transports.forEach(transport => transport.close());
    });
    this.router.close();
  }
}
```

### 2.2 Room Manager
Create `src/lib/RoomManager.ts`:
```typescript
import { Room } from './Room';
import { mediasoupManager } from './mediasoup';

class RoomManager {
  private rooms: Map<string, Room> = new Map();

  async createRoom(roomId: string): Promise<Room> {
    if (this.rooms.has(roomId)) {
      return this.rooms.get(roomId)!;
    }

    const router = await mediasoupManager.createRouter(roomId);
    const room = new Room(roomId, router);
    this.rooms.set(roomId, room);
    
    return room;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  deleteRoom(roomId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.close();
      this.rooms.delete(roomId);
      mediasoupManager.deleteRouter(roomId);
    }
  }

  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }
}

export const roomManager = new RoomManager();
```

## Step 3: Socket.IO Event Handlers

### 3.1 WebRTC Socket Events
Create `src/sockets/webrtc.ts`:
```typescript
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { roomManager } from '../lib/RoomManager';
import { db } from '../database/connection';

interface AuthenticatedSocket extends Socket {
  userId?: number;
  userName?: string;
  userRole?: string;
}

export const setupWebRTCEvents = (io: SocketIOServer) => {
  // Authentication middleware for socket connections
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const userResult = await db.query(
        'SELECT id, first_name, last_name, role FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (userResult.rows.length === 0) {
        return next(new Error('User not found'));
      }

      const user = userResult.rows[0];
      socket.userId = user.id;
      socket.userName = `${user.first_name} ${user.last_name}`;
      socket.userRole = user.role;
      
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.userName} connected:`, socket.id);

    // Join room
    socket.on('join-room', async (data: { roomId: string }) => {
      try {
        const { roomId } = data;
        
        // Verify user has access to this room
        const classResult = await db.query(
          `SELECT c.*, cp.role as participant_role 
           FROM classes c 
           LEFT JOIN class_participants cp ON c.id = cp.class_id AND cp.user_id = $1
           WHERE c.room_id = $2 AND (c.teacher_id = $1 OR cp.user_id = $1)`,
          [socket.userId, roomId]
        );

        if (classResult.rows.length === 0) {
          socket.emit('error', { message: 'Access denied to this room' });
          return;
        }

        const classInfo = classResult.rows[0];
        const isHost = classInfo.teacher_id === socket.userId;
        const role = isHost ? 'host' : 'participant';

        // Create or get room
        const room = await roomManager.createRoom(roomId);
        
        // Add peer to room
        const peer = room.addPeer(socket.id, socket.userId!, socket.userName!, role);
        
        // Join socket room
        socket.join(roomId);
        
        // Get router RTP capabilities
        const rtpCapabilities = room.router.rtpCapabilities;
        
        // Send room info to client
        socket.emit('room-joined', {
          roomId,
          peerId: socket.id,
          role,
          rtpCapabilities,
          peers: room.getPeerList().filter(p => p.id !== socket.id)
        });

        // Notify other peers
        socket.to(roomId).emit('peer-joined', {
          peerId: socket.id,
          userId: socket.userId,
          userName: socket.userName,
          role
        });

        console.log(`${socket.userName} joined room ${roomId} as ${role}`);
      } catch (error) {
        console.error('Join room error:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Create WebRTC transport
    socket.on('create-transport', async (data: { roomId: string, direction: 'send' | 'recv' }) => {
      try {
        const { roomId, direction } = data;
        const room = roomManager.getRoom(roomId);
        
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        const transport = await room.createWebRtcTransport(socket.id);
        
        socket.emit('transport-created', {
          transportId: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
          direction
        });
      } catch (error) {
        console.error('Create transport error:', error);
        socket.emit('error', { message: 'Failed to create transport' });
      }
    });

    // Connect transport
    socket.on('connect-transport', async (data: { 
      roomId: string, 
      transportId: string, 
      dtlsParameters: any 
    }) => {
      try {
        const { roomId, transportId, dtlsParameters } = data;
        const room = roomManager.getRoom(roomId);
        
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        const peer = room.peers.get(socket.id);
        if (!peer) {
          socket.emit('error', { message: 'Peer not found' });
          return;
        }

        const transport = peer.transports.get(transportId);
        if (!transport) {
          socket.emit('error', { message: 'Transport not found' });
          return;
        }

        await transport.connect({ dtlsParameters });
        socket.emit('transport-connected', { transportId });
      } catch (error) {
        console.error('Connect transport error:', error);
        socket.emit('error', { message: 'Failed to connect transport' });
      }
    });

    // Produce media
    socket.on('produce', async (data: {
      roomId: string,
      transportId: string,
      kind: 'audio' | 'video',
      rtpParameters: any
    }) => {
      try {
        const { roomId, transportId, kind, rtpParameters } = data;
        const room = roomManager.getRoom(roomId);
        
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        const producer = await room.createProducer(socket.id, transportId, rtpParameters, kind);
        
        socket.emit('produced', { 
          producerId: producer.id,
          kind 
        });

        // Notify other peers about new producer
        socket.to(roomId).emit('new-producer', {
          peerId: socket.id,
          producerId: producer.id,
          kind
        });
      } catch (error) {
        console.error('Produce error:', error);
        socket.emit('error', { message: 'Failed to produce media' });
      }
    });

    // Consume media
    socket.on('consume', async (data: {
      roomId: string,
      transportId: string,
      producerId: string,
      rtpCapabilities: any
    }) => {
      try {
        const { roomId, transportId, producerId, rtpCapabilities } = data;
        const room = roomManager.getRoom(roomId);
        
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        const consumer = await room.createConsumer(socket.id, producerId);
        
        socket.emit('consumed', {
          consumerId: consumer.id,
          producerId,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters
        });
      } catch (error) {
        console.error('Consume error:', error);
        socket.emit('error', { message: 'Failed to consume media' });
      }
    });

    // Resume consumer
    socket.on('resume-consumer', async (data: { roomId: string, consumerId: string }) => {
      try {
        const { roomId, consumerId } = data;
        const room = roomManager.getRoom(roomId);
        
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        const peer = room.peers.get(socket.id);
        if (!peer) {
          socket.emit('error', { message: 'Peer not found' });
          return;
        }

        const consumer = peer.consumers.get(consumerId);
        if (!consumer) {
          socket.emit('error', { message: 'Consumer not found' });
          return;
        }

        await consumer.resume();
        socket.emit('consumer-resumed', { consumerId });
      } catch (error) {
        console.error('Resume consumer error:', error);
        socket.emit('error', { message: 'Failed to resume consumer' });
      }
    });

    // Chat message
    socket.on('chat-message', (data: { roomId: string, message: string }) => {
      const { roomId, message } = data;
      
      socket.to(roomId).emit('chat-message', {
        userId: socket.userId,
        userName: socket.userName,
        message,
        timestamp: new Date().toISOString()
      });
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      console.log(`User ${socket.userName} disconnected:`, socket.id);
      
      // Find and clean up rooms
      const rooms = roomManager.getAllRooms();
      rooms.forEach(room => {
        if (room.peers.has(socket.id)) {
          room.removePeer(socket.id);
          
          // Notify other peers
          socket.to(room.id).emit('peer-left', {
            peerId: socket.id,
            userId: socket.userId,
            userName: socket.userName
          });

          // If room is empty, delete it
          if (room.peers.size === 0) {
            roomManager.deleteRoom(room.id);
          }
        }
      });
    });
  });
};
```

## Step 4: Update Main Server

### 4.1 Update server.ts
Update `src/server.ts` to include WebRTC functionality:
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import classRoutes from './routes/classes';

// Import WebRTC setup
import { setupWebRTCEvents } from './sockets/webrtc';
import { mediasoupManager } from './lib/mediasoup';
import { testConnections } from './database/connection';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173", // Your React app URL
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Setup WebRTC events
setupWebRTCEvents(io);

const PORT = process.env.PORT || 3001;

// Initialize services and start server
async function startServer() {
  try {
    // Test database connections
    const dbConnected = await testConnections();
    if (!dbConnected) {
      console.error('Failed to connect to databases');
      process.exit(1);
    }

    // Initialize mediasoup
    await mediasoupManager.init();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`WebRTC server ready for live classes`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

## Step 5: Frontend Integration

### 5.1 Install Frontend Dependencies
Add to your React project:
```bash
cd ../your-frontend-project
npm install socket.io-client mediasoup-client
```

### 5.2 WebRTC Client Hook
Create `src/hooks/useWebRTC.ts`:
```typescript
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Device } from 'mediasoup-client';
import { Transport, Producer, Consumer } from 'mediasoup-client/lib/types';

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

  const sendTransportRef = useRef<Transport | null>(null);
  const recvTransportRef = useRef<Transport | null>(null);
  const producersRef = useRef<Map<string, Producer>>(new Map());
  const consumersRef = useRef<Map<string, Consumer>>(new Map());

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
```

### 5.3 Live Class Component
Create `src/components/LiveClass.tsx`:
```typescript
import React, { useRef, useEffect, useState } from 'react';
import { useWebRTC } from '../hooks/useWebRTC';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface LiveClassProps {
  roomId: string;
  token: string;
}

export const LiveClass: React.FC<LiveClassProps> = ({ roomId, token }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isVideoStarted, setIsVideoStarted] = useState(false);

  const {
    isConnected,
    peers,
    localStream,
    remoteStreams,
    joinRoom,
    startVideo,
    stopVideo,
    sendChatMessage
  } = useWebRTC({
    roomId,
    token,
    onPeerJoined: (peer) => {
      console.log('Peer joined:', peer.userName);
    },
    onPeerLeft: (peer) => {
      console.log('Peer left:', peer.userName);
    },
    onChatMessage: (message) => {
      setChatMessages(prev => [...prev, message]);
    }
  });

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (isConnected) {
      joinRoom();
    }
  }, [isConnected]);

  const handleStartVideo = async () => {
    await startVideo();
    setIsVideoStarted(true);
  };

  const handleStopVideo = () => {
    stopVideo();
    setIsVideoStarted(false);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendChatMessage(newMessage);
      setChatMessages(prev => [...prev, {
        userName: 'You',
        message: newMessage,
        timestamp: new Date().toISOString()
      }]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Video Area */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4 h-full">
          {/* Local Video */}
          <Card>
            <CardHeader>
              <CardTitle>Your Video</CardTitle>
            </CardHeader>
            <CardContent>
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-64 bg-gray-900 rounded"
              />
              <div className="mt-4 space-x-2">
                {!isVideoStarted ? (
                  <Button onClick={handleStartVideo}>Start Video</Button>
                ) : (
                  <Button onClick={handleStopVideo} variant="destructive">
                    Stop Video
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Remote Videos */}
          <Card>
            <CardHeader>
              <CardTitle>Participants ({peers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {Array.from(remoteStreams.entries()).map(([streamId, stream]) => (
                  <RemoteVideo key={streamId} stream={stream} />
                ))}
                {peers.map(peer => (
                  <div key={peer.id} className="p-2 bg-gray-100 rounded">
                    <span className="font-medium">{peer.userName}</span>
                    <span className="ml-2 text-sm text-gray-600">({peer.role})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-80 border-l p-4">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {chatMessages.map((msg, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded">
                  <div className="font-medium text-sm">{msg.userName}</div>
                  <div className="text-sm">{msg.message}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Remote Video Component
const RemoteVideo: React.FC<{ stream: MediaStream }> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="w-full h-32 bg-gray-900 rounded"
    />
  );
};
```

## Step 6: Testing and Deployment

### 6.1 Local Testing Setup
```bash
# Terminal 1: Start backend
cd eniac-backend
npm run dev

# Terminal 2: Start frontend
cd eniac-frontend
npm run dev

# Terminal 3: Start PostgreSQL and Redis
brew services start postgresql redis
```

### 6.2 Environment Variables for Production
Update `.env` for production:
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db:5432/eniac_classes
REDIS_URL=redis://prod-redis:6379
MEDIASOUP_ANNOUNCED_IP=your-production-server-ip
```

### 6.3 Docker Setup (Optional)
Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: eniac_classes
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: .
    ports:
      - "3001:3001"
      - "10000-10100:10000-10100/udp"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/eniac_classes
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

### 6.4 TURN Server Setup (Production)
Install coturn for NAT traversal:
```bash
# Ubuntu/Debian
sudo apt install coturn

# Configure /etc/turnserver.conf
listening-port=3478
tls-listening-port=5349
listening-ip=0.0.0.0
external-ip=YOUR_SERVER_IP
realm=your-domain.com
server-name=your-domain.com
fingerprint
lt-cred-mech
user=username:password
```

## Step 7: Usage Instructions

### 7.1 Creating a Live Class
```typescript
// Teacher creates a class
const response = await fetch('/api/classes', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Math Class',
    description: 'Algebra basics',
    scheduledAt: '2024-01-15T10:00:00Z',
    duration: 60
  })
});

const { class: newClass } = await response.json();
const roomId = newClass.room_id;
```

### 7.2 Joining a Live Class
```typescript
// In your React component
import { LiveClass } from '../components/LiveClass';

function ClassPage({ classId }) {
  const [roomId, setRoomId] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    // Fetch class details to get room_id
    fetchClassDetails(classId).then(classData => {
      setRoomId(classData.room_id);
    });
  }, [classId]);

  if (!roomId) return <div>Loading...</div>;

  return <LiveClass roomId={roomId} token={token} />;
}
```

## Step 8: Performance Optimization

### 8.1 Video Quality Settings
```typescript
// In useWebRTC hook, modify startVideo function
const videoProducer = await sendTransportRef.current.produce({
  track: videoTrack,
  encodings: [
    { rid: 'r0', maxBitrate: 100000, scalabilityMode: 'S1T3' },
    { rid: 'r1', maxBitrate: 300000, scalabilityMode: 'S1T3' },
    { rid: 'r2', maxBitrate: 900000, scalabilityMode: 'S1T3' }
  ],
  codecOptions: {
    videoGoogleStartBitrate: 1000
  }
});
```

### 8.2 Connection Monitoring
```typescript
// Add to useWebRTC hook
const [connectionStats, setConnectionStats] = useState({});

useEffect(() => {
  const interval = setInterval(async () => {
    if (sendTransportRef.current) {
      const stats = await sendTransportRef.current.getStats();
      setConnectionStats(stats);
    }
  }, 5000);

  return () => clearInterval(interval);
}, []);
```

## Troubleshooting

### Common Issues:
1. **Port conflicts**: Ensure ports 10000-10100 are open for UDP
2. **STUN/TURN**: Configure proper STUN/TURN servers for production
3. **Firewall**: Allow WebRTC traffic through firewall
4. **SSL**: Use HTTPS in production for getUserMedia to work
5. **Memory**: Monitor memory usage with multiple participants

### Debug Commands:
```bash
# Check mediasoup workers
ps aux | grep mediasoup

# Monitor network traffic
netstat -an | grep :3001

# Check database connections
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

Your live class feature is now ready! The backend provides robust WebRTC functionality with mediasoup, and the frontend offers a complete video conferencing interface with chat capabilities.
