import React from "react";
import { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { patientService } from '../services/patientService';
import { assessmentService } from '../services/assessmentService';
import { useNavigate } from 'react-router-dom';
import { medicalHistoryService } from "../services/medicalHistoryService";
import { styles } from './styles';
import QuizComponent from '../components/layout/QuizComponent';

const PatientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patientData, setPatientData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastAssessment, setLastAssessment] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [medicalHistoryCount, setMedicalHistoryCount] = useState(0);
  const [hasDietPlan, setHasDietPlan] = useState(false);
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
  <div style={styles.mainContainer}>
    {loading && <div style={styles.loading}>Loading patient data...</div>}
    
    {error && <div style={styles.error}>{error}</div>}
    
    {!loading && !error && patientData && (
      <>
        {/* Patient Information Section - Full Width */}
        <div style={styles.patientInfoSection}>
          <div style={styles.headerRow}>
            <h2 style={styles.patientName}>{patientData.name}</h2>
            <div style={styles.actionButtons}>
              <button style={styles.editButton} onClick={() => navigate(`/patients/edit/${id}`)}>
                Edit Profile
              </button>
              <button style={styles.backButton} onClick={() => navigate('/patients')}>
                Back to List
              </button>
            </div>
          </div>

          <div style={styles.infoGrid}>
            {/* Personal Info */}
            <div style={styles.infoItem}>
              <span style={styles.label}>Age:</span>
              <span style={styles.value}>{patientData.age} years</span>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.label}>Gender:</span>
              <span style={styles.value}>{patientData.gender}</span>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.label}>Height:</span>
              <span style={styles.value}>{patientData.height} cm</span>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.label}>Weight:</span>
              <span style={styles.value}>{patientData.weight} kg</span>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.label}>Activity Level:</span>
              <span style={styles.value}>{patientData.activityLevel}</span>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.label}>Dosha Type:</span>
              <span style={{...styles.value, ...styles.doshaBadge}}>
                {patientData.doshaType}
              </span>
            </div>
          </div>

          {/* Medical Conditions */}
          <div style={styles.conditionsSection}>
            <div style={styles.conditionBlock}>
              <h4 style={styles.subHeading}>Medical Conditions</h4>
              {patientData.medicalConditions && patientData.medicalConditions.length > 0 ? (
                <div style={styles.tagContainer}>
                  {patientData.medicalConditions.map((condition: string, index: number) => (
                    <span key={index} style={styles.tag}>
                      {condition}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={styles.noData}>No medical conditions recorded</p>
              )}
            </div>

            <div style={styles.conditionBlock}>
              <h4 style={styles.subHeading}>Allergies</h4>
              {patientData.allergies && patientData.allergies.length > 0 ? (
                <div style={styles.tagContainer}>
                  {patientData.allergies.map((allergy: string, index: number) => (
                    <span key={index} style={{...styles.tag, ...styles.allergyTag}}>
                      {allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={styles.noData}>No allergies recorded</p>
              )}
            </div>
          </div>
        </div>

        {/* Two Column Grid */}
        <div style={styles.gridContainer}>
          {/* Left Column */}
          <div style={styles.leftColumn}>
            {/* Quiz Section */}

                <div style={styles.section}>
                  <h3>Prakriti Assessment</h3>
                  
                  {lastAssessment ? (
                    <div>
                      <p style={styles.assessmentInfo}>
                        Last Assessment: {new Date(lastAssessment.assessmentDate).toLocaleDateString()}
                      </p>
                      
                      <div style={styles.doshaResults}>
                        <div style={styles.doshaBar}>
                          <span>Vata: {lastAssessment.percentages.vata}%</span>
                          <div style={styles.progressBarContainer}>
                            <div style={{...styles.progressBarFill, width: `${lastAssessment.percentages.vata}%`, backgroundColor: '#2196F3'}}></div>
                          </div>
                        </div>
                        
                        <div style={styles.doshaBar}>
                          <span>Pitta: {lastAssessment.percentages.pitta}%</span>
                          <div style={styles.progressBarContainer}>
                            <div style={{...styles.progressBarFill, width: `${lastAssessment.percentages.pitta}%`, backgroundColor: '#FF5722'}}></div>
                          </div>
                        </div>
                        
                        <div style={styles.doshaBar}>
                          <span>Kapha: {lastAssessment.percentages.kapha}%</span>
                          <div style={styles.progressBarContainer}>
                            <div style={{...styles.progressBarFill, width: `${lastAssessment.percentages.kapha}%`, backgroundColor: '#4CAF50'}}></div>
                          </div>
                        </div>
                      </div>
                      
                      <p style={styles.resultDosha}>
                        Result: <strong>{lastAssessment.resultDoshaType.toUpperCase()}</strong>
                      </p>
                      
                      <button style={styles.quizButton} onClick={() => setShowQuiz(true)}>
                        Retake Assessment
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p style={styles.noAssessment}>No assessment taken yet</p>
                      <button style={styles.quizButton} onClick={() => setShowQuiz(true)}>
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
                        setShowQuiz(false);
                      }}
                    />
                  )}
            
            </div>

            {/* Progress Bar Section */}
          <div style={styles.section}>
            <h3>Progress Tracker</h3>
            
            {(() => {
              const { milestones, percentage } = calculateProgress();
              
              return (
                <>
                  {/* Circular Progress */}
                  <div style={styles.progressCircleContainer}>
                    <div style={styles.progressCircle}>
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
                      <div style={styles.percentageText}>{percentage}%</div>
                    </div>
                    <p style={styles.progressLabel}>Profile Completion</p>
                  </div>

                  {/* Milestones Checklist */}
                  <div style={styles.milestonesList}>
                    {milestones.map((milestone, index) => (
                      <div key={index} style={styles.milestoneItem}>
                        <span style={{
                          ...styles.checkmark,
                          backgroundColor: milestone.completed ? '#4CAF50' : '#e0e0e0',
                          color: milestone.completed ? 'white' : '#999'
                        }}>
                          {milestone.completed ? '✓' : '○'}
                        </span>
                        <span style={{
                          ...styles.milestoneName,
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
          <div style={styles.rightColumn}>
            {/* BMI Index Section */}
            {/* BMI Index Section */}
<div style={styles.section}>
  <h3>BMI Index</h3>
  
  {(() => {
    if (!patientData?.height || !patientData?.weight) {
      return <p style={styles.noData}>Height and weight not recorded</p>;
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
        <div style={styles.bmiValueContainer}>
          <div style={{...styles.bmiValue, color: color}}>
            {bmi}
          </div>
          <div style={styles.bmiUnit}>kg/m²</div>
        </div>

        {/* Category Badge */}
        <div style={{...styles.categoryBadge, backgroundColor: color}}>
          {category}
        </div>

        {/* Visual Gauge */}
        <div style={styles.gaugeContainer}>
          <div style={styles.gaugeBar}>
            <div style={styles.gaugeSegment1}></div>
            <div style={styles.gaugeSegment2}></div>
            <div style={styles.gaugeSegment3}></div>
            <div style={styles.gaugeSegment4}></div>
          </div>
          <div 
            style={{
              ...styles.gaugePointer,
              left: `${gaugePosition}%`
            }}
          >
            <div style={{...styles.pointerTriangle, borderBottomColor: color}}></div>
          </div>
        </div>

        {/* BMI Scale Labels */}
        <div style={styles.scaleLabels}>
          <span style={styles.scaleLabel}>15</span>
          <span style={styles.scaleLabel}>18.5</span>
          <span style={styles.scaleLabel}>25</span>
          <span style={styles.scaleLabel}>30</span>
          <span style={styles.scaleLabel}>40</span>
        </div>

        {/* Category Legend */}
        <div style={styles.legendContainer}>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: '#2196F3'}}></div>
            <span style={styles.legendText}>Underweight</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: '#4CAF50'}}></div>
            <span style={styles.legendText}>Normal</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: '#FF9800'}}></div>
            <span style={styles.legendText}>Overweight</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: '#F44336'}}></div>
            <span style={styles.legendText}>Obese</span>
          </div>
        </div>

        {/* Measurements */}
        <div style={styles.measurementsContainer}>
          <div style={styles.measurement}>
            <span style={styles.measurementLabel}>Height</span>
            <span style={styles.measurementValue}>{patientData.height} cm</span>
          </div>
          <div style={styles.measurement}>
            <span style={styles.measurementLabel}>Weight</span>
            <span style={styles.measurementValue}>{patientData.weight} kg</span>
          </div>
        </div>

        {/* Advice */}
        <div style={styles.adviceContainer}>
          <p style={styles.adviceText}>{advice}</p>
        </div>
      </>
    );
  })()}
</div>

            {/* Diet Charts Section */}
            <div style={styles.section}>
              <h3>Diet Charts</h3>
              {/* We'll fill this in Step 7 */}
              <p>Diet charts placeholder</p>
            </div>
          </div>
        </div>

        {/* Medical History Timeline - Full Width */}
        <div style={styles.timelineSection}>
          <h3>Medical History Timeline</h3>
          {/* We'll fill this in Step 8 */}
          <p>Timeline placeholder</p>
        </div>
      </>
    )}
  </div>
);
};




export default PatientProfile;