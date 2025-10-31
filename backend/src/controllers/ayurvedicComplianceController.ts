import { Request, Response } from 'express';
import { checkAyurvedicCompliance } from '../services/ayurvedicComplianceService';

export const validateAyurvedicCompliance = async (req: Request, res: Response) => {
  try {
    const { items, doshaType, season } = req.body;

    if (!items || !doshaType) {
      return res.status(400).json({ 
        message: 'items and doshaType are required' 
      });
    }

    const result = await checkAyurvedicCompliance(items, doshaType, season);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};