import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  role: 'doctor' | 'dietitian' | 'admin';
  firstName: string;
  lastName: string; 
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IPatient extends Document {
  _id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  doshaType: 'vata' | 'pitta' | 'kapha' | 'vata-pitta' | 'pitta-kapha' | 'vata-kapha' | 'tridosha';
  medicalConditions: string[];
  allergies: string[];
  height: number; // in cm
  weight: number; // in kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  doctorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}