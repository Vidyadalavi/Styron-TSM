import express from 'express';
import Message from '../models/Message.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { sendMessageReplyEmail } from '../utils/mailer.js';

const router = express.Router();

// ----------------------------------------------------
// POST /api/messages
// Public — submitted from the site's Contact section.
// ----------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, body } = req.body;

    if (!name || !body || (!email && !phone)) {
      return res.status(400).json({ error: 'Name, message, and at least one of email or phone are required' });
    }

    const message = await Message.create({ name, email, phone, subject, body });
    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to send message', details: err.message });
  }
});

// ----------------------------------------------------
// GET /api/messages
// Admin only — inbox list, newest first.
// ----------------------------------------------------
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// ----------------------------------------------------
// PUT /api/messages/:id/read
// Admin only — mark a message as read (called when it's opened).
// ----------------------------------------------------
router.put('/:id/read', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to mark message as read' });
  }
});

// ----------------------------------------------------
// PUT /api/messages/:id/reply
// Admin only — saves the reply text and emails the customer.
// ----------------------------------------------------
router.put('/:id/reply', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply || !reply.trim()) {
      return res.status(400).json({ error: 'Reply text is required' });
    }

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { reply, repliedAt: new Date(), read: true },
      { new: true }
    );
    if (!message) return res.status(404).json({ error: 'Message not found' });

    // Don't let an email failure lose the saved reply — it's already stored either way.
    sendMessageReplyEmail(message).catch(err => {
      console.error('Failed to send reply email:', err);
    });

    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to save reply', details: err.message });
  }
});

// ----------------------------------------------------
// DELETE /api/messages/:id
// Admin only.
// ----------------------------------------------------
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Message not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;