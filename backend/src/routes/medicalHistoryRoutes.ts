import express from 'express';
import {
  getPatientHistory,
  addHistoryEvent,
  getHistoryById,
  updateHistoryEvent,
  deleteHistoryEvent
} from '../controllers/medicalHistoryController';

const router = express.Router();

router.get('/patient/:patientId', getPatientHistory);
router.post('/', addHistoryEvent);
router.get('/:id', getHistoryById);
router.put('/:id',  updateHistoryEvent);
router.delete('/:id', deleteHistoryEvent);

export default router;