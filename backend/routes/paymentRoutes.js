// routes/paymentRoutes.js
import express from 'express';
import Payment from '../models/Payment.js'; // 
import Appointment from '../models/Appointment.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { appointmentId, cardHolder, cardNumber, expiryDate, cvv } = req.body;

  try {
    // Save payment record
    const payment = new Payment({
      appointmentId,
      cardHolder,
      cardNumber,
      expiryDate,
      cvv,
    });
    await payment.save();

    // Update appointment status
    await Appointment.findByIdAndUpdate(appointmentId, {
      status: 'completed',
    });

    res.status(201).json({ message: 'Payment successful' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Payment failed' });
  }
});

export default router;
