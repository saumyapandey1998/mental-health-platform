import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'therapist'], default: 'patient' },
  specialization: { type: String }, // Add this field for therapists
});

const User = mongoose.model('User', userSchema);
export default User;