import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  _id: mongoose.Types.ObjectId;
  questionNumber: number;
  category: string;
  questionText: string;
  options: {
    optionText: string;
    doshaType: string;
  }[];
  createdAt: Date;
}

export interface IAssessment extends Document {
  _id: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  assessmentDate: Date;
  responses: {
    questionId: mongoose.Types.ObjectId;
    selectedOption: string;
  }[];
  scores: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  percentages: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  resultDoshaType: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const questionsSchema = new Schema<IQuestion>(
  {
    // Remove _id from schema definition - MongoDB adds it automatically
    questionNumber: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['physical', 'physiological', 'mental', 'behavioral']
    },
    questionText: {
      type: String,
      required: true
    },
    options: [
      {
        optionText: {
          type: String,
          required: true
        },
        doshaType: {
          type: String,
          required: true,
          enum: ['vata', 'pitta', 'kapha']
        }
      }
    ]
  },
  {
    timestamps: true // This automatically adds createdAt and updatedAt
  }
);


const assessmentSchema = new Schema<IAssessment>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    assessmentDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    responses: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: 'Question',
          required: true
        },
        selectedOption: {
          type: String,
          required: true,
          enum: ['vata', 'pitta', 'kapha']
        }
      }
    ],
    scores: {
      vata: {
        type: Number,
        required: true,
        default: 0,
        min: 0
      },
      pitta: {
        type: Number,
        required: true,
        default: 0,
        min: 0
      },
      kapha: {
        type: Number,
        required: true,
        default: 0,
        min: 0
      }
    },
    percentages: {
      vata: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 100
      },
      pitta: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 100
      },
      kapha: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 100
      }
    },
    resultDoshaType: {
      type: String,
      required: true,
      // Examples: "vata", "pitta", "kapha", "vata-pitta", "pitta-kapha", "vata-kapha", "tridosha"
    },
    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Index for faster queries
assessmentSchema.index({ patientId: 1, assessmentDate: -1 });

export const Assessment = mongoose.model<IAssessment>('Assessment', assessmentSchema);
export const Question = mongoose.model<IQuestion>('Question', questionsSchema);