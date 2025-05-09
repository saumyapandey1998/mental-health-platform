import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  therapist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  anonymous: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  adminReply: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Feedback', FeedbackSchema);