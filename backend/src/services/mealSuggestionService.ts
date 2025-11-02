
import FoodItem from '../models/FoodItem';
import Recipe from '../models/Recipe';
import Patient from '../models/Patient';

interface MealSuggestionParams {
  patientId: string;
  mealType: 'breakfast' | 'mid-morning-snack' | 'lunch' | 'evening-snack' | 'dinner' | 'bedtime-snack';
  targetCalories: number;
  excludeFoodIds?: string[];
}

interface SuggestedItem {
  itemId: string;
  type: 'food' | 'recipe';
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ayurvedicScore: number;
  reason: string;
}

// Helper: Get current season
const getCurrentSeason = (): string => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
};

// Helper: Calculate Ayurvedic compatibility score
const calculateAyurvedicScore = (food: any, doshaType: string, season: string): number => {
  let score = 50; // Base score

  // Dosha compatibility
  if (food.suitableForDoshas.includes(doshaType.split('-')[0]) || 
      food.suitableForDoshas.includes('all')) {
    score += 25;
  }

  // Seasonal appropriateness
  if (food.seasonalRecommendation.includes(season) || 
      food.seasonalRecommendation.includes('all') ||
      food.seasonalRecommendation.includes('all_seasons')) {
    score += 15;
  }

  // Digestibility
  if (food.ayurvedicProperties.digestibilityScore) {
    score += (food.ayurvedicProperties.digestibilityScore / 100) * 10;
  }

  return Math.min(score, 100);
};

// Main suggestion function
export const generateMealSuggestions = async (params: MealSuggestionParams) => {
  try {
    // Get patient data
    const patient = await Patient.findById(params.patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    const doshaType = patient.doshaType;
    const allergies = patient.allergies || [];
    const season = getCurrentSeason();

    // Build query for food items
    const foodQuery: any = {
      _id: { $nin: params.excludeFoodIds || [] }
    };

    // Exclude allergens
    if (allergies.length > 0) {
      foodQuery.name = { $not: { $in: allergies.map(a => new RegExp(a, 'i')) } };
    }

    // Prefer dosha-compatible foods
    const compatibleFoods = await FoodItem.find({
      ...foodQuery,
      $or: [
        { suitableForDoshas: { $in: [doshaType.split('-')[0], 'all'] } },
        { suitableForDoshas: { $in: doshaType.split('-') } }
      ]
    }).limit(50);

    // If not enough, get any safe foods
    let allFoods = compatibleFoods;
    if (compatibleFoods.length < 20) {
      const moreFoods = await FoodItem.find(foodQuery).limit(50);
      allFoods = [...compatibleFoods, ...moreFoods];
    }

    // Score and sort foods
    const scoredFoods = allFoods.map(food => ({
      food,
      score: calculateAyurvedicScore(food, doshaType, season)
    })).sort((a, b) => b.score - a.score);

    // Meal-specific logic
    let selectedFoods: any[] = [];
    let currentCalories = 0;
    const calorieTarget = params.targetCalories;
    const calorieBuffer = calorieTarget * 0.1; // ±10%

    // Meal composition rules
    const mealRules: any = {
      breakfast: {
        categories: ['grains', 'fruits', 'dairy', 'nuts'],
        portions: [0.4, 0.3, 0.2, 0.1] // Percentage of calories
      },
      'mid-morning-snack': {
        categories: ['fruits', 'nuts', 'beverages'],
        portions: [0.5, 0.3, 0.2]
      },
      lunch: {
        categories: ['grains', 'legumes', 'vegetables', 'dairy'],
        portions: [0.35, 0.25, 0.25, 0.15]
      },
      'evening-snack': {
        categories: ['fruits', 'nuts', 'beverages'],
        portions: [0.5, 0.3, 0.2]
      },
      dinner: {
        categories: ['grains', 'vegetables', 'legumes', 'dairy'],
        portions: [0.3, 0.3, 0.25, 0.15]
      },
      'bedtime-snack': {
        categories: ['dairy', 'nuts', 'fruits'],
        portions: [0.5, 0.3, 0.2]
      }
    };

    const mealRule = mealRules[params.mealType];
    const suggestions: SuggestedItem[] = [];

    // Select foods for each category
    for (let i = 0; i < mealRule.categories.length; i++) {
      const category = mealRule.categories[i];
      const targetCals = calorieTarget * mealRule.portions[i];

      // Find suitable food from this category
      const categoryFoods = scoredFoods.filter(sf => sf.food.category === category);
      
      if (categoryFoods.length > 0) {
        const selectedFood = categoryFoods[0].food;
        
        // Calculate quantity to meet calorie target
        const ratio = targetCals / selectedFood.calories;
        const quantity = Math.round(selectedFood.servingSize * ratio);

        suggestions.push({
          itemId: (selectedFood as any)._id.toString(),
          type: 'food',
          name: selectedFood.name,
          quantity: quantity,
          unit: selectedFood.servingUnit,
          calories: Math.round(selectedFood.calories * ratio),
          protein: Math.round(selectedFood.protein * ratio * 10) / 10,
          carbs: Math.round(selectedFood.carbs * ratio * 10) / 10,
          fat: Math.round(selectedFood.fat * ratio * 10) / 10,
          fiber: Math.round((selectedFood.fiber || 0) * ratio * 10) / 10,
          ayurvedicScore: categoryFoods[0].score,
          reason: `High ${doshaType} compatibility, seasonal (${season})`
        });

        currentCalories += targetCals;
      }
    }

    // Calculate totals
    const totalNutritionals = {
      calories: suggestions.reduce((sum, item) => sum + item.calories, 0),
      protein: suggestions.reduce((sum, item) => sum + item.protein, 0),
      carbs: suggestions.reduce((sum, item) => sum + item.carbs, 0),
      fat: suggestions.reduce((sum, item) => sum + item.fat, 0),
      fiber: suggestions.reduce((sum, item) => sum + item.fiber, 0)
    };

    // Check if within target
    const calorieDeviation = Math.abs(totalNutritionals.calories - calorieTarget);
    const warnings = [];
    
    if (calorieDeviation > calorieBuffer) {
      warnings.push(`Calories ${totalNutritionals.calories > calorieTarget ? 'exceed' : 'below'} target by ${Math.round(calorieDeviation)} kcal`);
    }

    // Compliance score (average of food scores)
    const avgComplianceScore = suggestions.length > 0
      ? Math.round(suggestions.reduce((sum, item) => sum + item.ayurvedicScore, 0) / suggestions.length)
      : 0;

    return {
      suggestedItems: suggestions,
      totalNutritionals,
      complianceScore: avgComplianceScore,
      warnings
    };

  } catch (error: any) {
    throw new Error(`Meal suggestion failed: ${error.message}`);
  }
};