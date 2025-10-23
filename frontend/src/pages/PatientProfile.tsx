import React from "react";
import { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { patientService } from '../services/patientService';
import { useNavigate } from 'react-router-dom';

const PatientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patientData, setPatientData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
              {/* We'll fill this in Step 4 */}
              <p>Quiz section placeholder</p>
            </div>

            {/* Progress Bar Section */}
            <div style={styles.section}>
              <h3>Progress Tracker</h3>
              {/* We'll fill this in Step 5 */}
              <p>Progress bar placeholder</p>
            </div>
          </div>

          {/* Right Column */}
          <div style={styles.rightColumn}>
            {/* BMI Index Section */}
            <div style={styles.section}>
              <h3>BMI Index</h3>
              {/* We'll fill this in Step 6 */}
              <p>BMI calculator placeholder</p>
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

const styles = {
    mainContainer: {
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
        backgroundColor: '#f5f5f5',
    },
    loading: {
        textAlign: 'center' as const,
        padding: '40px',
        fontSize: '18px',
    },
    error: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '20px',
    },
    patientInfoSection: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px',
    },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px',
        marginBottom: '20px',
    },
    leftColumn: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '20px',
    },
    rightColumn: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '20px',
    },
    section: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    timelineSection: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
      headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      borderBottom: '2px solid #e0e0e0',
      paddingBottom: '15px',
    },
    patientName: {
      margin: 0,
      color: '#333',
      fontSize: '28px',
    },
    actionButtons: {
      display: 'flex',
      gap: '10px',
    },
    editButton: {
      padding: '8px 16px',
      backgroundColor: '#2196F3',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    backButton: {
      padding: '8px 16px',
      backgroundColor: '#757575',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '15px',
      marginBottom: '20px',
    },
    infoItem: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '5px',
    },
    label: {
      fontSize: '12px',
      color: '#666',
      fontWeight: 'bold',
      textTransform: 'uppercase' as const,
    },
    value: {
      fontSize: '16px',
      color: '#333',
    },
    doshaBadge: {
      backgroundColor: '#e3f2fd',
      padding: '4px 12px',
      borderRadius: '16px',
      display: 'inline-block',
      fontWeight: 'bold',
      textTransform: 'capitalize' as const,
      color: '#1976d2',
    },
    conditionsSection: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      marginTop: '20px',
    },
    conditionBlock: {
      backgroundColor: '#f9f9f9',
      padding: '15px',
      borderRadius: '6px',
    },
    subHeading: {
      margin: '0 0 10px 0',
      fontSize: '16px',
      color: '#555',
    },
    tagContainer: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '8px',
    },
    tag: {
      backgroundColor: '#e8f5e9',
      color: '#2e7d32',
      padding: '5px 12px',
      borderRadius: '12px',
      fontSize: '14px',
    },
    allergyTag: {
      backgroundColor: '#ffebee',
      color: '#c62828',
    },
    noData: {
      color: '#999',
      fontStyle: 'italic' as const,
      margin: 0,
    },
};


export default PatientProfile;