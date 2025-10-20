import mongoose, { Schema, Document } from 'mongoose';

export interface IFoodItem extends Document {
  name: string;
  category: string;
  cuisineType: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins: {
    vitaminA?: number;
    vitaminC?: number;
    vitaminD?: number;
    vitaminE?: number;
    vitaminK?: number;
    vitaminB12?: number;
    folate?: number;
  };
  minerals: {
    calcium?: number;
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
  createdAt: Date;
  updatedAt: Date;
}

const foodItemSchema = new Schema<IFoodItem>(
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
      enum: ['grains', 'vegetables', 'fruits', 'legumes', 'dairy', 'meat', 'fish', 'nuts', 'seeds', 'oils', 'spices', 'beverages', 'sweets', 'other']
    },
    cuisineType: {
      type: String,
      required: [true, 'Cuisine type is required'],
      enum: ['indian', 'international', 'multicultural']
    },
    servingSize: {
      type: Number,
      required: [true, 'Serving size is required'],
      min: [0, 'Serving size cannot be negative']
    },
    servingUnit: {
      type: String,
      required: [true, 'Serving unit is required'],
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
      default: 0,
      min: 0
    },
    vitamins: {
      vitaminA: { type: Number, default: 0 },
      vitaminC: { type: Number, default: 0 },
      vitaminD: { type: Number, default: 0 },
      vitaminE: { type: Number, default: 0 },
      vitaminK: { type: Number, default: 0 },
      vitaminB12: { type: Number, default: 0 },
      folate: { type: Number, default: 0 }
    },
    minerals: {
      calcium: { type: Number, default: 0 },
      iron: { type: Number, default: 0 },
      magnesium: { type: Number, default: 0 },
      phosphorus: { type: Number, default: 0 },
      potassium: { type: Number, default: 0 },
      sodium: { type: Number, default: 0 },
      zinc: { type: Number, default: 0 }
    },
    ayurvedicProperties: {
      rasa: [{
        type: String,
        enum: ['sweet', 'sour', 'salty', 'bitter', 'pungent', 'astringent']
      }],
      virya: {
        type: String,
        enum: ['hot', 'cold'],
        required: true
      },
      vipaka: {
        type: String,
        enum: ['sweet', 'sour', 'pungent'],
        required: true
      },
      guna: [{
        type: String,
        enum: ['heavy', 'light', 'oily', 'dry', 'hot', 'cold', 'stable', 'mobile', 'soft', 'hard', 'smooth', 'rough', 'cloudy', 'clear', 'gross', 'subtle']
      }],
      digestibilityScore: {
        type: Number,
        min: 1,
        max: 10,
        required: true
      }
    },
    suitableForDoshas: [{
      type: String,
      enum: ['vata', 'pitta', 'kapha', 'all']
    }],
    seasonalRecommendation: [{
      type: String,
      enum: ['spring', 'summer', 'autumn', 'winter', 'all']
    }]
  },
  {
    timestamps: true
  }
);

foodItemSchema.index({ name: 'text' });
foodItemSchema.index({ category: 1 });
foodItemSchema.index({ 'ayurvedicProperties.rasa': 1 });

export default mongoose.model<IFoodItem>('FoodItem', foodItemSchema);