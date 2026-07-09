import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { connectDB } from './db.js';
import productRoutes from './routes/products.js';
import { authenticateToken, requireAdmin } from './middleware/auth.js';
import quotationRoutes from './routes/quotations.js';
import orderRoutes from './routes/orders.js';
import customerRoutes from './routes/customers.js';
import dashboardRoutes from './routes/dashboard.js';
import messageRoutes from './routes/messages.js';
import settingsRoutes from './routes/settings.js';
import steelPriceRoutes from './routes/steelPrice.js';


const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB before anything else
await connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
  
}));

// Raised from the 100kb default so base64-encoded product images
// (sent as JSON strings from the Add Product form) aren't rejected.
app.use(express.json({ limit: '10mb' }));

// ----------------------------------------------------
// Product routes (GET is public, POST/PUT/DELETE require admin)
// ----------------------------------------------------
app.use('/api/products', productRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/steel-price', steelPriceRoutes);

// ----------------------------------------------------
// Anthropic Client
// ----------------------------------------------------
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const SYSTEM_PROMPT = `
You are Styron TSM's AI assistant.

Company: Styron TSM Steel Reinforcement Solutions
Location: Pune, Maharashtra
Products:
- TSM Steel Stirrups
- Square Stirrups
- Ring Stirrups
- Custom Bent Stirrups
- Bulk Steel Supply

Answer professionally in short responses.
`;

// ----------------------------------------------------
// AI Chat
// ----------------------------------------------------
app.post('/api/chat', async (req, res) => {

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({
      error: 'Invalid messages'
    });
  }

  try {

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages
    });

    res.json({
      text: response.content?.[0]?.text || 'No response'
    });

} catch (err) {
  console.error(err);

  res.status(500).json({
    error: "AI service error"
  });
}

});
// ----------------------------------------------------
// Health Check
// ----------------------------------------------------
app.get('/health', (req, res) => {
  res.json({
    ok: true
  });
});

// ----------------------------------------------------
// OTP Store
// ----------------------------------------------------
const otpStore = new Map();

// ----------------------------------------------------
// Nodemailer
// ----------------------------------------------------
// ----------------------------------------------------
// Nodemailer (Brevo)
// ----------------------------------------------------
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

console.log("BREVO_USER:", process.env.BREVO_USER);
console.log("BREVO KEY EXISTS:", !!process.env.BREVO_SMTP_KEY);
console.log("CLIENT_URL:", process.env.CLIENT_URL);

transporter.verify((err, success) => {
  console.log("VERIFY RESULT:", success);

  if (err) {
    console.error("SMTP VERIFY ERROR:", err);
  } else {
    console.log("SMTP Connected");
  }
});
// ----------------------------------------------------
// Send OTP
// ----------------------------------------------------
app.post('/api/auth/send-otp', async (req, res) => {

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: 'Email required'
    });
  }

  // Basic email format check (no longer restricted to a single hardcoded address)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Invalid email address'
    });
  }

  const code = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const expiresAt = Date.now() + 5 * 60 * 1000;
  const normalizedEmail = email.toLowerCase();

  otpStore.set(normalizedEmail, {
    code,
    expiresAt
  });

  try {

    await transporter.sendMail({

     from: '"Styron TSM" <vidyadalavi4475@gmail.com>',

      to: normalizedEmail,

      subject: 'Styron TSM Login OTP',

      html: `
      <div style="font-family:Arial;padding:30px">
      <h2>Styron TSM</h2>

      <p>Your login OTP is:</p>

      <h1>${code}</h1>

      <p>Valid for 5 minutes.</p>

      </div>
      `

    });

    res.json({
      success: true,
      message: 'OTP Sent'
    });

  }    catch (err) {

    console.error("Brevo Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
      code: err.code,
      response: err.response,
    });

  };

});// <-- THIS LINE IS MISSING
// ----------------------------------------------------
// Verify OTP
// ----------------------------------------------------
app.post('/api/auth/verify-otp', (req, res) => {

  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({
      error: 'Email and OTP required'
    });
  }

  const normalizedEmail = email.toLowerCase();

  const record = otpStore.get(normalizedEmail);

  if (!record) {
    return res.status(401).json({
      error: 'OTP not found'
    });
  }

  if (Date.now() > record.expiresAt) {

    otpStore.delete(normalizedEmail);

    return res.status(401).json({
      error: 'OTP expired'
    });

  }

  if (record.code !== code.trim()) {

    return res.status(401).json({
      error: 'Invalid OTP'
    });

  }

  otpStore.delete(normalizedEmail);

  // Only the address configured in ADMIN_EMAIL gets the admin role.
  // Everyone else who verifies an OTP logs in as a normal user.
  const role = (
    process.env.ADMIN_EMAIL &&
    normalizedEmail === process.env.ADMIN_EMAIL.toLowerCase()
  ) ? 'admin' : 'user';

  const token = jwt.sign(

    {
      email: normalizedEmail,
      role
    },

    process.env.JWT_SECRET,

    {
      expiresIn: '7d'
    }

  );

  res.json({

    success: true,

    token,

    email: normalizedEmail,

    role

  });

});

// ----------------------------------------------------
// Protected Admin Route
// ----------------------------------------------------
app.get('/api/admin/profile', authenticateToken, requireAdmin, (req, res) => {

  res.json({
    success: true,
    admin: req.user.email
  });

});

// ----------------------------------------------------
// Protected Route (any logged-in user)
// ----------------------------------------------------
app.get('/api/profile', authenticateToken, (req, res) => {

  res.json({
    success: true,
    email: req.user.email,
    role: req.user.role
  });

});

// ----------------------------------------------------
// Start Server
// ----------------------------------------------------
app.listen(PORT, () => {

  console.log(`🚀 Server running on http://localhost:${PORT}`);

});