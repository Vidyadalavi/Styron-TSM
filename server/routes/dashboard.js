import express from 'express';
import Order from '../models/Order.js';
import Quotation from '../models/Quotation.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// ----------------------------------------------------
// GET /api/dashboard/summary
// Admin only — powers the Admin Panel dashboard with real data
// (replaces the hardcoded mock numbers that used to live in the frontend).
// ----------------------------------------------------
router.get('/summary', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [orders, quotations] = await Promise.all([
      Order.find().sort({ createdAt: -1 }),
      Quotation.find().sort({ createdAt: -1 }),
    ]);

    // Cancelled orders don't count as revenue.
    const revenueOrders = orders.filter(o => o.status !== 'Cancelled');
    const totalRevenue = revenueOrders.reduce((sum, o) => sum + o.total, 0);

    const activeOrders = orders.filter(o => ['Pending', 'Processing', 'Shipped'].includes(o.status)).length;
    const pendingDelivery = orders.filter(o => ['Pending', 'Processing'].includes(o.status)).length;
    const newQuotes = quotations.filter(q => q.status === 'New').length;

    // --- Month-over-month revenue growth ---
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonthRevenue = revenueOrders
      .filter(o => o.createdAt >= startOfThisMonth)
      .reduce((s, o) => s + o.total, 0);
    const lastMonthRevenue = revenueOrders
      .filter(o => o.createdAt >= startOfLastMonth && o.createdAt < startOfThisMonth)
      .reduce((s, o) => s + o.total, 0);
    const revenueGrowth = lastMonthRevenue > 0
      ? Number((((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1))
      : null;

    // --- Weekly breakdown for the current month ---
    const weekTotals = [0, 0, 0, 0, 0];
    revenueOrders
      .filter(o => o.createdAt >= startOfThisMonth)
      .forEach(o => {
        const day = new Date(o.createdAt).getDate();
        const weekIdx = Math.min(Math.floor((day - 1) / 7), 4);
        weekTotals[weekIdx] += o.total;
      });
    const maxWeek = Math.max(...weekTotals, 1);
    const weeklyBreakdown = weekTotals.map((v, i) => ({
      label: `Week ${i + 1}`,
      value: Math.round((v / maxWeek) * 100),
    }));

    // --- Last 12 months revenue (for the sparkline) ---
    const monthlyRevenue = [];
    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const sum = revenueOrders
        .filter(o => o.createdAt >= start && o.createdAt < end)
        .reduce((s, o) => s + o.total, 0);
      monthlyRevenue.push(sum);
    }

    // --- Product mix, grouped by line item title ---
    const mixMap = {};
    revenueOrders.forEach(o => {
      o.lineItems.forEach(li => {
        mixMap[li.title] = (mixMap[li.title] || 0) + li.amount;
      });
    });
    const mixTotal = Object.values(mixMap).reduce((s, v) => s + v, 0) || 1;
    const palette = ['var(--gold)', 'var(--blue)', '#a78bfa', 'var(--green)', '#f472b6', '#38bdf8'];
    const productMix = Object.entries(mixMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([label, value], i) => ({
        label,
        value: Math.round((value / mixTotal) * 100),
        color: palette[i % palette.length],
      }));

    // --- Recent orders for the dashboard table ---
    const recentOrders = orders.slice(0, 5).map(o => ({
      id: o.orderId,
      customer: o.fullName,
      total: o.total,
      status: o.status,
    }));

    // --- Combined activity feed (recent orders + recent quotes) ---
    const activity = [
      ...orders.slice(0, 5).map(o => ({
        color: o.status === 'Cancelled' ? 'red' : o.status === 'Delivered' ? 'green' : 'blue',
        text: `Order ${o.orderId} from ${o.fullName} — \u20b9${(o.total / 100000).toFixed(2)}L (${o.status})`,
        time: o.createdAt,
      })),
      ...quotations.slice(0, 5).map(q => ({
        color: 'gold',
        text: `Quote request ${q.quoteNumber} from ${q.fullName}`,
        time: q.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 6);

    res.json({
      stats: { totalRevenue, revenueGrowth, activeOrders, newQuotes, pendingDelivery },
      monthlyRevenue,
      weeklyBreakdown,
      productMix,
      recentOrders,
      activity,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard summary' });
  }
});

export default router;