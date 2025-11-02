
export interface MealItem {
  type: 'food' | 'recipe';
  itemId: string;
  name?: string;
  quantity: number;
  unit: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

export interface NutritionalTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Meal {
  mealType: string;
  timeSlot: string;
  items: MealItem[];
  notes?: string;
  nutritionalTotals?: NutritionalTotals;
}

export interface DayPlan {
  dayNumber: number;
  meals: Meal[];
}

export interface FoodItem {
  _id: string;  // Convert ObjectId to string on frontend
  name: string;
  category: string;
  cuisineType?: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  suitableForDoshas: string[];
  ayurvedicProperties: {
    rasa: string[];
    virya: string;
    vipaka: string;
    guna: string[];
    digestibilityScore: number;
  };
  seasonalRecommendation: string[];
}