import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  subject: { type: String, default: 'General Enquiry' },
  body: { type: String, required: true },
  read: { type: Boolean, default: false },
  reply: { type: String, default: '' },
  repliedAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.models.Message || mongoose.model('Message', messageSchema);