import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dietChartService } from '../../services/dietChartService';
import { patientService } from '../../services/patientService';

const DietChartsList: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [dietCharts, setDietCharts] = useState<any[]>([]);
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (patientId) {
          const [charts, patient] = await Promise.all([
            dietChartService.getPatientDietCharts(patientId),
            patientService.getById(patientId)
          ]);
          setDietCharts(charts);
          setPatientData(patient);
        }
      } catch (err: any) {
        setError('Failed to load diet charts');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#69de6dff';
      case 'draft': return '#eeb155ff';
      case 'completed': return '#77b4e5ff';
      case 'cancelled': return '#d35950ff';
      default: return '#999';
    }
  };

  const getStatusBadgeStyle = (status: string) => ({
    ...styles.statusBadge,
    backgroundColor: getStatusColor(status),
  });

  const handleActivateChart = async (chartId: string) => {
    try {
      // First, deactivate all active charts
      const activeCharts = dietCharts.filter(c => c.status === 'active');
      for (const chart of activeCharts) {
        await dietChartService.updateStatus(chart._id, 'completed');
      }
      
      // Activate the selected chart
      await dietChartService.updateStatus(chartId, 'active');
      
      // Refresh the list
      const updatedCharts = await dietChartService.getPatientDietCharts(patientId!);
      setDietCharts(updatedCharts);
    } catch (err) {
      alert('Failed to activate chart');
    }
  };

  const handleDeleteChart = async (chartId: string) => {
    if (window.confirm('Are you sure you want to delete this diet chart?')) {
      try {
        await dietChartService.deleteDietChart(chartId);
        setDietCharts(dietCharts.filter(c => c._id !== chartId));
      } catch (err) {
        alert('Failed to delete chart');
      }
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.container}>
      <div style={styles.error}>{error}</div>
    </div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <button style={styles.backButton} onClick={() => navigate(`/patients/${patientId}`)}>
            ← Back to Profile
          </button>
          <h2 style={styles.title}>Diet Charts - {patientData?.name}</h2>
          <p style={styles.subtitle}>Manage all diet plans for this patient</p>
        </div>
        <button 
          style={styles.createButton}
          onClick={() => navigate(`/patients/${patientId}/diet-charts/create`)}
        >
          + Create New Chart
        </button>
      </div>

      {/* Charts Grid */}
      {dietCharts.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No diet charts created yet</p>
          <button 
            style={styles.createButtonLarge}
            onClick={() => navigate(`/patients/${patientId}/diet-charts/create`)}
          >
            Create First Diet Chart
          </button>
        </div>
      ) : (
        <div style={styles.chartsGrid}>
          {dietCharts.map((chart) => (
            <div key={chart._id} style={styles.chartCard}>
              {/* Status Badge */}
              <div style={getStatusBadgeStyle(chart.status)}>
                {chart.status.toUpperCase()}
              </div>

              {/* Chart Type */}
              <h3 style={styles.chartType}>{chart.chartType} Plan</h3>

              {/* Date Range */}
              <div style={styles.dateRange}>
                <span style={styles.dateLabel}>Duration:</span>
                <span style={styles.dateValue}>
                  {new Date(chart.startDate).toLocaleDateString()} - {new Date(chart.endDate).toLocaleDateString()}
                </span>
              </div>

              {/* Target Calories */}
              <div style={styles.targetCalories}>
                <span style={styles.calorieLabel}>Target:</span>
                <span style={styles.calorieValue}>{chart.targetCalories} kcal/day</span>
              </div>

              {/* Nutritional Summary */}
              {chart.chartNutritionalAverage && (
                <div style={styles.nutritionBox}>
                  <h4 style={styles.nutritionHeading}>Daily Average</h4>
                  <div style={styles.macroRow}>
                    <div style={styles.macroItem}>
                      <span style={styles.macroValue}>{chart.chartNutritionalAverage.calories}</span>
                      <span style={styles.macroLabel}>cal</span>
                    </div>
                    <div style={styles.macroItem}>
                      <span style={styles.macroValue}>{chart.chartNutritionalAverage.protein}g</span>
                      <span style={styles.macroLabel}>protein</span>
                    </div>
                    <div style={styles.macroItem}>
                      <span style={styles.macroValue}>{chart.chartNutritionalAverage.carbs}g</span>
                      <span style={styles.macroLabel}>carbs</span>
                    </div>
                    <div style={styles.macroItem}>
                      <span style={styles.macroValue}>{chart.chartNutritionalAverage.fat}g</span>
                      <span style={styles.macroLabel}>fat</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Days Count */}
              <p style={styles.daysCount}>{chart.dayPlans.length} day(s) planned</p>

              {/* Dietary Restrictions */}
              {chart.dietaryRestrictions && chart.dietaryRestrictions.length > 0 && (
                <div style={styles.restrictionsBox}>
                  <span style={styles.restrictionsLabel}>Restrictions:</span>
                  <div style={styles.restrictionsTags}>
                    {chart.dietaryRestrictions.map((restriction: string, idx: number) => (
                      <span key={idx} style={styles.restrictionTag}>{restriction}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={styles.actions}>
                <button 
                  style={styles.viewButton}
                  onClick={() => navigate(`/patients/${patientId}/diet-charts/${chart._id}`)}
                >
                  View Details
                </button>
                
                {chart.status !== 'active' && (
                  <button 
                    style={styles.activateButton}
                    onClick={() => handleActivateChart(chart._id)}
                  >
                    Activate
                  </button>
                )}

                {chart.status === 'draft' && (
                  <button 
                    style={styles.deleteButton}
                    onClick={() => handleDeleteChart(chart._id)}
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* Created Date */}
              <p style={styles.createdDate}>
                Created: {new Date(chart.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1400px',
    margin: '0 auto',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
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
    fontSize: '28px',
    color: '#333',
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
  },
  createButton: {
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold' as const,
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '15px',
    borderRadius: '4px',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
  },
  emptyText: {
    fontSize: '18px',
    color: '#999',
    marginBottom: '20px',
  },
  createButtonLarge: {
    padding: '15px 30px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold' as const,
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  chartCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'relative' as const,
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '11px',
    fontWeight: 'bold' as const,
    marginBottom: '15px',
  },
  chartType: {
    fontSize: '20px',
    fontWeight: 'bold' as const,
    color: '#333',
    margin: '0 0 15px 0',
    textTransform: 'capitalize' as const,
  },
  dateRange: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    marginBottom: '12px',
  },
  dateLabel: {
    fontSize: '12px',
    color: '#999',
  },
  dateValue: {
    fontSize: '14px',
    color: '#555',
  },
  targetCalories: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    marginBottom: '15px',
  },
  calorieLabel: {
    fontSize: '13px',
    color: '#666',
  },
  calorieValue: {
    fontSize: '16px',
    fontWeight: 'bold' as const,
    color: '#333',
  },
  nutritionBox: {
    backgroundColor: '#f0f7ff',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '15px',
  },
  nutritionHeading: {
    fontSize: '13px',
    fontWeight: 'bold' as const,
    color: '#555',
    margin: '0 0 10px 0',
  },
  macroRow: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  macroItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  macroValue: {
    fontSize: '16px',
    fontWeight: 'bold' as const,
    color: '#333',
  },
  macroLabel: {
    fontSize: '11px',
    color: '#999',
  },
  daysCount: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '12px',
  },
  restrictionsBox: {
    marginBottom: '15px',
  },
  restrictionsLabel: {
    fontSize: '12px',
    color: '#999',
    display: 'block',
    marginBottom: '6px',
  },
  restrictionsTags: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
  },
  restrictionTag: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '4px 10px',
    borderRadius: '10px',
    fontSize: '11px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  viewButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold' as const,
  },
  activateButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold' as const,
  },
  deleteButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#F44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold' as const,
  },
  createdDate: {
    fontSize: '11px',
    color: '#999',
    textAlign: 'right' as const,
    margin: 0,
  },
};

export default DietChartsList;