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
        <div style={styles.navigationHeader}>
          <div style={styles.dayTitleContainer}>
            <span style={styles.dayIcon}>📅</span>
            <h3 style={styles.dayTitle}>Day {currentDay.dayNumber}</h3>
          </div>
          <div style={styles.dayInfo}>
            <span style={styles.infoLabel}>Target: </span>
            <span style={styles.infoValue}>{targetCalories} cal</span>
          </div>
        </div>
        
        <div style={styles.dayTabs}>
          {dayPlans.map((day, index) => (
            <button
              key={day.dayNumber}
              style={{
                ...styles.dayTab,
                ...(index === currentDayIndex ? styles.dayTabActive : {})
              }}
              onClick={() => setCurrentDayIndex(index)}
              onMouseOver={(e) => {
                if (index !== currentDayIndex) {
                  e.currentTarget.style.backgroundColor = '#D9E9CF';
                  e.currentTarget.style.borderColor = '#B6CEB4';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={(e) => {
                if (index !== currentDayIndex) {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#D9E9CF';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
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
    padding: '1.5rem',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #F0F0F0 0%, rgba(217, 233, 207, 0.3) 100%)',
  },
  dayNavigation: {
    marginBottom: '2rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(150, 167, 141, 0.1)',
    border: '1px solid #D9E9CF',
  },
  navigationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #D9E9CF',
  },
  dayTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  dayIcon: {
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayTitle: {
    margin: '0',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2d3748',
    letterSpacing: '-0.01em',
  },
  dayInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(150, 167, 141, 0.1)',
    borderRadius: '0.5rem',
    border: '1px solid #D9E9CF',
  },
  infoLabel: {
    fontSize: '0.875rem',
    color: '#64748b',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#96A78D',
  },
  dayTabs: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap' as const,
  },
  dayTab: {
    padding: '0.625rem 1.25rem',
    backgroundColor: 'white',
    border: '2px solid #D9E9CF',
    borderRadius: '0.625rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#64748b',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  dayTabActive: {
    backgroundColor: '#96A78D',
    color: 'white',
    borderColor: '#96A78D',
    fontWeight: '700',
    boxShadow: '0 4px 8px rgba(150, 167, 141, 0.25)',
    transform: 'translateY(-2px)',
  },
  mealsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  },
};

export default DayPlanEditor;