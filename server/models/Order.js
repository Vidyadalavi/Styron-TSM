import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema({
  productId: { type: String },
  title: { type: String },
  icon: { type: String, default: '' },
  price: { type: Number },
  qty: { type: Number, default: 1 },
  amount: { type: Number },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  company: { type: String },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String },
  state: { type: String },
  lineItems: { type: [lineItemSchema], default: [] },
  subtotal: { type: Number, default: 0 },
  gst: { type: Number, default: 0 },
  delivery: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentId: { type: String, default: '' },
 status: {
  type: String,
  enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
  default: 'Pending',
},
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);