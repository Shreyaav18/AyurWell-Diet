import { Request, Response } from 'express';
import {Question} from '../models/Questions';
import { Assessment } from '../models/Questions';
import Patient from '../models/Patient';
import MedicalHistory from '../models/medicalHistory';

// Get all questions
export const getAllQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await Question.find().sort({ questionNumber: 1 });
    res.status(200).json(questions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new question (for seeding)
export const createQuestion = async (req: Request, res: Response) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get single question by ID
export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json(question);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete question (optional)
export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};







// Submit a new assessment
export const createAssessment = async (req: Request, res: Response) => {
  try {
    const { patientId, responses } = req.body;

    // Calculate scores
    const scores = {
      vata: 0,
      pitta: 0,
      kapha: 0
    };

    // Count each dosha type from responses
    responses.forEach((response: any) => {
      if (response.selectedOption === 'vata') scores.vata++;
      if (response.selectedOption === 'pitta') scores.pitta++;
      if (response.selectedOption === 'kapha') scores.kapha++;
    });

    const totalQuestions = responses.length;

    // Calculate percentages
    const percentages = {
      vata: Math.round((scores.vata / totalQuestions) * 100),
      pitta: Math.round((scores.pitta / totalQuestions) * 100),
      kapha: Math.round((scores.kapha / totalQuestions) * 100)
    };

    // Determine result dosha type
    let resultDoshaType = '';
    const sortedDoshas = Object.entries(percentages)
      .sort(([, a], [, b]) => b - a);

    if (sortedDoshas[0][1] >= 50) {
      // Single dominant dosha
      resultDoshaType = sortedDoshas[0][0];
    } else if (sortedDoshas[0][1] >= 30 && sortedDoshas[1][1] >= 30) {
      // Dual dosha
      resultDoshaType = `${sortedDoshas[0][0]}-${sortedDoshas[1][0]}`;
    } else {
      // Tridosha (balanced)
      resultDoshaType = 'tridosha';
    }

    // Create assessment
    const assessment = await Assessment.create({
      patientId,
      assessmentDate: new Date(),
      responses,
      scores,
      percentages,
      resultDoshaType,
      completedAt: new Date()
    });

    // Optional: Update patient's doshaType field
    await Patient.findByIdAndUpdate(patientId, { doshaType: resultDoshaType });

    await MedicalHistory.create({
      patientId: patientId,
      eventType: 'assessment',
      date: new Date(),
      title: 'Prakriti Assessment Completed',
      description: `Dosha constitution determined as: ${resultDoshaType.toUpperCase()}. Vata: ${percentages.vata}%, Pitta: ${percentages.pitta}%, Kapha: ${percentages.kapha}%`,
      relatedData: { assessmentId: assessment._id },
      createdBy: req.user?.userId
    });
    res.status(201).json(assessment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get all assessments for a patient
export const getPatientAssessments = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const assessments = await Assessment.find({ patientId })
      .sort({ assessmentDate: -1 })
      .populate('responses.questionId');
    
    res.status(200).json(assessments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get single assessment by ID
export const getAssessmentById = async (req: Request, res: Response) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('patientId')
      .populate('responses.questionId');
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    res.status(200).json(assessment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete assessment (optional)
export const deleteAssessment = async (req: Request, res: Response) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    res.status(200).json({ message: 'Assessment deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};