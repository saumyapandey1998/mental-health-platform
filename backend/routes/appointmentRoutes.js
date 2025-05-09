import express from 'express';
import {
  searchTherapists,
  getBookedSlots,
  bookAppointment,
  updateAppointmentStatus,
  modifyAppointment,
  getAppointments,
  disableSlot
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/therapists', protect, searchTherapists);
router.get('/slots', protect, getBookedSlots); // Add this route
router.post('/book', protect, bookAppointment);
router.put('/status', protect, updateAppointmentStatus);
router.put('/modify', protect, modifyAppointment);
router.get('/', protect, getAppointments);
router.post('/disable-slot', protect, disableSlot); // Add this route


export default router;