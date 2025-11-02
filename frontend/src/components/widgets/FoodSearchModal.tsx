import React, { useState, useEffect } from 'react';
import { foodService } from '../../services/foodService';

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

interface FoodSearchModalProps {
  onClose: () => void;
  onSelect: (item: MealItem) => void;
  doshaType: string;
  allergies: string[];
}

interface FoodItem {
  _id: string;
  name: string;
  category: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  suitableForDoshas: string[];
  ayurvedicProperties: any;
  seasonalRecommendation: string[];
}

const FoodSearchModal: React.FC<FoodSearchModalProps> = ({ onClose, onSelect, doshaType, allergies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterDosha, setFilterDosha] = useState(false);
  const [filterSeasonal, setFilterSeasonal] = useState(false);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState<number>(100);

  const categories = [
    'all', 'grains', 'vegetables', 'fruits', 'legumes', 
    'dairy', 'meat', 'fish', 'nuts', 'seeds', 'oils', 
    'spices', 'beverages', 'sweets'
  ];

  // Get current season
  const getCurrentSeason = (): string => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  };

  const currentSeason = getCurrentSeason();

  // Fetch all foods on mount
  // Fetch all foods on mount
  useEffect(() => {
  const fetchFoods = async () => {
    try {
      const foodsArray = await foodService.getAllFoods({ limit: 1000 }); // or higher
      
      console.log('Foods array:', foodsArray);
      setFoods(foodsArray);
      setFilteredFoods(foodsArray);
    } catch (err) {
      console.error('Failed to fetch foods:', err);
      setFoods([]);
      setFilteredFoods([]);
    } finally {
      setLoading(false);
    }
  };
  fetchFoods();
}, []);

  // Filter foods based on search and filters
  useEffect(() => {
    let result = [...foods];

    // Search filter
    if (searchTerm.trim()) {
      result = result.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(food => food.category === selectedCategory);
    }

    // Dosha filter
    if (filterDosha) {
      const primaryDosha = doshaType.split('-')[0];
      result = result.filter(food => 
        food.suitableForDoshas.includes(primaryDosha) ||
        food.suitableForDoshas.includes('all')
      );
    }

    // Seasonal filter
    if (filterSeasonal) {
      result = result.filter(food => 
        food.seasonalRecommendation.includes(currentSeason) ||
        food.seasonalRecommendation.includes('all') ||
        food.seasonalRecommendation.includes('all_seasons')
      );
    }

    // Exclude allergens
    if (allergies.length > 0) {
      result = result.filter(food => {
        const foodName = food.name.toLowerCase();
        return !allergies.some(allergy => 
          foodName.includes(allergy.toLowerCase())
        );
      });
    }

    setFilteredFoods(result);
  }, [searchTerm, selectedCategory, filterDosha, filterSeasonal, foods, allergies, doshaType, currentSeason]);

  const handleFoodClick = (food: FoodItem) => {
    setSelectedFood(food);
    setQuantity(food.servingSize);
  };

  const handleAddFood = () => {
    if (!selectedFood) return;

    const ratio = quantity / selectedFood.servingSize;

    const item: MealItem = {
      type: 'food',
      itemId: selectedFood._id,
      name: selectedFood.name,
      quantity: quantity,
      unit: selectedFood.servingUnit,
      calories: Math.round(selectedFood.calories * ratio),
      protein: Math.round(selectedFood.protein * ratio * 10) / 10,
      carbs: Math.round(selectedFood.carbs * ratio * 10) / 10,
      fat: Math.round(selectedFood.fat * ratio * 10) / 10,
      fiber: Math.round((selectedFood.fiber || 0) * ratio * 10) / 10
    };

    onSelect(item);
  };

  const isDoshaCompatible = (food: FoodItem): boolean => {
    if (!doshaType) return false;
    const primaryDosha = doshaType.split('-')[0];
    return food.suitableForDoshas.includes(primaryDosha) || 
           food.suitableForDoshas.includes('all');
  };

  const isSeasonal = (food: FoodItem): boolean => {
    if (!food.seasonalRecommendation || !Array.isArray(food.seasonalRecommendation)) {
    return false;
  }
    return food.seasonalRecommendation.includes(currentSeason) ||
           food.seasonalRecommendation.includes('all') ||
           food.seasonalRecommendation.includes('all_seasons');
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h3 style={styles.title}>Search Food Items</h3>
          <button style={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        {/* Search Bar */}
        <div style={styles.searchSection}>
          <input
            type="text"
            placeholder="Search foods... (e.g., rice, banana, lentils)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
            autoFocus
          />
        </div>

        {/* Filters */}
        <div style={styles.filtersSection}>
          {/* Category Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={styles.select}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Dosha Filter */}
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filterDosha}
              onChange={(e) => setFilterDosha(e.target.checked)}
              style={styles.checkbox}
            />
            <span>Show only {doshaType}-compatible foods</span>
          </label>

          {/* Seasonal Filter */}
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filterSeasonal}
              onChange={(e) => setFilterSeasonal(e.target.checked)}
              style={styles.checkbox}
            />
            <span>Show only seasonal ({currentSeason}) foods</span>
          </label>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Food List */}
          <div style={styles.foodList}>
            {loading ? (
                <div style={styles.loadingState}>Loading foods...</div>
              ) : !Array.isArray(filteredFoods) || filteredFoods.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>No foods found</p>
                  <p style={styles.emptyHint}>Try adjusting your filters or search term</p>
                </div>
              ) : (
                filteredFoods.map(food => (
                <div
                  key={food._id}
                  style={{
                    ...styles.foodItem,
                    ...(selectedFood?._id === food._id ? styles.foodItemSelected : {})
                  }}
                  onClick={() => handleFoodClick(food)}
                >
                  <div style={styles.foodItemHeader}>
                    <span style={styles.foodName}>{food.name}</span>
                    <div style={styles.badges}>
                      {isDoshaCompatible(food) && (
                        <span style={styles.badgeDosha} title="Dosha compatible">✓</span>
                      )}
                      {isSeasonal(food) && (
                        <span style={styles.badgeSeasonal} title="Seasonal">🌱</span>
                      )}
                    </div>
                  </div>
                  <div style={styles.foodItemInfo}>
                    <span style={styles.category}>{food.category}</span>
                    <span style={styles.serving}>
                      {food.servingSize}{food.servingUnit} • {food.calories}cal
                    </span>
                  </div>
                  <div style={styles.macros}>
                    P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Food Details & Add Section */}
          {selectedFood && (
            <div style={styles.detailsPanel}>
              <h4 style={styles.detailsTitle}>{selectedFood.name}</h4>
              
              {/* Nutritional Info */}
              <div style={styles.nutritionSection}>
                <h5 style={styles.sectionHeading}>Nutrition (per {selectedFood.servingSize}{selectedFood.servingUnit})</h5>
                <div style={styles.nutritionGrid}>
                  <div style={styles.nutritionItem}>
                    <span style={styles.nutritionValue}>{selectedFood.calories}</span>
                    <span style={styles.nutritionLabel}>Calories</span>
                  </div>
                  <div style={styles.nutritionItem}>
                    <span style={styles.nutritionValue}>{selectedFood.protein}g</span>
                    <span style={styles.nutritionLabel}>Protein</span>
                  </div>
                  <div style={styles.nutritionItem}>
                    <span style={styles.nutritionValue}>{selectedFood.carbs}g</span>
                    <span style={styles.nutritionLabel}>Carbs</span>
                  </div>
                  <div style={styles.nutritionItem}>
                    <span style={styles.nutritionValue}>{selectedFood.fat}g</span>
                    <span style={styles.nutritionLabel}>Fat</span>
                  </div>
                </div>
              </div>

              {/* Ayurvedic Properties */}
              <div style={styles.ayurvedicSection}>
                <h5 style={styles.sectionHeading}>Ayurvedic Properties</h5>
                <div style={styles.propertyRow}>
                  <span style={styles.propertyLabel}>Rasa (Taste):</span>
                  <span style={styles.propertyValue}>
                    {selectedFood.ayurvedicProperties?.rasa?.join(', ') || 'N/A'}
                  </span>
                </div>
                <div style={styles.propertyRow}>
                  <span style={styles.propertyLabel}>Virya (Potency):</span>
                  <span style={styles.propertyValue}>
                    {selectedFood.ayurvedicProperties?.virya || 'N/A'}
                  </span>
                </div>
                <div style={styles.propertyRow}>
                  <span style={styles.propertyLabel}>Suitable for:</span>
                  <span style={styles.propertyValue}>
                    {selectedFood.suitableForDoshas?.join(', ') || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Quantity Input */}
              <div style={styles.quantitySection}>
                <label style={styles.quantityLabel}>Quantity:</label>
                <div style={styles.quantityInput}>
                  <button
                    style={styles.quantityButton}
                    onClick={() => setQuantity(Math.max(1, quantity - 10))}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    style={styles.quantityField}
                    min={1}
                  />
                  <span style={styles.quantityUnit}>{selectedFood.servingUnit}</span>
                  <button
                    style={styles.quantityButton}
                    onClick={() => setQuantity(quantity + 10)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Calculated Nutrition */}
              <div style={styles.calculatedSection}>
                <h5 style={styles.sectionHeading}>For {quantity}{selectedFood.servingUnit}:</h5>
                <div style={styles.calculatedGrid}>
                  <span>{Math.round(selectedFood.calories * (quantity / selectedFood.servingSize))} cal</span>
                  <span>P: {Math.round(selectedFood.protein * (quantity / selectedFood.servingSize) * 10) / 10}g</span>
                  <span>C: {Math.round(selectedFood.carbs * (quantity / selectedFood.servingSize) * 10) / 10}g</span>
                  <span>F: {Math.round(selectedFood.fat * (quantity / selectedFood.servingSize) * 10) / 10}g</span>
                </div>
              </div>

              {/* Add Button */}
              <button style={styles.addButton} onClick={handleAddFood}>
                ✓ Add to Meal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '1200px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 25px',
    borderBottom: '1px solid #e0e0e0',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    color: '#333',
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    padding: 0,
  },
  searchSection: {
    padding: '20px 25px',
    borderBottom: '1px solid #e0e0e0',
  },
  searchInput: {
    width: '100%',
    padding: '12px',
    fontSize: '15px',
    border: '2px solid #2196F3',
    borderRadius: '6px',
    boxSizing: 'border-box' as const,
  },
  filtersSection: {
    display: 'flex',
    gap: '20px',
    padding: '15px 25px',
    backgroundColor: '#f9f9f9',
    borderBottom: '1px solid #e0e0e0',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '500' as const,
    color: '#555',
  },
  select: {
    padding: '6px 10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#555',
  },
  checkbox: {
    cursor: 'pointer',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    flex: 1,
    overflow: 'hidden',
  },
  foodList: {
    padding: '20px',
    overflowY: 'auto' as const,
    borderRight: '1px solid #e0e0e0',
  },
  loadingState: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#999',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#999',
  },
  emptyHint: {
    fontSize: '13px',
    marginTop: '8px',
  },
  foodItem: {
    padding: '12px',
    marginBottom: '10px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  foodItemSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
  foodItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  foodName: {
    fontSize: '15px',
    fontWeight: '600' as const,
    color: '#333',
  },
  badges: {
    display: 'flex',
    gap: '6px',
  },
  badgeDosha: {
    fontSize: '16px',
    color: '#4CAF50',
  },
  badgeSeasonal: {
    fontSize: '16px',
  },
  foodItemInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  category: {
    fontSize: '12px',
    color: '#999',
    textTransform: 'capitalize' as const,
  },
  serving: {
    fontSize: '12px',
    color: '#666',
  },
  macros: {
    fontSize: '12px',
    color: '#666',
  },
  detailsPanel: {
    padding: '20px',
    overflowY: 'auto' as const,
    backgroundColor: '#f9f9f9',
  },
  detailsTitle: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    color: '#333',
  },
  nutritionSection: {
    marginBottom: '20px',
  },
  sectionHeading: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: '#555',
  },
  nutritionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  nutritionItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '6px',
  },
  nutritionValue: {
    fontSize: '16px',
    fontWeight: 'bold' as const,
    color: '#333',
  },
  nutritionLabel: {
    fontSize: '11px',
    color: '#999',
    marginTop: '2px',
  },
  ayurvedicSection: {
    marginBottom: '20px',
    padding: '12px',
    backgroundColor: '#fff',
    borderRadius: '6px',
  },
  propertyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '13px',
  },
  propertyLabel: {
    color: '#666',
    fontWeight: '500' as const,
  },
  propertyValue: {
    color: '#333',
    textTransform: 'capitalize' as const,
  },
  quantitySection: {
    marginBottom: '20px',
  },
  quantityLabel: {
    display: 'block',
    marginBottom: '10px',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: '#555',
  },
  quantityInput: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '6px',
  },
  quantityButton: {
    width: '35px',
    height: '35px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold' as const,
  },
  quantityField: {
    flex: 1,
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    textAlign: 'center' as const,
  },
  quantityUnit: {
    fontSize: '14px',
    color: '#666',
  },
  calculatedSection: {
    marginBottom: '20px',
    padding: '12px',
    backgroundColor: '#e8f5e9',
    borderRadius: '6px',
  },
  calculatedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    fontSize: '13px',
    color: '#2e7d32',
    fontWeight: '500' as const,
  },
  addButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold' as const,
  },
};

export default FoodSearchModal;