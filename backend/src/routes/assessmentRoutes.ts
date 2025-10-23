import express from 'express';
import {
  getPatientAssessments,
  getAssessmentById,
  createAssessment,
  deleteAssessment
} from '../controllers/questionController';

import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Submit new assessment
router.post('/', protect, createAssessment);
router.get('/patient/:patientId', protect, getPatientAssessments);
router.get('/:id', protect, getAssessmentById);
router.delete('/:id', protect, deleteAssessment);

export default router;