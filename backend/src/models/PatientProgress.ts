import mongoose, { Schema, Document } from 'mongoose';

export interface IPatientProgress extends Document {
  patientId: mongoose.Types.ObjectId;
  dietChartId: mongoose.Types.ObjectId;
  date: Date;
  weight: number;
  energyLevel: number;
  digestionQuality: number;
  doshaBalanceScore: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const patientProgressSchema = new Schema<IPatientProgress>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient ID is required']
    },
    dietChartId: {
      type: Schema.Types.ObjectId,
      ref: 'DietChart',
      required: [true, 'Diet chart ID is required']
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now
    },
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative']
    },
    energyLevel: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, 'Energy level is required']
    },
    digestionQuality: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, 'Digestion quality is required']
    },
    doshaBalanceScore: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, 'Dosha balance score is required']
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

patientProgressSchema.index({ patientId: 1, date: -1 });

export default mongoose.model<IPatientProgress>('PatientProgress', patientProgressSchema);