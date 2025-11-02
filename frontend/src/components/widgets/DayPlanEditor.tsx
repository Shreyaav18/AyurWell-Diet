import React, { useState } from 'react';
import MealCard from './MealCard';
import FoodSearchModal from './FoodSearchModal';
import { mealSuggestionService } from '../../services/mealSuggestionService';

interface DayPlan {
  dayNumber: number;
  meals: Meal[];
  dailyNutritionalTotals?: NutritionalTotals;
}

interface Meal {
  mealType: string;
  timeSlot: string;
  items: MealItem[];
  notes?: string;
  nutritionalTotals?: NutritionalTotals;
}

interface MealItem {
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

interface NutritionalTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface DayPlanEditorProps {
  dayPlans: DayPlan[];
  setDayPlans: (plans: DayPlan[]) => void;
  currentDayIndex: number;
  setCurrentDayIndex: (index: number) => void;
  patientId: string;
  doshaType: string;
  targetCalories: number;
  allergies: string[];
  calculateMealNutritionals: (items: MealItem[]) => NutritionalTotals;
}

const DayPlanEditor: React.FC<DayPlanEditorProps> = ({
  dayPlans,
  setDayPlans,
  currentDayIndex,
  setCurrentDayIndex,
  patientId,
  doshaType,
  targetCalories,
  allergies,
  calculateMealNutritionals
}) => {
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [currentMealIndex, setCurrentMealIndex] = useState<number | null>(null);
  const [autoFilling, setAutoFilling] = useState<number | null>(null);

  const currentDay = dayPlans[currentDayIndex];

  // Meal calorie targets (percentage of daily target)
  const mealTargets: any = {
    'breakfast': 0.25,
    'mid-morning-snack': 0.10,
    'lunch': 0.35,
    'evening-snack': 0.10,
    'dinner': 0.20,
  };

  const getMealTargetCalories = (mealType: string): number => {
    return Math.round(targetCalories * (mealTargets[mealType] || 0.2));
  };

  // Add item to meal
  const handleAddItem = (mealIndex: number) => {
    setCurrentMealIndex(mealIndex);
    setShowFoodModal(true);
  };

  // Handle food selection from modal
  const handleFoodSelected = (item: MealItem) => {
    if (currentMealIndex === null) return;

    const newDayPlans = [...dayPlans];
    const currentMeal = newDayPlans[currentDayIndex].meals[currentMealIndex];
    
    currentMeal.items.push(item);
    currentMeal.nutritionalTotals = calculateMealNutritionals(currentMeal.items);
    
    setDayPlans(newDayPlans);
    setShowFoodModal(false);
    setCurrentMealIndex(null);
  };

  // Remove item from meal
  const handleRemoveItem = (mealIndex: number, itemIndex: number) => {
    const newDayPlans = [...dayPlans];
    const currentMeal = newDayPlans[currentDayIndex].meals[mealIndex];
    
    currentMeal.items.splice(itemIndex, 1);
    currentMeal.nutritionalTotals = calculateMealNutritionals(currentMeal.items);
    
    setDayPlans(newDayPlans);
  };

  // Update item quantity
  const handleUpdateQuantity = (mealIndex: number, itemIndex: number, newQuantity: number) => {
    const newDayPlans = [...dayPlans];
    const currentMeal = newDayPlans[currentDayIndex].meals[mealIndex];
    const item = currentMeal.items[itemIndex];
    
    // Recalculate nutritionals based on new quantity
    const ratio = newQuantity / item.quantity;
    item.quantity = newQuantity;
    item.calories = item.calories ? Math.round(item.calories * ratio) : 0;
    item.protein = item.protein ? Math.round(item.protein * ratio * 10) / 10 : 0;
    item.carbs = item.carbs ? Math.round(item.carbs * ratio * 10) / 10 : 0;
    item.fat = item.fat ? Math.round(item.fat * ratio * 10) / 10 : 0;
    item.fiber = item.fiber ? Math.round(item.fiber * ratio * 10) / 10 : 0;
    
    currentMeal.nutritionalTotals = calculateMealNutritionals(currentMeal.items);
    
    setDayPlans(newDayPlans);
  };

  // Auto-fill meal with AI suggestions
  const handleAutoFill = async (mealIndex: number) => {
    setAutoFilling(mealIndex);
    
    try {
      const meal = currentDay.meals[mealIndex];
      const usedFoodIds = currentDay.meals
        .flatMap(m => m.items)
        .map(item => item.itemId);

      const suggestions = await mealSuggestionService.generateSuggestions({
        patientId,
        mealType: meal.mealType as any,
        targetCalories: getMealTargetCalories(meal.mealType),
        excludeFoodIds: usedFoodIds
      });

      // Add suggested items to meal
      const newDayPlans = [...dayPlans];
      const currentMeal = newDayPlans[currentDayIndex].meals[mealIndex];
      
      currentMeal.items = suggestions.suggestedItems.map((item: any) => ({
        type: item.type,
        itemId: item.itemId,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        fiber: item.fiber
      }));
      
      currentMeal.nutritionalTotals = calculateMealNutritionals(currentMeal.items);
      
      setDayPlans(newDayPlans);
    } catch (err) {
      alert('Failed to generate meal suggestions');
    } finally {
      setAutoFilling(null);
    }
  };

  // Copy meal to another day
  const handleCopyMeal = (mealIndex: number, targetDayIndex: number) => {
    const newDayPlans = [...dayPlans];
    const sourceMeal = { ...newDayPlans[currentDayIndex].meals[mealIndex] };
    const targetMeal = newDayPlans[targetDayIndex].meals[mealIndex];
    
    targetMeal.items = [...sourceMeal.items];
    targetMeal.notes = sourceMeal.notes;
    targetMeal.nutritionalTotals = sourceMeal.nutritionalTotals;
    
    setDayPlans(newDayPlans);
    alert(`Meal copied to Day ${targetDayIndex + 1}`);
  };

  // Update meal notes
  const handleUpdateNotes = (mealIndex: number, notes: string) => {
    const newDayPlans = [...dayPlans];
    newDayPlans[currentDayIndex].meals[mealIndex].notes = notes;
    setDayPlans(newDayPlans);
  };

  return (
    <div style={styles.container}>
      {/* Day Navigation */}
      <div style={styles.dayNavigation}>
        <h3 style={styles.dayTitle}>Day {currentDay.dayNumber}</h3>
        <div style={styles.dayTabs}>
          {dayPlans.map((day, index) => (
            <button
              key={day.dayNumber}
              style={{
                ...styles.dayTab,
                ...(index === currentDayIndex ? styles.dayTabActive : {})
              }}
              onClick={() => setCurrentDayIndex(index)}
            >
              Day {day.dayNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Meals List */}
      <div style={styles.mealsContainer}>
        {currentDay.meals.map((meal, mealIndex) => (
          <MealCard
            key={mealIndex}
            meal={meal}
            mealIndex={mealIndex}
            targetCalories={getMealTargetCalories(meal.mealType)}
            onAddItem={() => handleAddItem(mealIndex)}
            onRemoveItem={(itemIndex) => handleRemoveItem(mealIndex, itemIndex)}
            onUpdateQuantity={(itemIndex, quantity) => handleUpdateQuantity(mealIndex, itemIndex, quantity)}
            onAutoFill={() => handleAutoFill(mealIndex)}
            onCopyMeal={(targetDay) => handleCopyMeal(mealIndex, targetDay)}
            onUpdateNotes={(notes) => handleUpdateNotes(mealIndex, notes)}
            autoFilling={autoFilling === mealIndex}
            dayPlans={dayPlans}
            currentDayIndex={currentDayIndex}
          />
        ))}
      </div>

      {/* Food Search Modal */}
      {showFoodModal && (
        <FoodSearchModal
          onClose={() => {
            setShowFoodModal(false);
            setCurrentMealIndex(null);
          }}
          onSelect={handleFoodSelected}
          doshaType={doshaType|| 'vata'}
          allergies={allergies}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  dayNavigation: {
    marginBottom: '20px',
    borderBottom: '2px solid #e0e0e0',
    paddingBottom: '15px',
  },
  dayTitle: {
    margin: '0 0 15px 0',
    fontSize: '20px',
    color: '#333',
  },
  dayTabs: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  dayTab: {
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#666',
  },
  dayTabActive: {
    backgroundColor: '#2196F3',
    color: 'white',
    borderColor: '#2196F3',
    fontWeight: 'bold' as const,
  },
  mealsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
};

export default DayPlanEditor;