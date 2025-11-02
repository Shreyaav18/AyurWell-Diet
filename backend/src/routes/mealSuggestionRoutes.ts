import express from 'express';
import { getMealSuggestions } from '../controllers/mealSuggestionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/generate',protect , getMealSuggestions);

export default router;