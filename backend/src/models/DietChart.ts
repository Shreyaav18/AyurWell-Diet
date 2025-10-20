import mongoose, { Schema, Document } from 'mongoose';

interface IMealItem {
  type: 'food' | 'recipe';
  itemId: mongoose.Types.ObjectId;
  quantity: number;
  unit: string;
}

interface IMeal {
  mealType: string;
  timeSlot: string;
  items: IMealItem[];
  notes?: string;
}

interface IDayPlan {
  dayNumber: number;
  meals: IMeal[];
}

export interface IDietChart extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  chartType: string;
  startDate: Date;
  endDate: Date;
  targetCalories: number;
  dietaryRestrictions: string[];
  status: string;
  dayPlans: IDayPlan[];
  createdAt: Date;
  updatedAt: Date;
}

const dietChartSchema = new Schema<IDietChart>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient ID is required']
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Doctor ID is required']
    },
    chartType: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      required: [true, 'Chart type is required']
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    targetCalories: {
      type: Number,
      required: [true, 'Target calories are required'],
      min: [500, 'Target calories too low'],
      max: [5000, 'Target calories too high']
    },
    dietaryRestrictions: [{
      type: String,
      trim: true
    }],
    status: {
      type: String,
      enum: ['draft', 'active', 'completed', 'cancelled'],
      default: 'draft'
    },
    dayPlans: [{
      dayNumber: {
        type: Number,
        required: true,
        min: 1
      },
      meals: [{
        mealType: {
          type: String,
          enum: ['breakfast', 'mid-morning-snack', 'lunch', 'evening-snack', 'dinner', 'bedtime-snack'],
          required: true
        },
        timeSlot: {
          type: String,
          required: true
        },
        items: [{
          type: {
            type: String,
            enum: ['food', 'recipe'],
            required: true
          },
          itemId: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'dayPlans.meals.items.type'
          },
          quantity: {
            type: Number,
            required: true,
            min: 0
          },
          unit: {
            type: String,
            required: true
          }
        }],
        notes: {
          type: String,
          trim: true
        }
      }]
    }]
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IDietChart>('DietChart', dietChartSchema);