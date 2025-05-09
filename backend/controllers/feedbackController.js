import Feedback from '../models/Feedback.js';
import Appointment from '../models/Appointment.js';
import mongoose from 'mongoose';

const getFeedbacks = async (req, res) => {
  try {
    const { appointmentId } = req.query;
    let query = {};

    if (appointmentId) {
      if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        return res.status(400).json({ message: 'Invalid appointment ID' });
      }
      query.appointment = appointmentId;
    } else if (req.user.role === 'therapist') {
      query.therapist = req.user.id; // ✅ direct field on Feedback
    }

    const feedbacks = await Feedback.find(query)
      .populate({
        path: 'appointment',
        populate: [
          { path: 'therapist', select: 'username' },
          { path: 'patient', select: 'username' }
        ]
      })
      .populate('patient', 'username')
      .populate('therapist', 'username');

    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: 'Error fetching feedbacks' });
  }
};


const submitFeedback = async (req, res) => {
  const { appointmentId, rating, review, anonymous } = req.body;
  try {
    const appointment = await Appointment.findById(appointmentId)
      .populate('patient therapist');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    if (appointment.status !== 'completed') {
      return res.status(400).json({ message: 'Only completed sessions can be reviewed' });
    }
    
    if (appointment.patient._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to review this appointment' });
    }

    const existingFeedback = await Feedback.findOne({ appointment: appointmentId });
    if (existingFeedback) {
      return res.status(400).json({ message: 'Feedback already submitted for this appointment' });
    }

    const feedback = new Feedback({
      appointment: appointmentId,
      patient: req.user.id,
      therapist: appointment.therapist._id,
      rating,
      review,
      anonymous,
      status: 'pending',
    });
    
    await feedback.save();
    res.json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Error submitting feedback' });
  }
};

const moderateFeedback = async (req, res) => {
  const { action, reply } = req.body;
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can moderate feedback' });
    }

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (action === 'approve') {
      feedback.status = 'approved';
    } else if (action === 'delete') {
      await feedback.deleteOne();
      return res.json({ message: 'Feedback deleted successfully' });
    } else if (action === 'reply') {
      if (!reply) return res.status(400).json({ message: 'Reply text is required' });
      feedback.adminReply = reply;
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await feedback.save();
    res.json({ message: `Feedback ${action}ed successfully` });
  } catch (error) {
    console.error(`Error ${action}ing feedback:`, error);
    res.status(500).json({ message: `Error ${action}ing feedback` });
  }
};

export default {
  getFeedbacks,
  submitFeedback,
  moderateFeedback,
};