import express from 'express';
import Order from '../models/Order.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Thresholds for customer tier, based on total lifetime spend.
// Tune these to whatever makes sense for your business.
function tierFor(totalSpend) {
  if (totalSpend >= 2000000) return 'Enterprise'; // ₹20L+
  if (totalSpend >= 500000) return 'Business';    // ₹5L+
  return 'Regular';
}

// ----------------------------------------------------
// GET /api/customers
// Admin only — one row per unique customer email, aggregated from Orders:
// name, city, order count, total lifetime spend, tier, and first-order date.
// ----------------------------------------------------
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const rows = await Order.aggregate([
      {
        $group: {
          _id: '$email',
          fullName: { $last: '$fullName' },   // most recent name on file for this email
          company: { $last: '$company' },
          phone: { $last: '$phone' },
          city: { $last: '$city' },
          orders: { $sum: 1 },
          spend: { $sum: '$total' },
          since: { $min: '$createdAt' },
          lastOrder: { $max: '$createdAt' },
        },
      },
      { $sort: { spend: -1 } },
    ]);

    const customers = rows.map(r => ({
      email: r._id,
      fullName: r.fullName,
      company: r.company,
      phone: r.phone,
      city: r.city,
      orders: r.orders,
      spend: r.spend,
      type: tierFor(r.spend),
      since: r.since,
      lastOrder: r.lastOrder,
    }));

    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// ----------------------------------------------------
// GET /api/customers/:email/orders
// Admin only — every order placed by a specific customer, for the detail view.
// ----------------------------------------------------
router.get('/:email/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch customer orders' });
  }
});

export default router;
