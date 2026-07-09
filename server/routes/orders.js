import express from 'express';
import Order from '../models/Order.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

async function nextOrderId() {
  const last = await Order.findOne().sort({ createdAt: -1 });
  const lastNum = last ? parseInt(last.orderId.replace('ORD-', ''), 10) : 2019;
  return `ORD-${lastNum + 1}`;
}

// ----------------------------------------------------
// POST /api/orders
// Public — called right after a successful checkout/payment.
// ----------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const {
      fullName, company, email, phone, address, city, pincode, state,
      lineItems = [], subtotal = 0, gst = 0, delivery = 0, total, paymentId = '',
    } = req.body;

    if (!fullName || !phone || !email || !address || !city || !total) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const orderId = await nextOrderId();

    const order = await Order.create({
      orderId, fullName, company, email, phone, address, city, pincode, state,
      lineItems, subtotal, gst, delivery, total, paymentId,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to save order', details: err.message });
  }
});

// ----------------------------------------------------
// GET /api/orders/mine
// Any logged-in user — their own orders. Must come before /:orderId.
// ----------------------------------------------------
router.get('/mine', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch your orders' });
  }
});

// ----------------------------------------------------
// GET /api/orders
// Admin only — list every order.
// ----------------------------------------------------
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ----------------------------------------------------
// GET /api/orders/:orderId
// Public — order tracking by ID.
// ----------------------------------------------------
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// ----------------------------------------------------
// PUT /api/orders/:orderId/status
// Admin only.
// ----------------------------------------------------
router.put('/:orderId/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update status', details: err.message });
  }
});

// ----------------------------------------------------
// DELETE /api/orders/:orderId
// Admin only.
// ----------------------------------------------------
router.delete('/:orderId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const deleted = await Order.findOneAndDelete({ orderId: req.params.orderId });
    if (!deleted) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router;
