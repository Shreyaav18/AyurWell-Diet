import React, { useState } from 'react';

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

interface DayPlan {
  dayNumber: number;
  meals: Meal[];
}

interface MealCardProps {
  meal: Meal;
  mealIndex: number;
  targetCalories: number;
  onAddItem: () => void;
  onRemoveItem: (itemIndex: number) => void;
  onUpdateQuantity: (itemIndex: number, quantity: number) => void;
  onAutoFill: () => void;
  onCopyMeal: (targetDayIndex: number) => void;
  onUpdateNotes: (notes: string) => void;
  autoFilling: boolean;
  dayPlans: DayPlan[];
  currentDayIndex: number;
}

const MealCard: React.FC<MealCardProps> = ({
  meal,
  mealIndex,
  targetCalories,
  onAddItem,
  onRemoveItem,
  onUpdateQuantity,
  onAutoFill,
  onCopyMeal,
  onUpdateNotes,
  autoFilling,
  dayPlans,
  currentDayIndex
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  const mealNames: any = {
    'breakfast': '🌅 Breakfast',
    'mid-morning-snack': '☕ Mid-Morning Snack',
    'lunch': '🍽️ Lunch',
    'evening-snack': '🍪 Evening Snack',
    'dinner': '🌙 Dinner',
    'bedtime-snack': '🥛 Bedtime Snack'
  };

  const currentCalories = meal.nutritionalTotals?.calories || 0;
  const caloriePercentage = Math.min((currentCalories / targetCalories) * 100, 100);
  
  const getCalorieStatus = () => {
    if (currentCalories === 0) return 'empty';
    const diff = Math.abs(currentCalories - targetCalories);
    if (diff <= targetCalories * 0.1) return 'good'; // Within 10%
    if (currentCalories > targetCalories) return 'high';
    return 'low';
  };

  const calorieStatus = getCalorieStatus();

  const statusColors: any = {
    empty: '#999',
    good: '#4CAF50',
    low: '#FF9800',
    high: '#F44336'
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div style={styles.headerLeft}>
          <button style={styles.expandButton}>
            {isExpanded ? '▼' : '▶'}
          </button>
          <h4 style={styles.mealName}>{mealNames[meal.mealType] || meal.mealType}</h4>
          <span style={styles.timeSlot}>{meal.timeSlot}</span>
        </div>
        
        <div style={styles.headerRight}>
          <div style={styles.calorieInfo}>
            <span style={{...styles.currentCalories, color: statusColors[calorieStatus]}}>
              {currentCalories}
            </span>
            <span style={styles.targetCalories}>/ {targetCalories} kcal</span>
          </div>
          <div style={styles.progressBarSmall}>
            <div 
              style={{
                ...styles.progressFillSmall,
                width: `${caloriePercentage}%`,
                backgroundColor: statusColors[calorieStatus]
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div style={styles.content}>
          {/* Actions Bar */}
          <div style={styles.actionsBar}>
            <button style={styles.actionButton} onClick={onAddItem}>
              ➕ Add Item
            </button>
            <button 
              style={{...styles.actionButton, ...styles.autoFillButton}} 
              onClick={onAutoFill}
              disabled={autoFilling}
            >
              {autoFilling ? '⏳ Generating...' : '🪄 Auto-fill'}
            </button>
            <div style={styles.copyMenuContainer}>
              <button 
                style={styles.actionButton}
                onClick={() => setShowCopyMenu(!showCopyMenu)}
              >
                📋 Copy to...
              </button>
              {showCopyMenu && (
                <div style={styles.copyMenu}>
                  {dayPlans.map((day, index) => (
                    index !== currentDayIndex && (
                      <button
                        key={index}
                        style={styles.copyMenuItem}
                        onClick={() => {
                          onCopyMeal(index);
                          setShowCopyMenu(false);
                        }}
                      >
                        Day {day.dayNumber}
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>
            <button 
              style={styles.actionButton}
              onClick={() => setShowNotesInput(!showNotesInput)}
            >
              📝 {meal.notes ? 'Edit Notes' : 'Add Notes'}
            </button>
          </div>

          {/* Notes Input */}
          {showNotesInput && (
            <div style={styles.notesSection}>
              <textarea
                value={meal.notes || ''}
                onChange={(e) => onUpdateNotes(e.target.value)}
                placeholder="Add notes for this meal (dietary preferences, cooking instructions, etc.)"
                style={styles.notesTextarea}
              />
            </div>
          )}

          {/* Items List */}
          {meal.items.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No items added yet</p>
              <p style={styles.emptyHint}>Click "Add Item" or "Auto-fill" to get started</p>
            </div>
          ) : (
            <div style={styles.itemsList}>
              {meal.items.map((item, itemIndex) => (
                <div key={itemIndex} style={styles.itemRow}>
                  <div style={styles.itemLeft}>
                    <span style={styles.itemType}>
                      {item.type === 'food' ? '🥗' : '🍳'}
                    </span>
                    <div style={styles.itemInfo}>
                      <span style={styles.itemName}>{item.name || 'Unknown Item'}</span>
                      <span style={styles.itemMacros}>
                        {item.calories}cal • P:{item.protein}g • C:{item.carbs}g • F:{item.fat}g
                      </span>
                    </div>
                  </div>

                  <div style={styles.itemRight}>
                    {editingItemIndex === itemIndex ? (
                      <div style={styles.quantityEdit}>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => onUpdateQuantity(itemIndex, Number(e.target.value))}
                          style={styles.quantityInput}
                          min={1}
                          autoFocus
                          onBlur={() => setEditingItemIndex(null)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') setEditingItemIndex(null);
                          }}
                        />
                        <span style={styles.unit}>{item.unit}</span>
                      </div>
                    ) : (
                      <div 
                        style={styles.quantityDisplay}
                        onClick={() => setEditingItemIndex(itemIndex)}
                      >
                        <span style={styles.quantity}>{item.quantity}</span>
                        <span style={styles.unit}>{item.unit}</span>
                      </div>
                    )}
                    
                    <button
                      style={styles.removeButton}
                      onClick={() => onRemoveItem(itemIndex)}
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Nutritional Summary */}
          {meal.nutritionalTotals && meal.items.length > 0 && (
            <div style={styles.nutritionSummary}>
              <h5 style={styles.summaryHeading}>Meal Totals</h5>
              <div style={styles.macroGrid}>
                <div style={styles.macroBox}>
                  <span style={styles.macroValue}>{meal.nutritionalTotals.calories}</span>
                  <span style={styles.macroLabel}>Calories</span>
                </div>
                <div style={styles.macroBox}>
                  <span style={styles.macroValue}>{meal.nutritionalTotals.protein}g</span>
                  <span style={styles.macroLabel}>Protein</span>
                </div>
                <div style={styles.macroBox}>
                  <span style={styles.macroValue}>{meal.nutritionalTotals.carbs}g</span>
                  <span style={styles.macroLabel}>Carbs</span>
                </div>
                <div style={styles.macroBox}>
                  <span style={styles.macroValue}>{meal.nutritionalTotals.fat}g</span>
                  <span style={styles.macroLabel}>Fat</span>
                </div>
                <div style={styles.macroBox}>
                  <span style={styles.macroValue}>{meal.nutritionalTotals.fiber}g</span>
                  <span style={styles.macroLabel}>Fiber</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes Display */}
          {meal.notes && !showNotesInput && (
            <div style={styles.notesDisplay}>
              <strong>Notes:</strong> {meal.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    borderBottom: '1px solid #e0e0e0',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  expandButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#666',
  },
  mealName: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold' as const,
    color: '#333',
  },
  timeSlot: {
    fontSize: '13px',
    color: '#999',
    backgroundColor: '#e0e0e0',
    padding: '3px 8px',
    borderRadius: '10px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  calorieInfo: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '5px',
  },
  currentCalories: {
    fontSize: '18px',
    fontWeight: 'bold' as const,
  },
  targetCalories: {
    fontSize: '13px',
    color: '#999',
  },
  progressBarSmall: {
    width: '100px',
    height: '6px',
    backgroundColor: '#e0e0e0',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFillSmall: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  content: {
    padding: '20px',
  },
  actionsBar: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
    flexWrap: 'wrap' as const,
  },
  actionButton: {
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500' as const,
  },
  autoFillButton: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
    color: '#1976d2',
  },
  copyMenuContainer: {
    position: 'relative' as const,
  },
  copyMenu: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    marginTop: '5px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 10,
    minWidth: '120px',
  },
  copyMenuItem: {
    display: 'block',
    width: '100%',
    padding: '10px 15px',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left' as const,
    cursor: 'pointer',
    fontSize: '13px',
  },
  notesSection: {
    marginBottom: '15px',
  },
  notesTextarea: {
    width: '100%',
    minHeight: '60px',
    padding: '10px',
    fontSize: '13px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    resize: 'vertical' as const,
    boxSizing: 'border-box' as const,
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px 20px',
    color: '#999',
  },
  emptyText: {
    fontSize: '15px',
    margin: '0 0 8px 0',
  },
  emptyHint: {
    fontSize: '13px',
    margin: 0,
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    marginBottom: '20px',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
  },
  itemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  itemType: {
    fontSize: '20px',
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '500' as const,
    color: '#333',
  },
  itemMacros: {
    fontSize: '12px',
    color: '#666',
  },
  itemRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  quantityDisplay: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    minWidth: '70px',
    justifyContent: 'center',
  },
  quantityEdit: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },
  quantityInput: {
    width: '60px',
    padding: '4px',
    fontSize: '13px',
    border: '1px solid #2196F3',
    borderRadius: '4px',
    textAlign: 'center' as const,
  },
  quantity: {
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: '#333',
  },
  unit: {
    fontSize: '12px',
    color: '#666',
  },
  removeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px',
  },
  nutritionSummary: {
    backgroundColor: '#f0f7ff',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '15px',
  },
  summaryHeading: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: '#555',
  },
  macroGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '10px',
  },
  macroBox: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '8px',
    backgroundColor: '#fff',
    borderRadius: '4px',
  },
  macroValue: {
    fontSize: '16px',
    fontWeight: 'bold' as const,
    color: '#333',
  },
  macroLabel: {
    fontSize: '11px',
    color: '#999',
    marginTop: '2px',
  },
  notesDisplay: {
    padding: '12px',
    backgroundColor: '#fffbea',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#666',
    borderLeft: '3px solid #ffc107',
  },
};

export default MealCard;