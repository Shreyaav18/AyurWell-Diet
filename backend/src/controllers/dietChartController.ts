import { Request, Response } from 'express';
import DietChart from '../models/DietChart';
import FoodItem from '../models/FoodItem';
import Recipe from '../models/Recipe';
import MedicalHistory from '../models/medicalHistory';

// Helper function to calculate nutritional totals
const calculateNutritionals = async (items: any[]) => {
  let totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

  for (const item of items) {
    let itemNutrition;
    
    if (item.type === 'food') {
      const food = await FoodItem.findById(item.itemId);
      if (food) {
        // Calculate based on quantity ratio
        const ratio = item.quantity / food.servingSize;
        totals.calories += food.calories * ratio;
        totals.protein += food.protein * ratio;
        totals.carbs += food.carbs * ratio;
        totals.fat += food.fat * ratio;
        totals.fiber += (food.fiber || 0) * ratio;
      }
    } else if (item.type === 'recipe') {
      const recipe = await Recipe.findById(item.itemId);
      if (recipe) {
        const ratio = item.quantity / recipe.servingSize;
        totals.calories += recipe.calculatedNutrients.calories * ratio;
        totals.protein += recipe.calculatedNutrients.protein * ratio;
        totals.carbs += recipe.calculatedNutrients.carbs * ratio;
        totals.fat += recipe.calculatedNutrients.fat * ratio;
        totals.fiber += recipe.calculatedNutrients.fiber * ratio;
      }
    }
  }

  return {
    calories: Math.round(totals.calories),
    protein: Math.round(totals.protein * 10) / 10,
    carbs: Math.round(totals.carbs * 10) / 10,
    fat: Math.round(totals.fat * 10) / 10,
    fiber: Math.round(totals.fiber * 10) / 10
  };
};

// Create diet chart with auto-calculation
export const createDietChart = async (req: Request, res: Response) => {
  try {
    const chartData = {
      ...req.body,
      createdBy: req.user?.userId
    };

    // Calculate nutritionals for each meal and day
    for (const day of chartData.dayPlans) {
      let dailyTotals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

      for (const meal of day.meals) {
        const mealTotals = await calculateNutritionals(meal.items);
        meal.nutritionalTotals = mealTotals;

        // Add to daily totals
        dailyTotals.calories += mealTotals.calories;
        dailyTotals.protein += mealTotals.protein;
        dailyTotals.carbs += mealTotals.carbs;
        dailyTotals.fat += mealTotals.fat;
        dailyTotals.fiber += mealTotals.fiber;
      }

      day.dailyNutritionalTotals = dailyTotals;
    }

    // Calculate chart average
    const totalDays = chartData.dayPlans.length;
    const chartAverage = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    };

    chartData.dayPlans.forEach((day: any) => {
      chartAverage.calories += day.dailyNutritionalTotals.calories;
      chartAverage.protein += day.dailyNutritionalTotals.protein;
      chartAverage.carbs += day.dailyNutritionalTotals.carbs;
      chartAverage.fat += day.dailyNutritionalTotals.fat;
      chartAverage.fiber += day.dailyNutritionalTotals.fiber;
    });

    chartData.chartNutritionalAverage = {
      calories: Math.round(chartAverage.calories / totalDays),
      protein: Math.round((chartAverage.protein / totalDays) * 10) / 10,
      carbs: Math.round((chartAverage.carbs / totalDays) * 10) / 10,
      fat: Math.round((chartAverage.fat / totalDays) * 10) / 10,
      fiber: Math.round((chartAverage.fiber / totalDays) * 10) / 10
    };

    const dietChart = await DietChart.create(chartData);

    // Create medical history entry
    await MedicalHistory.create({
      patientId: chartData.patientId,
      eventType: 'diet-plan',
      date: new Date(),
      title: `${chartData.chartType} Diet Chart Created`,
      description: `New diet chart assigned with target of ${chartData.targetCalories} calories per day`,
      relatedData: { dietChartId: dietChart._id },
      createdBy: req.user?.userId
    });

    res.status(201).json(dietChart);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get all diet charts for a patient
export const getPatientDietCharts = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const charts = await DietChart.find({ patientId })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    
    res.status(200).json(charts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get single diet chart
export const getDietChartById = async (req: Request, res: Response) => {
  try {
    const chart = await DietChart.findById(req.params.id)
      .populate('patientId')
      .populate('createdBy');
    
    if (!chart) {
      return res.status(404).json({ message: 'Diet chart not found' });
    }
    
    res.status(200).json(chart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update diet chart status
export const updateDietChartStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const chart = await DietChart.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!chart) {
      return res.status(404).json({ message: 'Diet chart not found' });
    }
    
    res.status(200).json(chart);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete diet chart
export const deleteDietChart = async (req: Request, res: Response) => {
  try {
    const chart = await DietChart.findByIdAndDelete(req.params.id);
    
    if (!chart) {
      return res.status(404).json({ message: 'Diet chart not found' });
    }
    
    res.status(200).json({ message: 'Diet chart deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};