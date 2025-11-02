import React from 'react';

interface ChartMetadataFormProps {
  chartType: 'daily' | 'weekly' | 'monthly';
  setChartType: (type: 'daily' | 'weekly' | 'monthly') => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  targetCalories: number;
  setTargetCalories: (calories: number) => void;
  dietaryRestrictions: string[];
  setDietaryRestrictions: (restrictions: string[]) => void;
  patientAllergies: string[];
  onNext: () => void;
}

const ChartMetadataForm: React.FC<ChartMetadataFormProps> = ({
  chartType,
  setChartType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  targetCalories,
  setTargetCalories,
  dietaryRestrictions,
  setDietaryRestrictions,
  patientAllergies,
  onNext
}) => {
  const [newRestriction, setNewRestriction] = React.useState('');

  // Auto-calculate end date based on chart type
  React.useEffect(() => {
    if (startDate) {
      const start = new Date(startDate);
      let end = new Date(start);
      
      if (chartType === 'daily') {
        end = new Date(start);
      } else if (chartType === 'weekly') {
        end.setDate(start.getDate() + 6);
      } else if (chartType === 'monthly') {
        end.setDate(start.getDate() + 29);
      }
      
      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [startDate, chartType, setEndDate]);

  const handleAddRestriction = () => {
    if (newRestriction.trim() && !dietaryRestrictions.includes(newRestriction.trim())) {
      setDietaryRestrictions([...dietaryRestrictions, newRestriction.trim()]);
      setNewRestriction('');
    }
  };

  const handleRemoveRestriction = (restriction: string) => {
    setDietaryRestrictions(dietaryRestrictions.filter(r => r !== restriction));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate || !targetCalories) {
      alert('Please fill all required fields');
      return;
    }
    
    if (targetCalories < 500 || targetCalories > 5000) {
      alert('Target calories must be between 500 and 5000');
      return;
    }
    
    onNext();
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.headerSection}>
          <h3 style={styles.heading}>Chart Details</h3>
          <p style={styles.subheading}>Configure your diet chart parameters</p>
        </div>

        {/* Chart Type */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Chart Type <span style={styles.required}>*</span>
          </label>
          <div style={styles.radioGroup}>
            {[
              { value: 'daily', label: 'Daily', days: '1 day' },
              { value: 'weekly', label: 'Weekly', days: '7 days' },
              { value: 'monthly', label: 'Monthly', days: '30 days' }
            ].map((option) => (
              <label 
                key={option.value}
                style={{
                  ...styles.radioCard,
                  ...(chartType === option.value ? styles.radioCardActive : {})
                }}
              >
                <input
                  type="radio"
                  name="chartType"
                  value={option.value}
                  checked={chartType === option.value}
                  onChange={(e) => setChartType(e.target.value as any)}
                  style={styles.radioInput}
                />
                <div style={styles.radioContent}>
                  <span style={styles.radioLabel}>{option.label}</span>
                  <span style={styles.radioDays}>{option.days}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Start Date <span style={styles.required}>*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              End Date <span style={styles.required}>*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{...styles.input, ...styles.inputDisabled}}
              required
              disabled
            />
          </div>
        </div>

        {/* Target Calories */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Target Daily Calories <span style={styles.required}>*</span>
          </label>
          <div style={styles.calorieInputWrapper}>
            <input
              type="number"
              value={targetCalories}
              onChange={(e) => setTargetCalories(Number(e.target.value))}
              style={styles.calorieInput}
              min={500}
              max={5000}
              step={50}
              required
            />
            <span style={styles.calorieUnit}>kcal/day</span>
          </div>
          <div style={styles.hintBox}>
            <span style={styles.hintIcon}>💡</span>
            <span style={styles.hint}>Recommended range: 1500-3000 kcal/day based on patient profile</span>
          </div>
        </div>

        {/* Patient Allergies (Read-only) */}
        {patientAllergies.length > 0 && (
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <span style={styles.allergyIcon}>⚠️</span>
              Patient Allergies (Auto-excluded)
            </label>
            <div style={styles.tagContainer}>
              {patientAllergies.map((allergy, index) => (
                <span key={index} style={styles.allergyTag}>
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Dietary Restrictions */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Additional Dietary Restrictions</label>
          <div style={styles.addRestrictionRow}>
            <input
              type="text"
              value={newRestriction}
              onChange={(e) => setNewRestriction(e.target.value)}
              placeholder="e.g., gluten-free, low-sodium, vegan"
              style={styles.restrictionInput}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddRestriction();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddRestriction}
              style={styles.addButton}
            >
              <span style={styles.addButtonIcon}>+</span>
              Add
            </button>
          </div>
          {dietaryRestrictions.length > 0 && (
            <div style={styles.tagContainer}>
              {dietaryRestrictions.map((restriction, index) => (
                <span key={index} style={styles.restrictionTag}>
                  {restriction}
                  <button
                    type="button"
                    onClick={() => handleRemoveRestriction(restriction)}
                    style={styles.removeTagButton}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div style={styles.submitContainer}>
          <button type="submit" style={styles.nextButton}>
            <span>Next: Plan Meals</span>
            <span style={styles.buttonArrow}>→</span>
          </button>
        </div>
      </form>

      {/* Info Panel */}
      <div style={styles.infoPanel}>
        <div style={styles.infoPanelHeader}>
          <span style={styles.infoPanelIcon}>💡</span>
          <h4 style={styles.infoPanelHeading}>Tips for Diet Chart Creation</h4>
        </div>
        <ul style={styles.infoList}>
          <li style={styles.infoListItem}>
            <span style={styles.bulletIcon}>✓</span>
            Start with weekly plans for better variety and balance
          </li>
          <li style={styles.infoListItem}>
            <span style={styles.bulletIcon}>✓</span>
            Target calories are calculated based on patient's BMR and activity level
          </li>
          <li style={styles.infoListItem}>
            <span style={styles.bulletIcon}>✓</span>
            Patient allergies are automatically excluded from food suggestions
          </li>
          <li style={styles.infoListItem}>
            <span style={styles.bulletIcon}>✓</span>
            You can add additional dietary restrictions like vegan, keto, etc.
          </li>
          <li style={styles.infoListItem}>
            <span style={styles.bulletIcon}>✓</span>
            Each meal can be auto-filled with AI suggestions or manually customized
          </li>
          <li style={styles.infoListItem}>
            <span style={styles.bulletIcon}>✓</span>
            Real-time Ayurvedic compliance feedback will guide your selections
          </li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f0f0f0',
  },
  headerSection: {
    marginBottom: '32px',
    paddingBottom: '20px',
    borderBottom: '2px solid #f5f5f5',
  },
  heading: {
    margin: '0 0 8px 0',
    fontSize: '24px',
    fontWeight: 700,
    color: '#1a1a1a',
    letterSpacing: '-0.5px',
  },
  subheading: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
    fontWeight: 400,
  },
  formGroup: {
    marginBottom: '28px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '28px',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#333',
    letterSpacing: '0.2px',
  },
  required: {
    color: '#ef4444',
    marginLeft: '2px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    boxSizing: 'border-box' as const,
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    outline: 'none',
    backgroundColor: '#fff',
  },
  inputDisabled: {
    backgroundColor: '#f9fafb',
    color: '#9ca3af',
    cursor: 'not-allowed',
  },
  radioGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  radioCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff',
  },
  radioCardActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0fdf4',
    boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
  },
  radioInput: {
    margin: '0 12px 0 0',
    cursor: 'pointer',
    accentColor: '#4CAF50',
  },
  radioContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  radioLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#333',
  },
  radioDays: {
    fontSize: '12px',
    color: '#666',
  },
  calorieInputWrapper: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
  },
  calorieInput: {
    width: '100%',
    padding: '12px 100px 12px 14px',
    fontSize: '14px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    boxSizing: 'border-box' as const,
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    outline: 'none',
  },
  calorieUnit: {
    position: 'absolute' as const,
    right: '14px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#666',
    pointerEvents: 'none' as const,
  },
  hintBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px',
    padding: '10px 12px',
    backgroundColor: '#f0f9ff',
    borderRadius: '6px',
    border: '1px solid #e0f2fe',
  },
  hintIcon: {
    fontSize: '14px',
  },
  hint: {
    fontSize: '13px',
    color: '#0369a1',
    margin: 0,
    lineHeight: '1.5',
  },
  allergyIcon: {
    marginRight: '6px',
  },
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '10px',
    marginTop: '12px',
  },
  allergyTag: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '8px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 600,
    border: '1px solid #fecaca',
    display: 'inline-flex',
    alignItems: 'center',
  },
  restrictionTag: {
    backgroundColor: '#eff6ff',
    color: '#1e40af',
    padding: '8px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 500,
    border: '1px solid #dbeafe',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  removeTagButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#1e40af',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '0 2px',
    fontWeight: 700,
    lineHeight: 1,
    transition: 'color 0.2s ease',
  },
  addRestrictionRow: {
    display: 'flex',
    gap: '12px',
  },
  restrictionInput: {
    flex: 1,
    padding: '12px 14px',
    fontSize: '14px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  addButton: {
    padding: '12px 24px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
  },
  addButtonIcon: {
    fontSize: '18px',
    fontWeight: 700,
  },
  submitContainer: {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '2px solid #f5f5f5',
    textAlign: 'right' as const,
  },
  nextButton: {
    padding: '14px 32px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px rgba(76, 175, 80, 0.2)',
  },
  buttonArrow: {
    fontSize: '18px',
    fontWeight: 700,
  },
  infoPanel: {
    backgroundColor: '#ffffff',
    padding: '28px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f0f0f0',
    height: 'fit-content',
    position: 'sticky' as const,
    top: '20px',
  },
  infoPanelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '2px solid #f5f5f5',
  },
  infoPanelIcon: {
    fontSize: '20px',
  },
  infoPanelHeading: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    color: '#1a1a1a',
    letterSpacing: '-0.2px',
  },
  infoList: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '14px',
  },
  infoListItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    fontSize: '14px',
    color: '#4b5563',
    lineHeight: '1.6',
  },
  bulletIcon: {
    color: '#4CAF50',
    fontWeight: 700,
    fontSize: '14px',
    flexShrink: 0,
  },
};

export default ChartMetadataForm;