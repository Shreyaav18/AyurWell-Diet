import mongoose, { Schema } from 'mongoose';
import { IPatient } from '../types';

const patientSchema = new Schema<IPatient>(
  {
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age cannot be negative'],
      max: [120, 'Age must be realistic']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Gender is required']
    },
    doshaType: {
      type: String,
      enum: ['vata', 'pitta', 'kapha', 'vata-pitta', 'pitta-kapha', 'vata-kapha', 'tridosha'],
      required: [true, 'Dosha type is required']
    },
    medicalConditions: [{
      type: String,
      trim: true
    }],
    allergies: [{
      type: String,
      trim: true
    }],
    height: {
      type: Number,
      required: [true, 'Height is required'],
      min: [0, 'Height cannot be negative']
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [0, 'Weight cannot be negative']
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very-active'],
      default: 'moderate'
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Doctor ID is required']
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IPatient>('Patient', patientSchema);