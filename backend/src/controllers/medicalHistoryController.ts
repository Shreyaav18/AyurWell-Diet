import { Request, Response } from 'express';
import MedicalHistory from '../models/medicalHistory';

// Get all medical history for a patient
export const getPatientHistory = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    
    const history = await MedicalHistory.find({ patientId })
      .sort({ date: -1 })
      .populate('createdBy', 'name email');
    
    res.status(200).json(history);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Add new medical history event
export const addHistoryEvent = async (req: Request, res: Response) => {
  try {
    const historyData = {
      ...req.body,
      createdBy: req.user?.userId // From auth middleware
    };
    
    const history = await MedicalHistory.create(historyData);
    
    res.status(201).json(history);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get single history event
export const getHistoryById = async (req: Request, res: Response) => {
  try {
    const history = await MedicalHistory.findById(req.params.id)
      .populate('patientId', 'name age')
      .populate('createdBy', 'name email');
    
    if (!history) {
      return res.status(404).json({ message: 'History event not found' });
    }
    
    res.status(200).json(history);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update history event
export const updateHistoryEvent = async (req: Request, res: Response) => {
  try {
    const history = await MedicalHistory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!history) {
      return res.status(404).json({ message: 'History event not found' });
    }
    
    res.status(200).json(history);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete history event
export const deleteHistoryEvent = async (req: Request, res: Response) => {
  try {
    const history = await MedicalHistory.findByIdAndDelete(req.params.id);
    
    if (!history) {
      return res.status(404).json({ message: 'History event not found' });
    }
    
    res.status(200).json({ message: 'History event deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};