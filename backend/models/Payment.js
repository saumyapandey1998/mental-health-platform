// models/Payment.js
import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  cardHolder: { type: String, required: true },
  cardNumber: { type: String, required: true },
  expiryDate: { type: String, required: true },
  cvv: { type: String, required: true },
  status: {
    type: String,
    enum: ['paid', 'failed'],
    default: 'paid',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ This is the proper way for ES Modules
const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;
