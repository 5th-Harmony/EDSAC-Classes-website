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
    origin: "*", // Allow all origins
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
