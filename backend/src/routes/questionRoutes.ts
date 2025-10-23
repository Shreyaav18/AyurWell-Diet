import express from 'express';
import {
  getAllQuestions,
  createQuestion,
  getQuestionById,
  deleteQuestion,
} from '../controllers/questionController';

import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/',protect, getAllQuestions);
router.post('/',protect, createQuestion);
router.get('/:id', protect, getQuestionById);
router.delete('/:id',protect, deleteQuestion);

export default router;