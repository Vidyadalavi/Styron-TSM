import express from 'express';
import SteelPrice from '../models/SteelPrice.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// ----------------------------------------------------
// GET /api/steel-price
// Public — read the current price for the top banner.
// ----------------------------------------------------
router.get('/', async (req, res) => {
  try {
    let doc = await SteelPrice.findOne({ key: 'current' });
    if (!doc) {
      // First run — nothing set yet, seed a starting value so the banner
      // always has something to show instead of erroring on a fresh install.
      doc = await SteelPrice.create({ key: 'current', price: 52000, unit: 'per MT', changePercent: 0 });
    }
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch steel price' });
  }
});

// ----------------------------------------------------
// PUT /api/steel-price
// Admin only — update the price shown on the site.
// ----------------------------------------------------
router.put('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { price, unit, changePercent } = req.body;
    if (price === undefined || isNaN(price)) {
      return res.status(400).json({ error: 'A valid price is required' });
    }

    const doc = await SteelPrice.findOneAndUpdate(
      { key: 'current' },
      {
        price,
        ...(unit !== undefined && { unit }),
        ...(changePercent !== undefined && { changePercent }),
        updatedBy: req.user.email,
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update steel price', details: err.message });
  }
});

export default router;
