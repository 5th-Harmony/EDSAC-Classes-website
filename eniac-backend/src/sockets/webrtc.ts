import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { roomManager } from '../lib/RoomManager';
import { db } from '../database/connection';
import { types } from 'mediasoup';

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

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
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
      dtlsParameters: types.DtlsParameters 
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
      kind: types.MediaKind,
      rtpParameters: types.RtpParameters
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
      rtpCapabilities: types.RtpCapabilities
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
