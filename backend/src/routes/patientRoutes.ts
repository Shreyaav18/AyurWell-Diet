import express from 'express';
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  calculateBMI
} from '../controllers/patientController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getAllPatients);
router.get('/:id', protect, getPatientById);
router.get('/:id/bmi', protect, calculateBMI);
router.post('/', protect, createPatient);
router.put('/:id', protect, updatePatient);
router.delete('/:id', protect, deletePatient);

export default router;