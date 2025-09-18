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
