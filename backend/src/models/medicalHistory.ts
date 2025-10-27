import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicalHistory {
  patientId: mongoose.Types.ObjectId;
  eventType: 'diagnosis' | 'treatment' | 'check-in' | 'note' | 'assessment' | 'diet-plan';
  date: Date;
  title: string;
  description: string;
  relatedData?: any; // Optional: links to assessments, diet plans, etc.
  createdBy: mongoose.Types.ObjectId; // Doctor who added it
  createdAt?: Date;
  updatedAt?: Date;
}


const medicalHistorySchema = new Schema<IMedicalHistory>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient ID is required']
    },
    eventType: {
      type: String,
      enum: ['diagnosis', 'treatment', 'check-in', 'note', 'assessment', 'diet-plan'],
      required: [true, 'Event type is required']
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
      default: Date.now
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    relatedData: {
      type: Schema.Types.Mixed,
      default: null
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator ID is required']
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IMedicalHistory>('MedicalHistory', medicalHistorySchema);