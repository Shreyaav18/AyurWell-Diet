import express from 'express';
import { validateAyurvedicCompliance } from '../controllers/ayurvedicComplianceController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/validate', protect, validateAyurvedicCompliance);

export default router;