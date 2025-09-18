# ENIAC Classes - Live Class Backend Setup Guide

## Step 1: Initialize Node.js Backend Project

### 1.1 Create Backend Directory Structure
```bash
mkdir eniac-backend
cd eniac-backend
npm init -y
```

### 1.2 Install Core Dependencies
```bash
# Core framework and utilities
npm install express cors helmet morgan dotenv
npm install socket.io mediasoup
npm install jsonwebtoken bcryptjs
npm install pg redis ioredis
npm install multer aws-sdk

# Development dependencies
npm install -D typescript @types/node @types/express
npm install -D @types/jsonwebtoken @types/bcryptjs
npm install -D @types/cors @types/morgan
npm install -D nodemon ts-node
```

### 1.3 TypeScript Configuration
Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Step 2: Basic Server Setup

### 2.1 Environment Configuration
Create `.env`:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/eniac_classes
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# AWS Configuration (for recordings)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_BUCKET_NAME=eniac-recordings
AWS_REGION=us-east-1

# mediasoup Configuration
MEDIASOUP_LISTEN_IP=0.0.0.0
MEDIASOUP_ANNOUNCED_IP=your-server-ip
```

### 2.2 Basic Express Server
Create `src/server.ts`:
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

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

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Step 3: Database Setup

### 3.1 PostgreSQL Schema
Create `src/database/schema.sql`:
```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id INTEGER REFERENCES users(id),
    scheduled_at TIMESTAMP NOT NULL,
    duration INTEGER DEFAULT 60, -- in minutes
    max_participants INTEGER DEFAULT 50,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
    room_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Class participants
CREATE TABLE class_participants (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id),
    user_id INTEGER REFERENCES users(id),
    joined_at TIMESTAMP,
    left_at TIMESTAMP,
    role VARCHAR(20) DEFAULT 'participant' CHECK (role IN ('host', 'participant')),
    UNIQUE(class_id, user_id)
);

-- Recordings table
CREATE TABLE recordings (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id),
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    duration INTEGER, -- in seconds
    file_size BIGINT, -- in bytes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX idx_classes_scheduled_at ON classes(scheduled_at);
CREATE INDEX idx_class_participants_class_id ON class_participants(class_id);
CREATE INDEX idx_class_participants_user_id ON class_participants(user_id);
```

### 3.2 Database Connection
Create `src/database/connection.ts`:
```typescript
import { Pool } from 'pg';
import Redis from 'ioredis';

// PostgreSQL connection
export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Redis connection
export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Test connections
export const testConnections = async () => {
  try {
    // Test PostgreSQL
    const pgResult = await db.query('SELECT NOW()');
    console.log('PostgreSQL connected:', pgResult.rows[0]);
    
    // Test Redis
    await redis.set('test', 'connection');
    const redisResult = await redis.get('test');
    console.log('Redis connected:', redisResult);
    
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};
```

## Step 4: Authentication System

### 4.1 Auth Middleware
Create `src/middleware/auth.ts`:
```typescript
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { db } from '../database/connection';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Verify user still exists
    const userResult = await db.query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = userResult.rows[0];
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

### 4.2 Auth Routes
Create `src/routes/auth.ts`:
```typescript
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/connection';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'student' } = req.body;

    // Check if user exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const result = await db.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, role',
      [email, passwordHash, firstName, lastName, role]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await db.query(
      'SELECT id, email, password_hash, first_name, last_name, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

## Step 5: Class Management

### 5.1 Class Routes
Create `src/routes/classes.ts`:
```typescript
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/connection';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Create class (teachers only)
router.post('/', authenticateToken, requireRole(['teacher', 'admin']), async (req: AuthRequest, res) => {
  try {
    const { title, description, scheduledAt, duration = 60, maxParticipants = 50 } = req.body;
    const teacherId = req.user!.id;
    const roomId = uuidv4();

    const result = await db.query(
      `INSERT INTO classes (title, description, teacher_id, scheduled_at, duration, max_participants, room_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, teacherId, scheduledAt, duration, maxParticipants, roomId]
    );

    res.status(201).json({
      message: 'Class created successfully',
      class: result.rows[0]
    });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get classes
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    let query = '';
    let params: any[] = [];

    if (userRole === 'teacher') {
      // Teachers see their own classes
      query = `
        SELECT c.*, u.first_name, u.last_name,
               (SELECT COUNT(*) FROM class_participants cp WHERE cp.class_id = c.id) as participant_count
        FROM classes c
        JOIN users u ON c.teacher_id = u.id
        WHERE c.teacher_id = $1
        ORDER BY c.scheduled_at DESC
      `;
      params = [userId];
    } else {
      // Students see classes they're enrolled in
      query = `
        SELECT c.*, u.first_name, u.last_name,
               (SELECT COUNT(*) FROM class_participants cp WHERE cp.class_id = c.id) as participant_count
        FROM classes c
        JOIN users u ON c.teacher_id = u.id
        JOIN class_participants cp ON c.id = cp.class_id
        WHERE cp.user_id = $1
        ORDER BY c.scheduled_at DESC
      `;
      params = [userId];
    }

    const result = await db.query(query, params);
    res.json({ classes: result.rows });
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Join class
router.post('/:classId/join', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { classId } = req.params;
    const userId = req.user!.id;

    // Check if class exists and is not ended
    const classResult = await db.query(
      'SELECT * FROM classes WHERE id = $1 AND status != $2',
      [classId, 'ended']
    );

    if (classResult.rows.length === 0) {
      return res.status(404).json({ error: 'Class not found or has ended' });
    }

    // Check if already joined
    const existingParticipant = await db.query(
      'SELECT id FROM class_participants WHERE class_id = $1 AND user_id = $2',
      [classId, userId]
    );

    if (existingParticipant.rows.length > 0) {
      return res.status(400).json({ error: 'Already joined this class' });
    }

    // Add participant
    await db.query(
      'INSERT INTO class_participants (class_id, user_id, joined_at) VALUES ($1, $2, NOW())',
      [classId, userId]
    );

    res.json({ message: 'Successfully joined class' });
  } catch (error) {
    console.error('Join class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

## Step 6: Package.json Scripts

Update your `package.json`:
```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:setup": "psql $DATABASE_URL -f src/database/schema.sql"
  }
}
```

## Step 7: Quick Start Commands

```bash
# 1. Install PostgreSQL and Redis
brew install postgresql redis  # macOS
# or
sudo apt install postgresql redis-server  # Ubuntu

# 2. Start services
brew services start postgresql redis  # macOS
# or
sudo systemctl start postgresql redis  # Ubuntu

# 3. Create database
createdb eniac_classes

# 4. Clone and setup
git clone <your-repo>
cd eniac-backend
npm install

# 5. Setup environment
cp .env.example .env
# Edit .env with your configuration

# 6. Setup database
npm run db:setup

# 7. Start development server
npm run dev
```

## Next Steps

1. **Test the basic setup** - Start the server and test auth endpoints
2. **Add mediasoup integration** - For WebRTC functionality
3. **Implement Socket.IO events** - For real-time communication
4. **Add recording functionality** - For class recordings
5. **Frontend integration** - Connect with your React app

The server will run on `http://localhost:3001` and be ready to handle authentication and basic class management.
