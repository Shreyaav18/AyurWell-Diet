import React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';

const Newpatient: React.FC = () => {
  const [formData, setFormData] = useState({
      name: '',
      age: 0,
      gender: '',
      doshaType: '',
      medicalConditions: '',
      allergies: '',
      height: 0,
      weight: 0,
      activityLevel: 'moderate',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = ():boolean => {
    if (!formData.name.trim()) {
      setError('Patient name is required');
      return false;
    }
    
    if (!formData.age || formData.age <= 0 || formData.age > 120) {
      setError('Please enter a valid age (1-120)');
      return false;
    }
    
    if (!formData.gender) {
      setError('Gender is required');
      return false;
    }
    
    if (!formData.doshaType) {
      setError('Dosha type is required');
      return false;
    }
    
    if (!formData.height || formData.height <= 0) {
      setError('Please enter a valid height');
      return false;
    }
    
    if (!formData.weight || formData.weight <= 0) {
      setError('Please enter a valid weight');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');
    setLoading(true);
    if(!validateForm()) {
        setLoading(false);
        return;
    }
    
    try {
      const patientData = {
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        doshaType: formData.doshaType,
        medicalConditions: formData.medicalConditions
          .split(',')
          .map(item => item.trim())
          .filter(item => item.length > 0),
        allergies: formData.allergies
          .split(',')
          .map(item => item.trim())
          .filter(item => item.length > 0),
        height: Number(formData.height),
        weight: Number(formData.weight),
        activityLevel: formData.activityLevel,
      };
      
      await patientService.create(patientData);
      navigate('/patients');
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.heading}>New Patient Registration</h2>
          <p style={styles.subheading}>Add a new patient to your Ayurvedic practice</p>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Personal Information</h3>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={styles.input}
                  placeholder="Enter patient name"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#96A78D';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(150, 167, 141, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#D9E9CF';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  style={styles.input}
                  placeholder="Enter age"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#96A78D';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(150, 167, 141, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#D9E9CF';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  style={styles.input}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#96A78D';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(150, 167, 141, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#D9E9CF';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Dosha Type *</label>
                <select 
                  name="doshaType"
                  value={formData.doshaType}
                  onChange={(e) => setFormData({ ...formData, doshaType: e.target.value })}
                  style={styles.input}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#96A78D';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(150, 167, 141, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#D9E9CF';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select Dosha Type</option>
                  <option value="vata">Vata</option>
                  <option value="pitta">Pitta</option>
                  <option value="kapha">Kapha</option>
                  <option value="vata-pitta">Vata-Pitta</option>
                  <option value="pitta-kapha">Pitta-Kapha</option>
                  <option value="vata-kapha">Vata-Kapha</option>
                  <option value="tridosha">Tridosha</option>
                </select>
              </div>
            </div>
          </div>

          {/* Physical Measurements Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Physical Measurements</h3>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Height (cm) *</label>
                <input
                  type="number" 
                  name="height"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                  style={styles.input}
                  placeholder="Enter height"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#96A78D';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(150, 167, 141, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#D9E9CF';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Weight (kg) *</label>
                <input 
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  style={styles.input}
                  placeholder="Enter weight"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#96A78D';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(150, 167, 141, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#D9E9CF';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Activity Level *</label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                  style={styles.input}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#96A78D';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(150, 167, 141, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#D9E9CF';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="very-active">Very Active</option>
                </select>
              </div>
            </div>
          </div>

          {/* Medical Information Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Medical Information</h3>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Medical Conditions</label>
                <input
                  type="text"
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                  style={styles.input}
                  placeholder="Comma-separated conditions"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#96A78D';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(150, 167, 141, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#D9E9CF';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Allergies</label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  style={styles.input}
                  placeholder="Comma-separated allergies"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#96A78D';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(150, 167, 141, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#D9E9CF';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          </div>

          <div style={styles.buttonContainer}>
            <button 
              type="submit" 
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#7d8f78';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(150, 167, 141, 0.3)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#96A78D';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(150, 167, 141, 0.2)';
                }
              }}
            >
              {loading ? 'Creating Patient...' : 'Create Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #F0F0F0, #D9E9CF)',
    padding: '3rem 1.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2.5rem',
    borderRadius: '1.25rem',
    boxShadow: '0 10px 40px rgba(150, 167, 141, 0.15)',
    maxWidth: '1200px',
    width: '100%',
    border: '2px solid #D9E9CF',
  },
  cardHeader: {
    marginBottom: '2.5rem',
    textAlign: 'center',
    paddingBottom: '1.5rem',
    borderBottom: '2px solid #D9E9CF',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '0.5rem',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  subheading: {
    fontSize: '1rem',
    color: '#64748b',
    margin: '0.5rem 0 0 0',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#96A78D',
    marginBottom: '1.25rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #D9E9CF',
    margin: '0 0 1.25rem 0',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.25rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    fontSize: '0.875rem',
    color: '#4a5568',
    letterSpacing: '0.01em',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.625rem',
    border: '2px solid #D9E9CF',
    boxSizing: 'border-box',
    fontSize: '0.9375rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#fafafa',
  },
  buttonContainer: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '1.5rem',
    borderTop: '1px solid #D9E9CF',
  },
  button: {
    minWidth: '250px',
    padding: '0.875rem 2rem',
    backgroundColor: '#96A78D',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    letterSpacing: '0.02em',
    boxShadow: '0 4px 12px rgba(150, 167, 141, 0.2)',
  },
  error: {
    marginBottom: '1.5rem',
    padding: '1rem 1.25rem',
    color: '#991b1b',
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    borderRadius: '0.75rem',
    textAlign: 'center',
    fontSize: '0.9375rem',
    fontWeight: '500',
  }
};

export default Newpatient;