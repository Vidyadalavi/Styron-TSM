import mongoose from 'mongoose';

// Company info is a single document — there's only ever one company.
// We enforce that with a fixed key so upserts always hit the same row.
const settingsSchema = new mongoose.Schema({
  key: { type: String, default: 'company', unique: true },
  companyName: { type: String, default: 'STYRON TSM Steel' },
  gstNumber: { type: String, default: '' },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);