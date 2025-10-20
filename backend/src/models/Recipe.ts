import mongoose, { Schema, Document } from 'mongoose';

interface IIngredient {
  foodItemId: mongoose.Types.ObjectId;
  quantity: number;
  unit: string;
}

export interface IRecipe extends Document {
  name: string;
  description: string;
  ingredients: IIngredient[];
  preparationTime: number;
  cookingMethod: string;
  servingSize: number;
  calculatedNutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  ayurvedicProperties: {
    rasa: string[];
    virya: string;
    digestibilityScore: number;
  };
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const recipeSchema = new Schema<IRecipe>(
  {
    name: {
      type: String,
      required: [true, 'Recipe name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    ingredients: [{
      foodItemId: {
        type: Schema.Types.ObjectId,
        ref: 'FoodItem',
        required: true
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
    preparationTime: {
      type: Number,
      required: [true, 'Preparation time is required'],
      min: 0
    },
    cookingMethod: {
      type: String,
      enum: ['boiling', 'steaming', 'frying', 'baking', 'roasting', 'grilling', 'raw', 'fermented', 'other'],
      required: true
    },
    servingSize: {
      type: Number,
      required: [true, 'Serving size is required'],
      min: 1
    },
    calculatedNutrients: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      fiber: { type: Number, default: 0 }
    },
    ayurvedicProperties: {
      rasa: [{
        type: String,
        enum: ['sweet', 'sour', 'salty', 'bitter', 'pungent', 'astringent']
      }],
      virya: {
        type: String,
        enum: ['hot', 'cold', 'neutral']
      },
      digestibilityScore: {
        type: Number,
        min: 1,
        max: 10
      }
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IRecipe>('Recipe', recipeSchema);