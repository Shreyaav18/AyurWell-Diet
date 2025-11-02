import { Request, Response } from 'express';
import { generateMealSuggestions } from '../services/mealSuggestionService';

export const getMealSuggestions = async (req: Request, res: Response) => {
  try {
    const { patientId, mealType, targetCalories, excludeFoodIds } = req.body;

    if (!patientId || !mealType || !targetCalories) {
      return res.status(400).json({ 
        message: 'patientId, mealType, and targetCalories are required' 
      });
    }

    const suggestions = await generateMealSuggestions({
      patientId,
      mealType,
      targetCalories: Number(targetCalories),
      excludeFoodIds: excludeFoodIds || []
    });

    res.status(200).json(suggestions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};