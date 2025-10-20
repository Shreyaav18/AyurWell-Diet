import express from 'express';
import {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  bulkImportFoods,
  getFoodCategories
} from '../controllers/foodController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getAllFoods);
router.get('/categories', protect, getFoodCategories);
router.get('/:id', protect, getFoodById);
router.post('/', protect, authorize('admin', 'dietitian'), createFood);
router.put('/:id', protect, authorize('admin', 'dietitian'), updateFood);
router.delete('/:id', protect, authorize('admin'), deleteFood);
router.post('/bulk-import', protect, authorize('admin'), bulkImportFoods);

export default router;