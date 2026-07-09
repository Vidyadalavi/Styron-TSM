import mongoose from 'mongoose';

const orderLineItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.Mixed }, // slug from your products data
  title: { type: String, required: true },
  icon: { type: String, default: '' },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // e.g. "ORD-2024"
  fullName: { type: String, required: true },
  company: { type: String, default: '' },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, default: '' },
  state: { type: String, default: '' },
  lineItems: { type: [orderLineItemSchema], default: [] },
  subtotal: { type: Number, default: 0 },
  gst: { type: Number, default: 0 },
  delivery: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentId: { type: String, default: '' }, // Razorpay payment id, once paid
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
