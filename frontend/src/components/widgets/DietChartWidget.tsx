import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dietChartService } from '../../services/dietChartService';

interface DietChartWidgetProps {
  patientId: string;
}

const DietChartWidget: React.FC<DietChartWidgetProps> = ({ patientId }) => {
  const [dietCharts, setDietCharts] = useState<any[]>([]);
  const [loadingCharts, setLoadingCharts] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDietCharts = async () => {
      try {
        const charts = await dietChartService.getPatientDietCharts(patientId);
        setDietCharts(charts);
      } catch (err) {
        console.error('Failed to fetch diet charts:', err);
      } finally {
        setLoadingCharts(false);
      }
    };
    fetchDietCharts();
  }, [patientId]);

  if (loadingCharts) {
    return <p style={styles.loading}>Loading diet charts...</p>;
  }

  const activeChart = dietCharts.find(chart => chart.status === 'active');

  return (
    <div style={styles.section}>
      <h3>Diet Charts</h3>
      
      {activeChart ? (
        <div>
          {/* Active Chart Summary */}
          <div style={styles.activeChartBadge}>
            <span style={styles.activeDot}>●</span> Active Plan
          </div>
          
          <div style={styles.chartInfo}>
            <p style={styles.chartType}>{activeChart.chartType.toUpperCase()} PLAN</p>
            <p style={styles.chartDates}>
              {new Date(activeChart.startDate).toLocaleDateString()} - {new Date(activeChart.endDate).toLocaleDateString()}
            </p>
          </div>

          {/* Nutritional Summary */}
          <div style={styles.nutritionSummary}>
            <h4 style={styles.nutritionTitle}>Daily Average</h4>
            <div style={styles.macroGrid}>
              <div style={styles.macroItem}>
                <div style={styles.macroValue}>{activeChart.chartNutritionalAverage?.calories || 0}</div>
                <div style={styles.macroLabel}>Calories</div>
              </div>
              <div style={styles.macroItem}>
                <div style={styles.macroValue}>{activeChart.chartNutritionalAverage?.protein || 0}g</div>
                <div style={styles.macroLabel}>Protein</div>
              </div>
              <div style={styles.macroItem}>
                <div style={styles.macroValue}>{activeChart.chartNutritionalAverage?.carbs || 0}g</div>
                <div style={styles.macroLabel}>Carbs</div>
              </div>
              <div style={styles.macroItem}>
                <div style={styles.macroValue}>{activeChart.chartNutritionalAverage?.fat || 0}g</div>
                <div style={styles.macroLabel}>Fat</div>
              </div>
            </div>

            {/* Target vs Actual */}
            <div style={styles.targetComparison}>
              <p style={styles.targetLabel}>Target Calories:</p>
              <p style={styles.targetValue}>{activeChart.targetCalories} kcal/day</p>
            </div>

            {/* Progress Bar */}
            <div style={styles.calorieProgressContainer}>
              <div style={styles.calorieProgressBar}>
                <div 
                  style={{
                    ...styles.calorieProgressFill,
                    width: `${Math.min((activeChart.chartNutritionalAverage?.calories / activeChart.targetCalories) * 100, 100)}%`,
                    backgroundColor: 
                      Math.abs(activeChart.chartNutritionalAverage?.calories - activeChart.targetCalories) < 100 
                        ? '#4CAF50' 
                        : '#FF9800'
                  }}
                ></div>
              </div>
              <p style={styles.progressText}>
                {Math.round((activeChart.chartNutritionalAverage?.calories / activeChart.targetCalories) * 100)}% of target
              </p>
            </div>
          </div>

          <button 
            style={styles.viewAllButton}
            onClick={() => navigate(`/patients/${patientId}/diet-charts`)}
          >
            View All Diet Charts ({dietCharts.length})
          </button>
        </div>
      ) : (
        <div>
          <p style={styles.noData}>No active diet chart</p>
          {dietCharts.length > 0 && (
            <p style={styles.infoText}>{dietCharts.length} draft/completed chart(s) available</p>
          )}
          <button 
            style={styles.createButton}
            onClick={() => navigate(`/patients/${patientId}/diet-charts`)}
          >
            {dietCharts.length > 0 ? 'Manage Diet Charts' : 'Create Diet Chart'}
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  section: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  loading: {
    color: '#999',
    fontStyle: 'italic' as const,
  },
  activeChartBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold' as const,
    marginBottom: '15px',
  },
  activeDot: {
    color: '#4CAF50',
    fontSize: '16px',
  },
  chartInfo: {
    marginBottom: '15px',
  },
  chartType: {
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: '#666',
    margin: '0 0 5px 0',
  },
  chartDates: {
    fontSize: '13px',
    color: '#999',
    margin: 0,
  },
  nutritionSummary: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  nutritionTitle: {
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: '#555',
    margin: '0 0 12px 0',
  },
  macroGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '15px',
  },
  macroItem: {
    textAlign: 'center' as const,
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
  },
  macroValue: {
    fontSize: '20px',
    fontWeight: 'bold' as const,
    color: '#333',
  },
  macroLabel: {
    fontSize: '12px',
    color: '#999',
    marginTop: '4px',
  },
  targetComparison: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  targetLabel: {
    fontSize: '13px',
    color: '#666',
    margin: 0,
  },
  targetValue: {
    fontSize: '15px',
    fontWeight: 'bold' as const,
    color: '#333',
    margin: 0,
  },
  calorieProgressContainer: {
    marginTop: '10px',
  },
  calorieProgressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  calorieProgressFill: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '12px',
    color: '#666',
    textAlign: 'center' as const,
    marginTop: '5px',
    margin: 0,
  },
  viewAllButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold' as const,
  },
  createButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    marginTop: '10px',
  },
  infoText: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '10px',
  },
  noData: {
    color: '#999',
    fontStyle: 'italic' as const,
    marginBottom: '10px',
  },
};

export default DietChartWidget;