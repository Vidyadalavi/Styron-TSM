import mongoose from 'mongoose';

const steelPriceSchema = new mongoose.Schema({
  // Fixed key so there's always exactly one document — simpler than
  // building a whole CRUD collection for a single banner value.
  key: { type: String, default: 'current', unique: true },
  price: { type: Number, required: true },
  unit: { type: String, default: 'per quintal (100 kg)' },
  changePercent: { type: Number, default: 0 }, // e.g. +1.2 or -0.8, shown as an up/down indicator
  updatedBy: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('SteelPrice', steelPriceSchema);
