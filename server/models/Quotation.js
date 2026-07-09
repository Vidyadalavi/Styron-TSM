import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.Mixed }, // slug or id from your products data
  title: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
}, { _id: false });

const quotationSchema = new mongoose.Schema({
  quoteNumber: { type: String, required: true, unique: true }, // e.g. "QTN-1024"
  fullName: { type: String, required: true },
  company: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  gstin: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  projectType: { type: String, default: '' },
  message: { type: String, default: '' },
  lineItems: { type: [lineItemSchema], default: [] },
  subtotal: { type: Number, default: 0 },
  gst: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  status: { type: String, enum: ['New', 'Contacted', 'Quoted', 'Won'], default: 'New' },
  userEmail: { type: String, default: null }, // set if a logged-in user submitted it
}, { timestamps: true });

export default mongoose.model('Quotation', quotationSchema);