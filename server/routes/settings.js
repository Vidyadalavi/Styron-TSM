import express from 'express';
import Settings from '../models/Settings.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// ----------------------------------------------------
// GET /api/settings/company
// Admin only — returns the single company-info document,
// creating it with defaults on first ever request.
// ----------------------------------------------------
router.get('/company', authenticateToken, requireAdmin, async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: 'company' });
    if (!settings) {
      settings = await Settings.create({ key: 'company' });
    }
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch company settings' });
  }
});

// ----------------------------------------------------
// PUT /api/settings/company
// Admin only — updates (or creates) the company-info document.
// ----------------------------------------------------
router.put('/company', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { companyName, gstNumber, address, phone, email } = req.body;
    const settings = await Settings.findOneAndUpdate(
      { key: 'company' },
      { companyName, gstNumber, address, phone, email },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to save company settings', details: err.message });
  }
});

export default router;