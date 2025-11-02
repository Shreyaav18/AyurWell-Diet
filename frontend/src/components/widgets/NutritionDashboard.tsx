import React, { useState, useEffect } from 'react';
import { ayurvedicService } from '../../services/ayurvedicService';

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

interface NutritionDashboardProps {
  currentDay: DayPlan;
  chartAverage: NutritionalTotals;
  targetCalories: number;
  doshaType: string;
  calculateDailyTotals: (meals: Meal[]) => NutritionalTotals;
}

const NutritionDashboard: React.FC<NutritionDashboardProps> = ({
  currentDay,
  chartAverage,
  targetCalories,
  doshaType,
  calculateDailyTotals
}) => {
  const [view, setView] = useState<'daily' | 'average'>('daily');
  const [complianceData, setComplianceData] = useState<any>(null);
  const [loadingCompliance, setLoadingCompliance] = useState(false);

  const dailyTotals = calculateDailyTotals(currentDay.meals);
  const displayData = view === 'daily' ? dailyTotals : chartAverage;

  // Check Ayurvedic compliance when day data changes
  useEffect(() => {
    const checkCompliance = async () => {
      if (currentDay.meals.some(meal => meal.items.length > 0)) {
        setLoadingCompliance(true);
        try {
          const allItems = currentDay.meals.flatMap(meal => meal.items);
          const compliance = await ayurvedicService.validateCompliance({
            items: allItems.map(item => ({
              itemId: item.itemId,
              type: item.type,
              quantity: item.quantity
            })),
            doshaType
          });
          setComplianceData(compliance);
        } catch (err) {
          console.error('Failed to check compliance:', err);
        } finally {
          setLoadingCompliance(false);
        }
      } else {
        setComplianceData(null);
      }
    };

    checkCompliance();
  }, [currentDay, doshaType]);

  const getCalorieStatus = (current: number, target: number) => {
    const diff = Math.abs(current - target);
    if (diff <= target * 0.1) return { color: '#4CAF50', label: 'On Target' };
    if (current > target) return { color: '#FF9800', label: 'Above Target' };
    return { color: '#2196F3', label: 'Below Target' };
  };

  const calorieStatus = getCalorieStatus(displayData.calories, targetCalories);

  const getMacroPercentage = (macroGrams: number, macroType: 'protein' | 'carbs' | 'fat') => {
    const caloriesPerGram = macroType === 'fat' ? 9 : 4;
    const macroCalories = macroGrams * caloriesPerGram;
    return displayData.calories > 0 ? Math.round((macroCalories / displayData.calories) * 100) : 0;
  };

  const proteinPercent = getMacroPercentage(displayData.protein, 'protein');
  const carbsPercent = getMacroPercentage(displayData.carbs, 'carbs');
  const fatPercent = getMacroPercentage(displayData.fat, 'fat');

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Nutrition Dashboard</h3>

      {/* View Toggle */}
      <div style={styles.viewToggle}>
        <button
          style={{
            ...styles.toggleButton,
            ...(view === 'daily' ? styles.toggleButtonActive : {})
          }}
          onClick={() => setView('daily')}
        >
          Daily
        </button>
        <button
          style={{
            ...styles.toggleButton,
            ...(view === 'average' ? styles.toggleButtonActive : {})
          }}
          onClick={() => setView('average')}
        >
          Chart Average
        </button>
      </div>

      {/* Calorie Progress */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Calories</h4>
        <div style={styles.calorieCircle}>
          <svg width="140" height="140">
            <circle
              cx="70"
              cy="70"
              r="60"
              stroke="#e0e0e0"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="70"
              cy="70"
              r="60"
              stroke={calorieStatus.color}
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${Math.min((displayData.calories / targetCalories) * 377, 377)} 377`}
              strokeDashoffset="0"
              transform="rotate(-90 70 70)"
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          </svg>
          <div style={styles.calorieText}>
            <div style={styles.calorieValue}>{displayData.calories}</div>
            <div style={styles.calorieTarget}>/ {targetCalories}</div>
            <div style={styles.calorieLabel}>kcal</div>
          </div>
        </div>
        <p style={{...styles.statusLabel, color: calorieStatus.color}}>
          {calorieStatus.label}
        </p>
      </div>

      {/* Macros */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Macronutrients</h4>
        
        {/* Protein */}
        <div style={styles.macroRow}>
          <div style={styles.macroLabel}>
            <span style={styles.macroName}>Protein</span>
            <span style={styles.macroAmount}>{displayData.protein}g</span>
          </div>
          <div style={styles.macroBar}>
            <div 
              style={{
                ...styles.macroFill,
                width: `${proteinPercent}%`,
                backgroundColor: '#FF5722'
              }}
            ></div>
          </div>
          <span style={styles.macroPercent}>{proteinPercent}%</span>
        </div>

        {/* Carbs */}
        <div style={styles.macroRow}>
          <div style={styles.macroLabel}>
            <span style={styles.macroName}>Carbs</span>
            <span style={styles.macroAmount}>{displayData.carbs}g</span>
          </div>
          <div style={styles.macroBar}>
            <div 
              style={{
                ...styles.macroFill,
                width: `${carbsPercent}%`,
                backgroundColor: '#2196F3'
              }}
            ></div>
          </div>
          <span style={styles.macroPercent}>{carbsPercent}%</span>
        </div>

        {/* Fat */}
        <div style={styles.macroRow}>
          <div style={styles.macroLabel}>
            <span style={styles.macroName}>Fat</span>
            <span style={styles.macroAmount}>{displayData.fat}g</span>
          </div>
          <div style={styles.macroBar}>
            <div 
              style={{
                ...styles.macroFill,
                width: `${fatPercent}%`,
                backgroundColor: '#FFC107'
              }}
            ></div>
          </div>
          <span style={styles.macroPercent}>{fatPercent}%</span>
        </div>

        {/* Fiber */}
        <div style={styles.fiberRow}>
          <span style={styles.fiberLabel}>Fiber:</span>
          <span style={styles.fiberValue}>{displayData.fiber}g</span>
        </div>
      </div>

      {/* Ayurvedic Compliance */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Ayurvedic Compliance</h4>
        
        {loadingCompliance ? (
          <p style={styles.loadingText}>Analyzing...</p>
        ) : !complianceData ? (
          <p style={styles.noDataText}>Add foods to see compliance</p>
        ) : (
          <>
            {/* Overall Score */}
            <div style={styles.scoreCircle}>
              <div style={styles.scoreValue}>
                {complianceData.overallScore}
                <span style={styles.scoreMax}>/100</span>
              </div>
              <div style={styles.scoreLabel}>Overall Score</div>
            </div>

            {/* Sub-scores */}
            <div style={styles.subscores}>
              <div style={styles.subscoreItem}>
                <span style={styles.subscoreLabel}>Rasa Balance</span>
                <span style={styles.subscoreValue}>{complianceData.rasaCompleteness}%</span>
              </div>
              <div style={styles.subscoreItem}>
                <span style={styles.subscoreLabel}>Dosha Match</span>
                <span style={styles.subscoreValue}>{complianceData.doshaCompatibility}%</span>
              </div>
              <div style={styles.subscoreItem}>
                <span style={styles.subscoreLabel}>Seasonal</span>
                <span style={styles.subscoreValue}>{complianceData.seasonalScore}%</span>
              </div>
              <div style={styles.subscoreItem}>
                <span style={styles.subscoreLabel}>Digestibility</span>
                <span style={styles.subscoreValue}>{complianceData.digestibilityScore}%</span>
              </div>
            </div>

            {/* Rasa Wheel */}
            <div style={styles.rasaSection}>
              <h5 style={styles.rasaTitle}>Six Tastes (Rasa)</h5>
              <div style={styles.rasaGrid}>
                {Object.entries(complianceData.rasaBalance || {}).map(([rasa, count]: [string, any]) => (
                  <div key={rasa} style={styles.rasaItem}>
                    <div style={{
                      ...styles.rasaDot,
                      backgroundColor: count > 0 ? '#4CAF50' : '#e0e0e0'
                    }}></div>
                    <span style={styles.rasaName}>{rasa}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warnings */}
            {complianceData.warnings && complianceData.warnings.length > 0 && (
              <div style={styles.warningsSection}>
                <h5 style={styles.warningsTitle}>⚠️ Warnings</h5>
                {complianceData.warnings.map((warning: string, index: number) => (
                  <div key={index} style={styles.warningItem}>{warning}</div>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {complianceData.suggestions && complianceData.suggestions.length > 0 && (
              <div style={styles.suggestionsSection}>
                <h5 style={styles.suggestionsTitle}>💡 Suggestions</h5>
                {complianceData.suggestions.map((suggestion: string, index: number) => (
                  <div key={index} style={styles.suggestionItem}>{suggestion}</div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  title: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    color: '#333',
  },
  viewToggle: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
  },
  toggleButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#666',
  },
  toggleButtonActive: {
    backgroundColor: '#2196F3',
    color: 'white',
    borderColor: '#2196F3',
    fontWeight: 'bold' as const,
  },
  section: {
    marginBottom: '25px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e0e0e0',
  },
  sectionTitle: {
    margin: '0 0 15px 0',
    fontSize: '15px',
    fontWeight: 'bold' as const,
    color: '#555',
  },
  calorieCircle: {
    position: 'relative' as const,
    width: '140px',
    height: '140px',
    margin: '0 auto 10px',
  },
  calorieText: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center' as const,
  },
  calorieValue: {
    fontSize: '28px',
    fontWeight: 'bold' as const,
    color: '#333',
  },
  calorieTarget: {
    fontSize: '14px',
    color: '#999',
  },
  calorieLabel: {
    fontSize: '12px',
    color: '#999',
  },
  statusLabel: {
    textAlign: 'center' as const,
    fontSize: '13px',
    fontWeight: 'bold' as const,
    margin: 0,
  },
  macroRow: {
    marginBottom: '15px',
  },
  macroLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  macroName: {
    fontSize: '13px',
    color: '#666',
  },
  macroAmount: {
    fontSize: '13px',
    fontWeight: 'bold' as const,
    color: '#333',
  },
  macroBar: {
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '4px',
  },
  macroFill: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  macroPercent: {
    fontSize: '11px',
    color: '#999',
  },
  fiberRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    marginTop: '10px',
  },
  fiberLabel: {
    fontSize: '13px',
    color: '#666',
  },
  fiberValue: {
    fontSize: '13px',
    fontWeight: 'bold' as const,
    color: '#333',
  },
  loadingText: {
    textAlign: 'center' as const,
    color: '#999',
    fontSize: '13px',
  },
  noDataText: {
    textAlign: 'center' as const,
    color: '#999',
    fontSize: '13px',
    padding: '20px',
  },
  scoreCircle: {
    textAlign: 'center' as const,
    padding: '20px',
    backgroundColor: '#f0f7ff',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  scoreValue: {
    fontSize: '36px',
    fontWeight: 'bold' as const,
    color: '#2196F3',
  },
  scoreMax: {
    fontSize: '18px',
    color: '#999',
  },
  scoreLabel: {
    fontSize: '13px',
    color: '#666',
    marginTop: '5px',
  },
  subscores: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    marginBottom: '15px',
  },
  subscoreItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    textAlign: 'center' as const,
  },
  subscoreLabel: {
    fontSize: '11px',
    color: '#999',
    marginBottom: '4px',
  },
  subscoreValue: {
    fontSize: '16px',
    fontWeight: 'bold' as const,
    color: '#333',
  },
  rasaSection: {
    marginBottom: '15px',
  },
  rasaTitle: {
    fontSize: '13px',
    fontWeight: 'bold' as const,
    color: '#555',
    marginBottom: '10px',
  },
  rasaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
  rasaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
  },
  rasaDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  rasaName: {
    textTransform: 'capitalize' as const,
    color: '#666',
  },
  warningsSection: {
    marginBottom: '15px',
    padding: '12px',
    backgroundColor: '#fff3e0',
    borderRadius: '6px',
    borderLeft: '3px solid #FF9800',
  },
  warningsTitle: {
    fontSize: '13px',
    fontWeight: 'bold' as const,
    color: '#E65100',
    margin: '0 0 8px 0',
  },
  warningItem: {
    fontSize: '12px',
    color: '#E65100',
    marginBottom: '4px',
  },
  suggestionsSection: {
    padding: '12px',
    backgroundColor: '#e8f5e9',
    borderRadius: '6px',
    borderLeft: '3px solid #4CAF50',
  },
  suggestionsTitle: {
    fontSize: '13px',
    fontWeight: 'bold' as const,
    color: '#2e7d32',
    margin: '0 0 8px 0',
  },
  suggestionItem: {
    fontSize: '12px',
    color: '#2e7d32',
    marginBottom: '4px',
  },
};

export default NutritionDashboard;