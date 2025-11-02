import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { dietChartService } from '../../services/dietChartService';
import ChartMetadataForm from './ChartMetadataForm';
import DayPlanEditor from './DayPlanEditor';
import NutritionDashboard from './NutritionDashboard';

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

const DietChartBuilder: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  // Patient data
  const [patientData, setPatientData] = useState<any>(null);
  
  // Chart metadata
  const [chartType, setChartType] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>('');
  const [targetCalories, setTargetCalories] = useState<number>(2000);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  
  // Day plans
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'metadata' | 'planning'>('metadata');

  // Fetch patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        if (patientId) {
          const patient = await patientService.getById(patientId);
          setPatientData(patient);
          setDietaryRestrictions(patient.allergies || []);
          
          // Calculate recommended calories based on patient data
          const recommendedCalories = calculateRecommendedCalories(patient);
          setTargetCalories(recommendedCalories);
        }
      } catch (err) {
        setError('Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [patientId]);

  // Calculate recommended daily calories
  const calculateRecommendedCalories = (patient: any): number => {
    // Harris-Benedict Equation
    let bmr: number;
    
    if (patient.gender === 'male') {
      bmr = 88.362 + (13.397 * patient.weight) + (4.799 * patient.height) - (5.677 * patient.age);
    } else {
      bmr = 447.593 + (9.247 * patient.weight) + (3.098 * patient.height) - (4.330 * patient.age);
    }
    
    // Activity level multipliers
    const activityMultipliers: any = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very-active': 1.9
    };
    
    const multiplier = activityMultipliers[patient.activityLevel] || 1.55;
    return Math.round(bmr * multiplier);
  };

  // Initialize day plans based on chart type
  const initializeDayPlans = () => {
    const daysCount = chartType === 'daily' ? 1 : chartType === 'weekly' ? 7 : 30;
    
    const newDayPlans: DayPlan[] = [];
    for (let i = 1; i <= daysCount; i++) {
      newDayPlans.push({
        dayNumber: i,
        meals: [
          { mealType: 'breakfast', timeSlot: '08:00', items: [] },
          { mealType: 'mid-morning-snack', timeSlot: '11:00', items: [] },
          { mealType: 'lunch', timeSlot: '13:00', items: [] },
          { mealType: 'evening-snack', timeSlot: '16:00', items: [] },
          { mealType: 'dinner', timeSlot: '19:00', items: [] },
        ]
      });
    }
    
    setDayPlans(newDayPlans);
    setCurrentDayIndex(0);
    setStep('planning');
  };

  // Calculate nutritional totals for a meal
  const calculateMealNutritionals = (items: MealItem[]): NutritionalTotals => {
    return items.reduce(
      (totals, item) => ({
        calories: totals.calories + (item.calories || 0),
        protein: totals.protein + (item.protein || 0),
        carbs: totals.carbs + (item.carbs || 0),
        fat: totals.fat + (item.fat || 0),
        fiber: totals.fiber + (item.fiber || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  };

  // Calculate daily totals
  const calculateDailyTotals = (meals: Meal[]): NutritionalTotals => {
    return meals.reduce(
      (totals, meal) => {
        const mealTotals = meal.nutritionalTotals || calculateMealNutritionals(meal.items);
        return {
          calories: totals.calories + mealTotals.calories,
          protein: totals.protein + mealTotals.protein,
          carbs: totals.carbs + mealTotals.carbs,
          fat: totals.fat + mealTotals.fat,
          fiber: totals.fiber + mealTotals.fiber,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  };

  // Calculate chart average
  const calculateChartAverage = (): NutritionalTotals => {
    if (dayPlans.length === 0) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    }

    const totalNutrition = dayPlans.reduce(
      (totals, day) => {
        const dayTotals = calculateDailyTotals(day.meals);
        return {
          calories: totals.calories + dayTotals.calories,
          protein: totals.protein + dayTotals.protein,
          carbs: totals.carbs + dayTotals.carbs,
          fat: totals.fat + dayTotals.fat,
          fiber: totals.fiber + dayTotals.fiber,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );

    return {
      calories: Math.round(totalNutrition.calories / dayPlans.length),
      protein: Math.round((totalNutrition.protein / dayPlans.length) * 10) / 10,
      carbs: Math.round((totalNutrition.carbs / dayPlans.length) * 10) / 10,
      fat: Math.round((totalNutrition.fat / dayPlans.length) * 10) / 10,
      fiber: Math.round((totalNutrition.fiber / dayPlans.length) * 10) / 10,
    };
  };

  // Save as draft
  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const chartData = {
        patientId,
        chartType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        targetCalories,
        dietaryRestrictions,
        status: 'draft',
        dayPlans: dayPlans.map(day => ({
          ...day,
          dailyNutritionalTotals: calculateDailyTotals(day.meals),
          meals: day.meals.map(meal => ({
            ...meal,
            nutritionalTotals: calculateMealNutritionals(meal.items)
          }))
        })),
        chartNutritionalAverage: calculateChartAverage()
      };

      await dietChartService.createDietChart(chartData);
      alert('Diet chart saved as draft!');
      navigate(`/patients/${patientId}/diet-charts`);
    } catch (err) {
      setError('Failed to save diet chart');
    } finally {
      setSaving(false);
    }
  };

  // Activate chart
  const handleActivate = async () => {
    // Validate all days have at least some meals
    const hasEmptyDays = dayPlans.some(day => 
      day.meals.every(meal => meal.items.length === 0)
    );

    if (hasEmptyDays) {
      alert('Please add meals to all days before activating');
      return;
    }

    setSaving(true);
    try {
      const chartData = {
        patientId,
        chartType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        targetCalories,
        dietaryRestrictions,
        status: 'active',
        dayPlans: dayPlans.map(day => ({
          ...day,
          dailyNutritionalTotals: calculateDailyTotals(day.meals),
          meals: day.meals.map(meal => ({
            ...meal,
            nutritionalTotals: calculateMealNutritionals(meal.items)
          }))
        })),
        chartNutritionalAverage: calculateChartAverage()
      };

      await dietChartService.createDietChart(chartData);
      alert('Diet chart activated successfully!');
      navigate(`/patients/${patientId}/diet-charts`);
    } catch (err) {
      setError('Failed to activate diet chart');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  if (error && !patientData) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <button style={styles.backButton} onClick={() => navigate(`/patients/${patientId}/diet-charts`)}>
            ← Back to Diet Charts
          </button>
          <h2 style={styles.title}>Create Diet Chart - {patientData?.name}</h2>
          <p style={styles.subtitle}>
            Patient: {patientData?.age}y, {patientData?.gender}, {patientData?.doshaType} dosha
          </p>
        </div>
      </div>

      {error && <div style={styles.errorBanner}>{error}</div>}

      {/* Step Indicator */}
      <div style={styles.stepIndicator}>
        <div style={{...styles.stepItem, ...(step === 'metadata' ? styles.stepActive : {})}}>
          <span style={styles.stepNumber}>1</span>
          <span style={styles.stepLabel}>Chart Details</span>
        </div>
        <div style={styles.stepDivider}></div>
        <div style={{...styles.stepItem, ...(step === 'planning' ? styles.stepActive : {})}}>
          <span style={styles.stepNumber}>2</span>
          <span style={styles.stepLabel}>Meal Planning</span>
        </div>
      </div>

      {/* Content */}
      {step === 'metadata' ? (
        <ChartMetadataForm
          chartType={chartType}
          setChartType={setChartType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          targetCalories={targetCalories}
          setTargetCalories={setTargetCalories}
          dietaryRestrictions={dietaryRestrictions}
          setDietaryRestrictions={setDietaryRestrictions}
          patientAllergies={patientData?.allergies || []}
          onNext={initializeDayPlans}
        />
      ) : (
        <div style={styles.planningLayout}>
          {/* Main Planning Area */}
          <div style={styles.planningMain}>
            <DayPlanEditor
              dayPlans={dayPlans}
              setDayPlans={setDayPlans}
              currentDayIndex={currentDayIndex}
              setCurrentDayIndex={setCurrentDayIndex}
              patientId={patientId!}
              doshaType={patientData?.doshaType || 'vata' }
              targetCalories={targetCalories}
              allergies={patientData?.allergies || []}
              calculateMealNutritionals={calculateMealNutritionals}
            />
          </div>

          {/* Sidebar - Nutrition Dashboard */}
          <div style={styles.planningSidebar}>
            <NutritionDashboard
              currentDay={dayPlans[currentDayIndex]}
              chartAverage={calculateChartAverage()}
              targetCalories={targetCalories}
              doshaType={patientData?.doshaType}
              calculateDailyTotals={calculateDailyTotals}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      {step === 'planning' && (
        <div style={styles.actions}>
          <button style={styles.backButtonAction} onClick={() => setStep('metadata')}>
            ← Back to Details
          </button>
          <div style={styles.actionButtons}>
            <button style={styles.draftButton} onClick={handleSaveDraft} disabled={saving}>
              {saving ? 'Saving...' : 'Save as Draft'}
            </button>
            <button style={styles.activateButton} onClick={handleActivate} disabled={saving}>
              {saving ? 'Activating...' : 'Activate Chart'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1600px',
    margin: '0 auto',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  backButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#2196F3',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '10px',
    padding: 0,
  },
  title: {
    margin: '0 0 5px 0',
    fontSize: '24px',
    color: '#333',
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '15px',
    borderRadius: '4px',
  },
  errorBanner: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    opacity: 0.5,
  },
  stepActive: {
    opacity: 1,
  },
  stepNumber: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold' as const,
    fontSize: '14px',
  },
  stepLabel: {
    fontSize: '14px',
    fontWeight: 'bold' as const,
  },
  stepDivider: {
    width: '100px',
    height: '2px',
    backgroundColor: '#e0e0e0',
    margin: '0 20px',
  },
  planningLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '20px',
    marginBottom: '20px',
  },
  planningMain: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  planningSidebar: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxHeight: '800px',
    overflow: 'auto',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  backButtonAction: {
    padding: '10px 20px',
    backgroundColor: '#757575',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  actionButtons: {
    display: 'flex',
    gap: '15px',
  },
  draftButton: {
    padding: '12px 24px',
    backgroundColor: '#FF9800',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold' as const,
  },
  activateButton: {
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold' as const,
  },
};

export default DietChartBuilder;