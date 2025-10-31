import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFoodItem extends Document {
  //_id: Types.ObjectId;
  name: string;
  category: string;
  cuisineType: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;  // Remove | null, just use ?
  vitamins: {
    vitaminA?: number;  // Remove | null from all
    vitaminC?: number;
    vitaminD?: number;
    vitaminE?: number;
    vitaminK?: number;
    vitaminB12?: number;
    folate?: number;
  };
  minerals: {
    calcium?: number;  // Remove | null from all
    iron?: number;
    magnesium?: number;
    phosphorus?: number;
    potassium?: number;
    sodium?: number;
    zinc?: number;
  };
  ayurvedicProperties: {
    rasa: string[];
    virya: string;
    vipaka: string;
    guna: string[];
    digestibilityScore: number;
  };
  suitableForDoshas: string[];
  seasonalRecommendation: string[];
}

const foodItemSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
      unique: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      lowercase: true,
      enum: ['grains', 'vegetables', 'fruits', 'legumes', 'dairy', 'meat', 'fish', 'nuts', 'seeds', 'oils', 'spices', 'beverages', 'sweets', 'other']
    },
    cuisineType: {
      type: String,
      required: [true, 'Cuisine type is required'],
    },
    servingSize: {
      type: Number,
      required: [true, 'Serving size is required'],
      min: [0, 'Serving size cannot be negative']
    },
    servingUnit: {
      type: String,
      required: [true, 'Serving unit is required'],
      lowercase: true,
      enum: ['g', 'ml', 'cup', 'piece', 'tablespoon', 'teaspoon']
    },
    calories: {
      type: Number,
      required: [true, 'Calories are required'],
      min: [0, 'Calories cannot be negative']
    },
    protein: {
      type: Number,
      required: true,
      min: 0
    },
    carbs: {
      type: Number,
      required: true,
      min: 0
    },
    fat: {
      type: Number,
      required: true,
      min: 0
    },
    fiber: {
      type: Number,
      default: null
    },
    vitamins: {
      vitaminA: { type: Number, default: null },
      vitaminC: { type: Number, default: null },
      vitaminD: { type: Number, default: null },
      vitaminE: { type: Number, default: null },
      vitaminK: { type: Number, default: null },
      vitaminB12: { type: Number, default: null },
      folate: { type: Number, default: null }
    },
    minerals: {
      calcium: { type: Number, default: null },
      iron: { type: Number, default: null },
      magnesium: { type: Number, default: null },
      phosphorus: { type: Number, default: null },
      potassium: { type: Number, default: null },
      sodium: { type: Number, default: null },
      zinc: { type: Number, default: null }
    },
    ayurvedicProperties: {
      rasa: [{
        type: String,
        lowercase: true,
        enum: ['sweet', 'sour', 'salty', 'bitter', 'pungent', 'astringent']
      }],
      virya: {
        type: String,
        lowercase: true,
        enum: ['hot', 'cold', 'neutral'],
        required: true
      },
      vipaka: {
        type: String,
        lowercase: true,
        enum: ['sweet', 'sour', 'pungent'],
        required: true
      },
      guna: [{
        type: String,
        lowercase: true,
        enum: ['heavy', 'light', 'oily', 'dry', 'hot', 'cold', 'stable', 'mobile', 'soft', 'hard', 'smooth', 'rough', 'cloudy', 'clear', 'gross', 'subtle', 'balanced']
      }],
      digestibilityScore: {
        type: Number,
        min: 1,
        max: 100,
        required: true
      }
    },
    suitableForDoshas: [{
      type: String,
      lowercase: true,
      enum: ['vata', 'pitta', 'kapha', 'all']
    }],
    seasonalRecommendation: [{
      type: String,
      lowercase: true,
      enum: ['spring', 'summer', 'autumn', 'winter', 'all', 'all_seasons']
    }]
  },
  {
    timestamps: false,
    strict: false
  }
);

foodItemSchema.index({ name: 'text' });
foodItemSchema.index({ category: 1 });
foodItemSchema.index({ 'ayurvedicProperties.rasa': 1 });

export default mongoose.model<IFoodItem>('FoodItem', foodItemSchema as any);