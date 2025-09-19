import { Pool } from 'pg';
import { Redis } from 'ioredis';

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
