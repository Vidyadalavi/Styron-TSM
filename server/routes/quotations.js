import express from 'express';
import Quotation from '../models/Quotation.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { sendQuotationEmail } from '../utils/mailer.js';

const router = express.Router();

// Simple sequential quote number generator (swap for something more robust later)
async function nextQuoteNumber() {
  const last = await Quotation.findOne().sort({ createdAt: -1 });
  const lastNum = last ? parseInt(last.quoteNumber.replace('QTN-', ''), 10) : 1023;
  return `QTN-${lastNum + 1}`;
}

// ----------------------------------------------------
// POST /api/quotations
// Public — anyone (logged in or not) can submit a quote request.
// If a JWT is present, we tag the quote with that user's email.
// ----------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const {
      fullName, company, email, phone, gstin, address, city,
      projectType, message, lineItems = [], subtotal = 0, gst = 0, total = 0,
    } = req.body;

    if (!fullName || (!email && !phone)) {
      return res.status(400).json({ error: 'Full name and at least one of email or phone are required' });
    }

    const quoteNumber = await nextQuoteNumber();

    const quotation = await Quotation.create({
      quoteNumber, fullName, company, email, phone, gstin, address, city,
      projectType, message, lineItems, subtotal, gst, total,
    });

    // TEMP DEBUG — remove once the empty-admin-list issue is resolved.
    console.log(`[DEBUG] POST /api/quotations — saved ${quotation.quoteNumber} | status: ${quotation.status} | email: ${quotation.email}`);

    // Fire the confirmation email but don't let a mail failure fail the request —
    // the quotation is already saved, so the customer's request isn't lost either way.
    sendQuotationEmail(quotation).catch(err => {
      console.error('Failed to send quotation email:', err);
    });

    res.status(201).json(quotation);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to submit quotation', details: err.message });
  }
});

// ----------------------------------------------------
// GET /api/quotations
// Admin only — list all quote requests.
// ----------------------------------------------------
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    // TEMP DEBUG — remove once the empty-admin-list issue is resolved.
    console.log(`[DEBUG] GET /api/quotations — admin: ${req.user.email}, found: ${quotations.length} quote(s)`);
    quotations.forEach(q => console.log(`  - ${q.quoteNumber} | status: ${q.status} | email: ${q.email}`));
    res.json(quotations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch quotations' });
  }
});

// ----------------------------------------------------
// GET /api/quotations/mine
// Any logged-in user — returns only quotes matching their own email.
// Must be defined before GET /:quoteNumber, otherwise Express would treat
// "mine" as a quoteNumber value.
// ----------------------------------------------------
router.get('/mine', authenticateToken, async (req, res) => {
  try {
    const quotations = await Quotation.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json(quotations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch your quotations' });
  }
});

// ----------------------------------------------------
// GET /api/quotations/:quoteNumber
// Public — lets a customer track a specific quote by its number.
// ----------------------------------------------------
router.get('/:quoteNumber', async (req, res) => {
  try {
    const quotation = await Quotation.findOne({ quoteNumber: req.params.quoteNumber });
    if (!quotation) return res.status(404).json({ error: 'Quotation not found' });
    res.json(quotation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch quotation' });
  }
});

// ----------------------------------------------------
// PUT /api/quotations/:quoteNumber/status
// Admin only — update status (pending → reviewed/sent/rejected).
// ----------------------------------------------------
router.put('/:quoteNumber/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const quotation = await Quotation.findOneAndUpdate(
      { quoteNumber: req.params.quoteNumber },
      { status },
      { new: true, runValidators: true }
    );
    if (!quotation) return res.status(404).json({ error: 'Quotation not found' });
    res.json(quotation);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update status', details: err.message });
  }
});

// ----------------------------------------------------
// DELETE /api/quotations/:quoteNumber
// Admin only — discard/remove a quote request.
// ----------------------------------------------------
router.delete('/:quoteNumber', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const deleted = await Quotation.findOneAndDelete({ quoteNumber: req.params.quoteNumber });
    if (!deleted) return res.status(404).json({ error: 'Quotation not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete quotation' });
  }
});

export default router;