import { Request, Response } from 'express';
import Patient from '../models/Patient';
import MedicalHistory from '../models/medicalHistory';

export const getAllPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const doctorId = req.user?.userId;

    const query = req.user?.role === 'admin' ? {} : { doctorId };

    const patients = await Patient.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Patient.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        patients,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch patients'
    });
  }
};

export const getPatientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findById(req.params.id).populate('doctorId', 'firstName lastName email');

    if (!patient) {
      res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
      return;
    }

    if (req.user?.role !== 'admin' && patient.doctorId.toString() == req.user?.userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access this patient'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { patient }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch patient'
    });
  }
};

export const createPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const patientData = {
      ...req.body,
      doctorId: req.user?.userId
    };

    const patient = await Patient.create(patientData);
    if (req.body.medicalConditions && req.body.medicalConditions.length > 0) {
      await MedicalHistory.create({
        patientId: patient._id,
        eventType: 'diagnosis',
        date: new Date(),
        title: 'Initial Medical Conditions',
        description: `Initial medical conditions recorded: ${req.body.medicalConditions.join(', ')}`,
        createdBy: req.user?.userId
      });
    }

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: { patient }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create patient'
    });
  }
};

export const updatePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
      return;
    }

    if (req.user?.role !== 'admin' && patient.doctorId.toString() !== req.user?.userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this patient'
      });
      return;
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: { patient: updatedPatient }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update patient'
    });
  }
};

export const deletePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
      return;
    }

    if (req.user?.role !== 'admin' && patient.doctorId.toString() !== req.user?.userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this patient'
      });
      return;
    }

    await Patient.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete patient'
    });
  }
};

export const calculateBMI = async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
      return;
    }

    const heightInMeters = patient.height / 100;
    const bmi = patient.weight / (heightInMeters * heightInMeters);
    
    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    res.status(200).json({
      success: true,
      data: {
        bmi: parseFloat(bmi.toFixed(2)),
        category
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to calculate BMI'
    });
  }
};