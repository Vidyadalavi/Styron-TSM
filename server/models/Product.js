import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // Human-friendly slug used in the frontend, e.g. "tsm-stirrups"
  // This stays stable even if the MongoDB _id changes, so cart items,
  // order line items, etc. can keep referencing it safely.
  slug: { type: String, required: true, unique: true },

  sku: { type: String, required: true, unique: true },
  icon: { type: String, default: '⬡' },
  image: { type: String, default: '' },
  category: { type: String, required: true },
  grade: { type: String, default: '' },
  title: { type: String, required: true },
  desc: { type: String, default: '' },
  tags: { type: [String], default: [] },
  price: { type: Number, required: true, min: 0 },
  unit: { type: String, default: 'per quintal (100 kg)' },
  badge: { type: String, default: null },
  stock: { type: Number, default: 0, min: 0 },
  active: { type: Boolean, default: true },
}, {
  timestamps: true, // adds createdAt / updatedAt automatically
});

export default mongoose.model('Product', productSchema);
