import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import feedbackController from '../controllers/feedbackController.js';

const router = express.Router();

router.get('/feedbacks', protect, feedbackController.getFeedbacks);
router.post('/feedbacks', protect, feedbackController.submitFeedback);
router.put('/feedbacks/:id', protect, feedbackController.moderateFeedback);

export default router;