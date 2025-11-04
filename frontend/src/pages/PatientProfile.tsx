import React from "react";
import { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { patientService } from '../services/patientService';
import { assessmentService } from '../services/assessmentService';
import { useNavigate } from 'react-router-dom';
import { medicalHistoryService } from "../services/medicalHistoryService";
import DietChartWidget from '../components/widgets/DietChartWidget';
import QuizComponent from '../components/layout/QuizComponent';

const PatientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patientData, setPatientData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastAssessment, setLastAssessment] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [medicalHistoryCount, setMedicalHistoryCount] = useState(0);
  const [hasDietPlan] = useState(false);
  const navigate = useNavigate();
  
    useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      setError(''); 
        try {
        if (id) {
          const response = await patientService.getById(id);
          setPatientData(response.data.patient);
        }}
        catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch patient data');
      }finally {
        setLoading(false);
      }
    };
      fetchPatientData(); 
   }, [id]);

   useEffect(() => {
    const fetchLastAssessment = async () => {
      try {
        if (id) {
          const response = await assessmentService.getPatientAssessments(id);
          if (response.data && response.data.length > 0) {
            setLastAssessment(response.data[0]); // Most recent assessment
          }
        }
      } catch (err) {
        console.error('Failed to fetch assessment:', err);
      }
    };

    fetchLastAssessment();
  }, [id]);

  useEffect(() => {
  const fetchMedicalHistory = async () => {
    try {
      if (id) {
        // Assuming you have this endpoint
        const response = await medicalHistoryService.getPatientHistory(id);
        setMedicalHistoryCount(response.data.length);
      }
    } catch (err) {
      console.error('Failed to fetch medical history:', err);
    }
  };

  fetchMedicalHistory();
}, [id]);


// For diet plan - add later when you have the endpoint
// For now, we'll leave it as false
    const calculateProgress = () => {
      const milestones = [
        { name: 'Profile Created', completed: !!patientData },
        { name: 'Assessment Completed', completed: !!lastAssessment },
        { name: 'Medical History Added', completed: medicalHistoryCount > 0 },
        { name: 'Diet Plan Assigned', completed: hasDietPlan },
        { name: 'Measurements Recorded', completed: patientData?.height > 0 && patientData?.weight > 0 },
      ];

      const completedCount = milestones.filter(m => m.completed).length;
      const percentage = Math.round((completedCount / milestones.length) * 100);

      return { milestones, percentage };
    };
    
  return (
  <div style={enhancedStyles.mainContainer}>
    {loading && <div style={enhancedStyles.loading}>Loading patient data...</div>}
    
    {error && <div style={enhancedStyles.error}>{error}</div>}
    
    {!loading && !error && patientData && (
      <>
        {/* Patient Information Section - Full Width */}
        <div style={enhancedStyles.patientInfoSection}>
          <div style={enhancedStyles.headerRow}>
            <h2 style={enhancedStyles.patientName}>{patientData.name}</h2>
            <div style={enhancedStyles.actionButtons}>
              <button style={enhancedStyles.editButton} onClick={() => navigate(`/patients/edit/${id}`)}>
                Edit Profile
              </button>
              <button style={enhancedStyles.backButton} onClick={() => navigate('/patients')}>
                Back to List
              </button>
            </div>
          </div>

          <div style={enhancedStyles.infoGrid}>
            {/* Personal Info */}
            <div style={enhancedStyles.infoItem}>
              <span style={enhancedStyles.label}>Age:</span>
              <span style={enhancedStyles.value}>{patientData.age} years</span>
            </div>

            <div style={enhancedStyles.infoItem}>
              <span style={enhancedStyles.label}>Gender:</span>
              <span style={enhancedStyles.value}>{patientData.gender}</span>
            </div>

            <div style={enhancedStyles.infoItem}>
              <span style={enhancedStyles.label}>Height:</span>
              <span style={enhancedStyles.value}>{patientData.height} cm</span>
            </div>

            <div style={enhancedStyles.infoItem}>
              <span style={enhancedStyles.label}>Weight:</span>
              <span style={enhancedStyles.value}>{patientData.weight} kg</span>
            </div>

            <div style={enhancedStyles.infoItem}>
              <span style={enhancedStyles.label}>Activity Level:</span>
              <span style={enhancedStyles.value}>{patientData.activityLevel}</span>
            </div>

            <div style={enhancedStyles.infoItem}>
              <span style={enhancedStyles.label}>Dosha Type:</span>
              <span style={{...enhancedStyles.value, ...enhancedStyles.doshaBadge}}>
                {patientData.doshaType}
              </span>
            </div>
          </div>

          {/* Medical Conditions */}
          <div style={enhancedStyles.conditionsSection}>
            <div style={enhancedStyles.conditionBlock}>
              <h4 style={enhancedStyles.subHeading}>Medical Conditions</h4>
              {patientData.medicalConditions && patientData.medicalConditions.length > 0 ? (
                <div style={enhancedStyles.tagContainer}>
                  {patientData.medicalConditions.map((condition: string, index: number) => (
                    <span key={index} style={enhancedStyles.tag}>
                      {condition}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={enhancedStyles.noData}>No medical conditions recorded</p>
              )}
            </div>

            <div style={enhancedStyles.conditionBlock}>
              <h4 style={enhancedStyles.subHeading}>Allergies</h4>
              {patientData.allergies && patientData.allergies.length > 0 ? (
                <div style={enhancedStyles.tagContainer}>
                  {patientData.allergies.map((allergy: string, index: number) => (
                    <span key={index} style={{...enhancedStyles.tag, ...enhancedStyles.allergyTag}}>
                      {allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={enhancedStyles.noData}>No allergies recorded</p>
              )}
            </div>
          </div>
        </div>

        {/* Two Column Grid */}
        <div style={enhancedStyles.gridContainer}>
          {/* Left Column */}
          <div style={enhancedStyles.leftColumn}>
            {/* Quiz Section */}

                <div style={enhancedStyles.section}>
                  <h3>Prakriti Assessment</h3>
                  
                  {lastAssessment ? (
                    <div>
                      <p style={enhancedStyles.assessmentInfo}>
                        Last Assessment: {new Date(lastAssessment.assessmentDate).toLocaleDateString()}
                      </p>
                      
                      <div style={enhancedStyles.doshaResults}>
                        <div style={enhancedStyles.doshaBar}>
                          <span>Vata: {lastAssessment.percentages.vata}%</span>
                          <div style={enhancedStyles.progressBarContainer}>
                            <div style={{...enhancedStyles.progressBarFill, width: `${lastAssessment.percentages.vata}%`, backgroundColor: '#2196F3'}}></div>
                          </div>
                        </div>
                        
                        <div style={enhancedStyles.doshaBar}>
                          <span>Pitta: {lastAssessment.percentages.pitta}%</span>
                          <div style={enhancedStyles.progressBarContainer}>
                            <div style={{...enhancedStyles.progressBarFill, width: `${lastAssessment.percentages.pitta}%`, backgroundColor: '#FF5722'}}></div>
                          </div>
                        </div>
                        
                        <div style={enhancedStyles.doshaBar}>
                          <span>Kapha: {lastAssessment.percentages.kapha}%</span>
                          <div style={enhancedStyles.progressBarContainer}>
                            <div style={{...enhancedStyles.progressBarFill, width: `${lastAssessment.percentages.kapha}%`, backgroundColor: '#4CAF50'}}></div>
                          </div>
                        </div>
                      </div>
                      
                      <p style={enhancedStyles.resultDosha}>
                        Result: <strong>{lastAssessment.resultDoshaType.toUpperCase()}</strong>
                      </p>
                      
                      <button style={enhancedStyles.quizButton} onClick={() => setShowQuiz(true)}>
                        Retake Assessment
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p style={enhancedStyles.noAssessment}>No assessment taken yet</p>
                      <button style={enhancedStyles.quizButton} onClick={() => setShowQuiz(true)}>
                        Take Assessment
                      </button>
                    </div>
                  )}
                </div>
                {showQuiz && (
                    <QuizComponent 
                      patientId={id!} 
                      onClose={() => setShowQuiz(false)}
                      onComplete={(assessment: any) => {
                        setLastAssessment(assessment);
                        setShowQuiz(true);
                      }}
                    />
                  )}
            
            </div>

            {/* Progress Bar Section */}
          <div style={enhancedStyles.section}>
            <h3>Progress Tracker</h3>
            
            {(() => {
              const { milestones, percentage } = calculateProgress();
              
              return (
                <>
                  {/* Circular Progress */}
                  <div style={enhancedStyles.progressCircleContainer}>
                    <div style={enhancedStyles.progressCircle}>
                      <svg width="120" height="120">
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="#e0e0e0"
                          strokeWidth="10"
                          fill="none"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="#4CAF50"
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray={`${(percentage / 100) * 314} 314`}
                          strokeDashoffset="0"
                          transform="rotate(-90 60 60)"
                          style={{ transition: 'stroke-dasharray 0.5s ease' }}
                        />
                      </svg>
                      <div style={enhancedStyles.percentageText}>{percentage}%</div>
                    </div>
                    <p style={enhancedStyles.progressLabel}>Profile Completion</p>
                  </div>

                  {/* Milestones Checklist */}
                  <div style={enhancedStyles.milestonesList}>
                    {milestones.map((milestone, index) => (
                      <div key={index} style={enhancedStyles.milestoneItem}>
                        <span style={{
                          ...enhancedStyles.checkmark,
                          backgroundColor: milestone.completed ? '#4CAF50' : '#e0e0e0',
                          color: milestone.completed ? 'white' : '#999'
                        }}>
                          {milestone.completed ? '✓' : '○'}
                        </span>
                        <span style={{
                          ...enhancedStyles.milestoneName,
                          color: milestone.completed ? '#333' : '#999'
                        }}>
                          {milestone.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        

          {/* Right Column */}
          <div style={enhancedStyles.rightColumn}>

            {/* BMI Index Section */}
<div style={enhancedStyles.section}>
  <h3>BMI Index</h3>
  
  {(() => {
    if (!patientData?.height || !patientData?.weight) {
      return <p style={enhancedStyles.noData}>Height and weight not recorded</p>;
    }

    // Calculate BMI
    const heightInMeters = patientData.height / 100;
    const bmi = (patientData.weight / (heightInMeters * heightInMeters)).toFixed(1);
    const bmiValue = parseFloat(bmi);

    // Determine category and color
    let category = '';
    let color = '';
    let advice = '';

    if (bmiValue < 18.5) {
      category = 'Underweight';
      color = '#2196F3';
      advice = 'Consider increasing caloric intake with nutrient-dense foods';
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      category = 'Normal';
      color = '#4CAF50';
      advice = 'Maintain your current healthy lifestyle';
    } else if (bmiValue >= 25 && bmiValue < 30) {
      category = 'Overweight';
      color = '#FF9800';
      advice = 'Consider balanced diet and regular physical activity';
    } else {
      category = 'Obese';
      color = '#F44336';
      advice = 'Consult with healthcare provider for weight management plan';
    }

    // Calculate gauge position (0-100 scale, capped at 40 BMI for display)
    const gaugePosition = Math.min((bmiValue / 40) * 100, 100);

    return (
      <>
        {/* BMI Value Display */}
        <div style={enhancedStyles.bmiValueContainer}>
          <div style={{...enhancedStyles.bmiValue, color: color}}>
            {bmi}
          </div>
          <div style={enhancedStyles.bmiUnit}>kg/m²</div>
        </div>

        {/* Category Badge */}
        <div style={{...enhancedStyles.categoryBadge, backgroundColor: color}}>
          {category}
        </div>

        {/* Visual Gauge */}
        <div style={enhancedStyles.gaugeContainer}>
          <div style={enhancedStyles.gaugeBar}>
            <div style={enhancedStyles.gaugeSegment1}></div>
            <div style={enhancedStyles.gaugeSegment2}></div>
            <div style={enhancedStyles.gaugeSegment3}></div>
            <div style={enhancedStyles.gaugeSegment4}></div>
          </div>
          <div 
            style={{
              ...enhancedStyles.gaugePointer,
              left: `${gaugePosition}%`
            }}
          >
            <div style={{...enhancedStyles.pointerTriangle, borderBottomColor: color}}></div>
          </div>
        </div>

        {/* BMI Scale Labels */}
        <div style={enhancedStyles.scaleLabels}>
          <span style={enhancedStyles.scaleLabel}>15</span>
          <span style={enhancedStyles.scaleLabel}>18.5</span>
          <span style={enhancedStyles.scaleLabel}>25</span>
          <span style={enhancedStyles.scaleLabel}>30</span>
          <span style={enhancedStyles.scaleLabel}>40</span>
        </div>

        {/* Category Legend */}
        <div style={enhancedStyles.legendContainer}>
          <div style={enhancedStyles.legendItem}>
            <div style={{...enhancedStyles.legendColor, backgroundColor: '#2196F3'}}></div>
            <span style={enhancedStyles.legendText}>Underweight</span>
          </div>
          <div style={enhancedStyles.legendItem}>
            <div style={{...enhancedStyles.legendColor, backgroundColor: '#4CAF50'}}></div>
            <span style={enhancedStyles.legendText}>Normal</span>
          </div>
          <div style={enhancedStyles.legendItem}>
            <div style={{...enhancedStyles.legendColor, backgroundColor: '#FF9800'}}></div>
            <span style={enhancedStyles.legendText}>Overweight</span>
          </div>
          <div style={enhancedStyles.legendItem}>
            <div style={{...enhancedStyles.legendColor, backgroundColor: '#F44336'}}></div>
            <span style={enhancedStyles.legendText}>Obese</span>
          </div>
        </div>

        {/* Measurements */}
        <div style={enhancedStyles.measurementsContainer}>
          <div style={enhancedStyles.measurement}>
            <span style={enhancedStyles.measurementLabel}>Height</span>
            <span style={enhancedStyles.measurementValue}>{patientData.height} cm</span>
          </div>
          <div style={enhancedStyles.measurement}>
            <span style={enhancedStyles.measurementLabel}>Weight</span>
            <span style={enhancedStyles.measurementValue}>{patientData.weight} kg</span>
          </div>
        </div>

        {/* Advice */}
        <div style={enhancedStyles.adviceContainer}>
          <p style={enhancedStyles.adviceText}>{advice}</p>
        </div>
        </>
        );
      })()}
    </div>
            {/* Diet Charts Section */}
            <DietChartWidget patientId={id!} />
          </div>
        </div>

        {/* Medical History Timeline - Full Width 
        <div style={enhancedStyles.timelineSection}
        </div>
        */
        }
      </>
    )}
  </div>
);
};

const enhancedStyles = {
  mainContainer: {
    padding: '32px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    fontSize: '18px',
    color: '#6c757d',
    fontWeight: 500,
  },
  error: {
    backgroundColor: '#fff5f5',
    color: '#c53030',
    padding: '16px 20px',
    borderRadius: '12px',
    marginBottom: '24px',
    border: '1px solid #feb2b2',
    fontSize: '15px',
    fontWeight: 500,
  },
  patientInfoSection: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e9ecef',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '2px solid #f1f3f5',
  },
  patientName: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#212529',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
  },
  editButton: {
    padding: '12px 24px',
    backgroundColor: '#4c6ef5',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(76, 110, 245, 0.3)',
  },
  backButton: {
    padding: '12px 24px',
    backgroundColor: 'white',
    color: '#495057',
    border: '2px solid #dee2e6',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    border: '1px solid #e9ecef',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#6c757d',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  value: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#212529',
  },
  doshaBadge: {
    display: 'inline-block',
    padding: '6px 16px',
    backgroundColor: '#e7f5ff',
    color: '#1864ab',
    borderRadius: '20px',
    fontSize: '16px',
    fontWeight: 700,
    width: 'fit-content',
  },
  conditionsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  },
  conditionBlock: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    border: '1px solid #e9ecef',
  },
  subHeading: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#343a40',
    marginBottom: '16px',
    marginTop: 0,
  },
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '10px',
  },
  tag: {
    padding: '8px 16px',
    backgroundColor: '#e9ecef',
    color: '#495057',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 600,
    border: '1px solid #dee2e6',
  },
  allergyTag: {
    backgroundColor: '#fff5f5',
    color: '#c53030',
    border: '1px solid #feb2b2',
  },
  noData: {
    color: '#adb5bd',
    fontSize: '14px',
    fontStyle: 'italic',
    margin: 0,
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
    marginBottom: '24px',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e9ecef',
  },
  assessmentInfo: {
    fontSize: '14px',
    color: '#6c757d',
    marginBottom: '20px',
    fontWeight: 500,
  },
  doshaResults: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    marginBottom: '24px',
  },
  doshaBar: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  progressBarContainer: {
    width: '100%',
    height: '12px',
    backgroundColor: '#e9ecef',
    borderRadius: '20px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '20px',
    transition: 'width 0.5s ease',
  },
  resultDosha: {
    fontSize: '16px',
    color: '#495057',
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    textAlign: 'center' as const,
  },
  quizButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#4c6ef5',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(76, 110, 245, 0.3)',
  },
  noAssessment: {
    color: '#6c757d',
    fontSize: '15px',
    marginBottom: '20px',
    textAlign: 'center' as const,
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
  },
  progressCircleContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    marginBottom: '32px',
    padding: '20px 0',
  },
  progressCircle: {
    position: 'relative' as const,
    width: '120px',
    height: '120px',
    marginBottom: '16px',
  },
  percentageText: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '28px',
    fontWeight: 700,
    color: '#212529',
  },
  progressLabel: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#6c757d',
    margin: 0,
  },
  milestonesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '14px',
  },
  milestoneItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    transition: 'all 0.2s ease',
  },
  checkmark: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 700,
    flexShrink: 0,
  },
  milestoneName: {
    fontSize: '15px',
    fontWeight: 500,
  },
  bmiValueContainer: {
    textAlign: 'center' as const,
    marginBottom: '20px',
    padding: '24px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
  },
  bmiValue: {
    fontSize: '56px',
    fontWeight: 700,
    lineHeight: 1,
    marginBottom: '4px',
  },
  bmiUnit: {
    fontSize: '16px',
    color: '#6c757d',
    fontWeight: 600,
  },
  categoryBadge: {
    display: 'inline-block',
    padding: '10px 24px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '24px',
    width: '100%',
    textAlign: 'center' as const,
  },
  gaugeContainer: {
    position: 'relative' as const,
    marginBottom: '12px',
    padding: '0 8px',
  },
  gaugeBar: {
    display: 'flex',
    height: '20px',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  gaugeSegment1: {
    flex: 1,
    backgroundColor: '#2196F3',
  },
  gaugeSegment2: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  gaugeSegment3: {
    flex: 1,
    backgroundColor: '#FF9800',
  },
  gaugeSegment4: {
    flex: 1,
    backgroundColor: '#F44336',
  },
  gaugePointer: {
    position: 'absolute' as const,
    top: '-8px',
    transform: 'translateX(-50%)',
    transition: 'left 0.5s ease',
  },
  pointerTriangle: {
    width: 0,
    height: 0,
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderBottom: '12px solid',
  },
  scaleLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 8px',
    marginBottom: '24px',
  },
  scaleLabel: {
    fontSize: '12px',
    color: '#6c757d',
    fontWeight: 600,
  },
  legendContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '24px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  legendColor: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    flexShrink: 0,
  },
  legendText: {
    fontSize: '13px',
    color: '#495057',
    fontWeight: 500,
  },
  measurementsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '20px',
  },
  measurement: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
  },
  measurementLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#6c757d',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  measurementValue: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#212529',
  },
  adviceContainer: {
    padding: '16px',
    backgroundColor: '#e7f5ff',
    borderRadius: '10px',
    border: '1px solid #a5d8ff',
  },
  adviceText: {
    fontSize: '14px',
    color: '#1864ab',
    margin: 0,
    lineHeight: 1.6,
    fontWeight: 500,
  },
};


export default PatientProfile;