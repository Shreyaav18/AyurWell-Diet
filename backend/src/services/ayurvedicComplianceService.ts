import FoodItem from '../models/FoodItem';
import Recipe from '../models/Recipe';

interface ComplianceCheckItem {
  itemId: string;
  type: 'food' | 'recipe';
  quantity: number;
}

interface ComplianceResult {
  overallScore: number;
  rasaBalance: {
    sweet: number;
    sour: number;
    salty: number;
    bitter: number;
    pungent: number;
    astringent: number;
  };
  rasaCompleteness: number;
  doshaCompatibility: number;
  seasonalScore: number;
  digestibilityScore: number;
  warnings: string[];
  suggestions: string[];
}

// Helper: Get current season
const getCurrentSeason = (): string => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
};

// Helper: Get dosha recommendations
const getDoshaRecommendations = (doshaType: string) => {
  const primaryDosha = doshaType.split('-')[0];
  
  const recommendations: any = {
    vata: {
      preferRasa: ['sweet', 'sour', 'salty'],
      avoidRasa: ['bitter', 'pungent', 'astringent'],
      preferVirya: 'hot',
      preferGuna: ['heavy', 'oily', 'smooth']
    },
    pitta: {
      preferRasa: ['sweet', 'bitter', 'astringent'],
      avoidRasa: ['sour', 'salty', 'pungent'],
      preferVirya: 'cold',
      preferGuna: ['heavy', 'cool', 'smooth']
    },
    kapha: {
      preferRasa: ['pungent', 'bitter', 'astringent'],
      avoidRasa: ['sweet', 'sour', 'salty'],
      preferVirya: 'hot',
      preferGuna: ['light', 'dry', 'rough']
    }
  };

  return recommendations[primaryDosha] || recommendations.vata;
};

export const checkAyurvedicCompliance = async (
  items: ComplianceCheckItem[],
  doshaType: string,
  season?: string
): Promise<ComplianceResult> => {
  try {
    const currentSeason = season || getCurrentSeason();
    const doshaRecs = getDoshaRecommendations(doshaType);

    // Initialize counters
    const rasaBalance = {
      sweet: 0,
      sour: 0,
      salty: 0,
      bitter: 0,
      pungent: 0,
      astringent: 0
    };

    let totalDigestibility = 0;
    let doshaCompatibleCount = 0;
    let seasonalCount = 0;
    let totalItems = items.length;
    let viryaMix: string[] = [];
    let gunaList: string[] = [];

    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Analyze each item
    for (const item of items) {
      let foodData: any;

      if (item.type === 'food') {
        foodData = await FoodItem.findById(item.itemId);
      } else {
        const recipe = await Recipe.findById(item.itemId);
        if (recipe) {
          foodData = recipe.ayurvedicProperties;
        }
      }

      if (!foodData) continue;

      // Count Rasa (tastes)
      if (foodData.ayurvedicProperties?.rasa) {
        foodData.ayurvedicProperties.rasa.forEach((rasa: string) => {
          if (rasaBalance.hasOwnProperty(rasa)) {
            rasaBalance[rasa as keyof typeof rasaBalance]++;
          }
        });
      }

      // Check Virya (potency)
      if (foodData.ayurvedicProperties?.virya) {
        viryaMix.push(foodData.ayurvedicProperties.virya);
      }

      // Collect Guna (qualities)
      if (foodData.ayurvedicProperties?.guna) {
        gunaList.push(...foodData.ayurvedicProperties.guna);
      }

      // Digestibility
      if (foodData.ayurvedicProperties?.digestibilityScore) {
        totalDigestibility += foodData.ayurvedicProperties.digestibilityScore;
      }

      // Dosha compatibility
      if (foodData.suitableForDoshas) {
        const primaryDosha = doshaType.split('-')[0];
        if (
          foodData.suitableForDoshas.includes(primaryDosha) ||
          foodData.suitableForDoshas.includes('all')
        ) {
          doshaCompatibleCount++;
        }
      }

      // Seasonal appropriateness
      if (foodData.seasonalRecommendation) {
        if (
          foodData.seasonalRecommendation.includes(currentSeason) ||
          foodData.seasonalRecommendation.includes('all') ||
          foodData.seasonalRecommendation.includes('all_seasons')
        ) {
          seasonalCount++;
        }
      }
    }

    // Calculate scores

    // 1. Rasa Completeness (0-100)
    const rasasPresent = Object.values(rasaBalance).filter(count => count > 0).length;
    const rasaCompleteness = Math.round((rasasPresent / 6) * 100);

    // Check for missing rasas
    const missingRasas = Object.entries(rasaBalance)
      .filter(([_, count]) => count === 0)
      .map(([rasa, _]) => rasa);

    if (missingRasas.length > 0) {
      warnings.push(`Missing tastes: ${missingRasas.join(', ')}`);
      
      // Suggest foods for missing rasas
      if (missingRasas.includes('bitter')) {
        suggestions.push('Add bitter foods like leafy greens, turmeric, or fenugreek');
      }
      if (missingRasas.includes('astringent')) {
        suggestions.push('Add astringent foods like lentils, pomegranate, or green tea');
      }
      if (missingRasas.includes('pungent')) {
        suggestions.push('Add pungent spices like ginger, black pepper, or chili');
      }
    }

    // Check for rasa balance based on dosha
    const avoidRasas = Object.entries(rasaBalance)
      .filter(([rasa, count]) => doshaRecs.avoidRasa.includes(rasa) && count > 2)
      .map(([rasa, _]) => rasa);

    if (avoidRasas.length > 0) {
      warnings.push(`Too much ${avoidRasas.join(', ')} taste for ${doshaType} dosha`);
      suggestions.push(`Reduce ${avoidRasas.join(', ')} foods to balance ${doshaType} dosha`);
    }

    // 2. Dosha Compatibility (0-100)
    const doshaCompatibility = totalItems > 0 
      ? Math.round((doshaCompatibleCount / totalItems) * 100)
      : 0;

    if (doshaCompatibility < 60) {
      warnings.push(`Only ${doshaCompatibility}% foods are ${doshaType}-compatible`);
      suggestions.push(`Choose more ${doshaType}-balancing foods`);
    }

    // 3. Seasonal Score (0-100)
    const seasonalScore = totalItems > 0
      ? Math.round((seasonalCount / totalItems) * 100)
      : 0;

    if (seasonalScore < 50) {
      suggestions.push(`Consider adding more seasonal (${currentSeason}) foods`);
    }

    // 4. Digestibility Score (0-100)
    const digestibilityScore = totalItems > 0
      ? Math.round(totalDigestibility / totalItems)
      : 0;

    // Check Virya mixing
    const hasHot = viryaMix.includes('hot');
    const hasCold = viryaMix.includes('cold');
    if (hasHot && hasCold) {
      warnings.push('Mixing hot and cold potency foods may hinder digestion');
      suggestions.push('Try to keep foods with similar virya (potency) in one meal');
    }

    // Check for heavy foods
    const heavyCount = gunaList.filter(g => g === 'heavy').length;
    if (heavyCount > totalItems * 0.6) {
      warnings.push('Too many heavy foods - may slow digestion');
      suggestions.push('Balance with light, easy-to-digest foods');
    }

    // 5. Overall Score (weighted average)
    const overallScore = Math.round(
      (rasaCompleteness * 0.25) +
      (doshaCompatibility * 0.35) +
      (seasonalScore * 0.15) +
      (digestibilityScore * 0.25)
    );

    // Overall recommendations
    if (overallScore >= 80) {
      suggestions.push('Excellent Ayurvedic balance! This meal supports wellness.');
    } else if (overallScore >= 60) {
      suggestions.push('Good balance. Minor adjustments can optimize this meal.');
    } else {
      suggestions.push('Consider reviewing food choices for better dosha balance.');
    }

    return {
      overallScore,
      rasaBalance,
      rasaCompleteness,
      doshaCompatibility,
      seasonalScore,
      digestibilityScore,
      warnings,
      suggestions
    };

  } catch (error: any) {
    throw new Error(`Compliance check failed: ${error.message}`);
  }
};