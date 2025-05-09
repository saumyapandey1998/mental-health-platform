import express from 'express';
import {
  searchTherapists,
  getBookedSlots,
  bookAppointment,
  updateAppointmentStatus,
  modifyAppointment,
  getAppointments,
  disableSlot,
  completeAppointment,
  getCompletedAppointments,
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/therapists', protect, searchTherapists);
router.get('/slots', protect, getBookedSlots);
router.post('/book', protect, bookAppointment);
router.put('/status', protect, updateAppointmentStatus);
router.put('/modify', protect, modifyAppointment);
router.get('/', protect, getAppointments);
router.post('/disable-slot', protect, disableSlot);
router.put('/complete', protect, completeAppointment);
router.get('/completed', protect, getCompletedAppointments);

export default router;