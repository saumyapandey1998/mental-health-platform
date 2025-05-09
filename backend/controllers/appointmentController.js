import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import mongoose from 'mongoose';


// Schema for Disabled Slots
const DisabledSlotSchema = new mongoose.Schema({
  therapist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Format: MM/DD/YYYY
  time: { type: String, required: true }, // Format: HH:mm
});

const DisabledSlot = mongoose.model('DisabledSlot', DisabledSlotSchema);

function parseDate(dateStr) {
  if (!dateStr) return null;
  const [month, day, year] = dateStr.split('/');
  return new Date(`${year}-${month}-${day}`);
}

export const searchTherapists = async (req, res) => {
  try {
    const { specialization, date } = req.query;
    const query = { role: 'therapist' };
    if (specialization) query.specialization = specialization;

    let therapists = await User.find(query);
    if (date) {
      const start = parseDate(date);
      if (!start || isNaN(start.getTime())) {
        return res.status(400).json({ message: 'Invalid date format, use MM/DD/YYYY' });
      }
      const end = new Date(start);
      end.setDate(start.getDate() + 1);

      const appointments = await Appointment.find({
        therapist: { $in: therapists.map((t) => t._id) },
        date: { $gte: start, $lt: end },
        status: { $ne: 'cancelled' },
      });
      const bookedTherapists = appointments.map((a) => a.therapist.toString());
      therapists = therapists.filter((t) => !bookedTherapists.includes(t._id.toString()));
    }
    res.json(therapists);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBookedSlots = async (req, res) => {
  try {
    const { therapistId, date } = req.query;
    if (!therapistId || !date) {
      return res.status(400).json({ message: 'Therapist ID and date required' });
    }
    const start = parseDate(date);
    if (!start || isNaN(start.getTime())) {
      return res.status(400).json({ message: 'Invalid date format, use MM/DD/YYYY' });
    }
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    // Fetch booked appointments
    const appointments = await Appointment.find({
      therapist: therapistId,
      date: { $gte: start, $lt: end },
      status: { $ne: 'cancelled' },
    });

    const bookedTimes = appointments.map((appt) =>
      new Date(appt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    );

    // Fetch disabled slots for the therapist on this date
    const disabledSlots = await DisabledSlot.find({
      therapist: therapistId,
      date: date,
    });

    const disabledTimes = disabledSlots.map((slot) => slot.time);

    // Combine booked and disabled slots
    const unavailableTimes = [...new Set([...bookedTimes, ...disabledTimes])];

    res.json(unavailableTimes);
  } catch (error) {
    console.error('Error in getBookedSlots:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const disableSlot = async (req, res) => {
  try {
    const { therapistId, date, time } = req.body;
    if (!therapistId || !date || !time) {
      return res.status(400).json({ message: 'Therapist ID, date, and time required' });
    }

    // Verify the user is the therapist
    if (req.user.id !== therapistId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if the slot is already disabled
    const existingDisabledSlot = await DisabledSlot.findOne({
      therapist: therapistId,
      date: date,
      time: time,
    });
    if (existingDisabledSlot) {
      return res.status(400).json({ message: 'Slot already disabled' });
    }

    const disabledSlot = new DisabledSlot({
      therapist: therapistId,
      date: date,
      time: time,
    });
    await disabledSlot.save();

    res.status(201).json({ message: 'Slot disabled successfully' });
  } catch (error) {
    console.error('Error in disableSlot:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const bookAppointment = async (req, res) => {
  try {
    const { therapistId, date, time } = req.body;
    const patientId = req.user.id;
    if (!date || !time) {
      return res.status(400).json({ message: 'Date and time required' });
    }

    const [month, day, year] = date.split('/');
    const fullDate = new Date(`${year}-${month}-${day} ${time}:00`).toISOString();

    // Check for existing appointment
    const conflict = await Appointment.findOne({
      therapist: therapistId,
      date: fullDate,
      status: { $ne: 'cancelled' },
    });
    if (conflict) {
      return res.status(400).json({ message: 'Slot already booked' });
    }

    // Check if the slot is disabled
    const disabledSlot = await DisabledSlot.findOne({
      therapist: therapistId,
      date: date,
      time: time,
    });
    if (disabledSlot) {
      return res.status(400).json({ message: 'Slot is disabled by the therapist' });
    }

    const appointment = new Appointment({
      patient: patientId,
      therapist: therapistId,
      date: fullDate,
      status: 'pending',
    });
    await appointment.save();

    res.status(201).json({ message: 'Appointment request sent', appointment });
  } catch (error) {
    console.error('Error in bookAppointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    
    if (!appointmentId || !status) {
      return res.status(400).json({ message: 'Appointment ID and status are required' });
    }

    const appointment = await Appointment.findById(appointmentId).populate('therapist');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.therapist._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this appointment' });
    }

    appointment.status = status;
    appointment.updatedAt = Date.now();
    await appointment.save();

    res.json({ 
      success: true,
      message: `Appointment ${status} successfully`,
      appointment 
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update appointment status',
      error: error.message 
    });
  }
};

export const modifyAppointment = async (req, res) => {
  try {
    const { appointmentId, action, newDate, newTime } = req.body;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (![appointment.patient.toString(), appointment.therapist.toString()].includes(req.user.id)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (action === 'cancel') {
      appointment.status = 'cancelled';
    } else if (action === 'reschedule') {
      if (!newDate || !newTime) return res.status(400).json({ message: 'New date and time are required' });

      const [month, day, year] = newDate.split('/');
      const isoDate = new Date(`${year}-${month}-${day} ${newTime}:00`).toISOString();
      if (isNaN(new Date(isoDate).getTime())) {
        return res.status(400).json({ message: 'Invalid new date or time format' });
      }

      // Check for existing appointment
      const conflict = await Appointment.findOne({
        therapist: appointment.therapist,
        date: isoDate,
        status: { $ne: 'cancelled' },
        _id: { $ne: appointmentId },
      });
      if (conflict) {
        return res.status(400).json({ message: 'Slot already booked' });
      }

      // Check if the new slot is disabled
      const disabledSlot = await DisabledSlot.findOne({
        therapist: appointment.therapist,
        date: newDate,
        time: newTime,
      });
      if (disabledSlot) {
        return res.status(400).json({ message: 'Slot is disabled by the therapist' });
      }

      const appointmentDate = new Date(isoDate);
      const now = new Date();
      const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      if (appointmentDate < twentyFourHoursLater) {
        return res.status(400).json({ message: 'Rescheduling too close to appointment time' });
      }

      appointment.date = isoDate;
      appointment.status = 'pending';
    }

    appointment.updatedAt = Date.now();
    await appointment.save();

    res.json({ message: `Appointment ${action}d`, appointment });
  } catch (error) {
    console.error('Error in modifyAppointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      $or: [{ patient: req.user.id }, { therapist: req.user.id }],
    }).populate('patient therapist');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};