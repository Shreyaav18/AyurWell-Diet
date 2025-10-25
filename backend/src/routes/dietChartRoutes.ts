import express from 'express';
import {
  createDietChart,
  getPatientDietCharts,
  getDietChartById,
  updateDietChartStatus,
  deleteDietChart
} from '../controllers/dietChartController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createDietChart);
router.get('/patient/:patientId', protect, getPatientDietCharts);
router.get('/:id', protect, getDietChartById);
router.patch('/:id/status', protect, updateDietChartStatus);
router.delete('/:id', protect, deleteDietChart);

export default router;