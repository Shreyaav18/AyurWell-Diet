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
  }, [startDate, chartType]);

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
        <h3 style={styles.heading}>Chart Details</h3>

        {/* Chart Type */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Chart Type *</label>
          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="chartType"
                value="daily"
                checked={chartType === 'daily'}
                onChange={(e) => setChartType(e.target.value as any)}
                style={styles.radio}
              />
              <span>Daily (1 day)</span>
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="chartType"
                value="weekly"
                checked={chartType === 'weekly'}
                onChange={(e) => setChartType(e.target.value as any)}
                style={styles.radio}
              />
              <span>Weekly (7 days)</span>
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="chartType"
                value="monthly"
                checked={chartType === 'monthly'}
                onChange={(e) => setChartType(e.target.value as any)}
                style={styles.radio}
              />
              <span>Monthly (30 days)</span>
            </label>
          </div>
        </div>

        {/* Date Range */}
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Start Date *</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>End Date *</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={styles.input}
              required
              disabled
            />
          </div>
        </div>

        {/* Target Calories */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Target Daily Calories *</label>
          <input
            type="number"
            value={targetCalories}
            onChange={(e) => setTargetCalories(Number(e.target.value))}
            style={styles.input}
            min={500}
            max={5000}
            step={50}
            required
          />
          <p style={styles.hint}>Recommended range: 1500-3000 kcal/day based on patient profile</p>
        </div>

        {/* Patient Allergies (Read-only) */}
        {patientAllergies.length > 0 && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Patient Allergies (Auto-excluded)</label>
            <div style={styles.tagContainer}>
              {patientAllergies.map((allergy, index) => (
                <span key={index} style={styles.allergyTag}>
                  ⚠️ {allergy}
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
              placeholder="e.g., gluten-free, low-sodium"
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
              + Add
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
            Next: Plan Meals →
          </button>
        </div>
      </form>

      {/* Info Panel */}
      <div style={styles.infoPanel}>
        <h4 style={styles.infoPanelHeading}>💡 Tips for Diet Chart Creation</h4>
        <ul style={styles.infoList}>
          <li>Start with weekly plans for better variety and balance</li>
          <li>Target calories are calculated based on patient's BMR and activity level</li>
          <li>Patient allergies are automatically excluded from food suggestions</li>
          <li>You can add additional dietary restrictions like vegan, keto, etc.</li>
          <li>Each meal can be auto-filled with AI suggestions or manually customized</li>
          <li>Real-time Ayurvedic compliance feedback will guide your selections</li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
  },
  form: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  heading: {
    margin: '0 0 25px 0',
    fontSize: '20px',
    color: '#333',
  },
  formGroup: {
    marginBottom: '25px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box' as const,
  },
  radioGroup: {
    display: 'flex',
    gap: '20px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  radio: {
    cursor: 'pointer',
  },
  hint: {
    fontSize: '12px',
    color: '#999',
    margin: '5px 0 0 0',
  },
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginTop: '10px',
  },
  allergyTag: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: 'bold' as const,
  },
  restrictionTag: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  removeTagButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#1976d2',
    cursor: 'pointer',
    fontSize: '14px',
    padding: 0,
    fontWeight: 'bold' as const,
  },
  addRestrictionRow: {
    display: 'flex',
    gap: '10px',
  },
  restrictionInput: {
    flex: 1,
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold' as const,
  },
  submitContainer: {
    marginTop: '30px',
    textAlign: 'right' as const,
  },
  nextButton: {
    padding: '12px 30px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold' as const,
  },
  infoPanel: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    height: 'fit-content',
  },
  infoPanelHeading: {
    margin: '0 0 15px 0',
    fontSize: '16px',
    color: '#333',
  },
  infoList: {
    margin: 0,
    paddingLeft: '20px',
    lineHeight: '1.8',
    fontSize: '14px',
    color: '#666',
  },
};

export default ChartMetadataForm;