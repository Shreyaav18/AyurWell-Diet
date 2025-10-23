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
      medicalConditions: '',  // comma-separated string
      allergies: '',           // comma-separated string
      height: 0,
      weight: 0,
      activityLevel: 'moderate',           // Default value
  
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = ():boolean => {
  // Check required fields
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
    
    
    // All validations passed
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    
    setError(''); // Clear any previous errors
    setLoading(true); // Show loading state
    if(!validateForm()) {
        setLoading(false);
        return;
      }
    
    try {
      // Prepare the data - convert strings to arrays for medicalConditions and allergies
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
      
      // Call the patient service to create patient
      await patientService.create(patientData);
      
      // On success, navigate to patient list or detail page
      navigate('/patients'); // or wherever you want to redirect
      
    } catch (err: any) {
      // Handle errors
      setError(err.response?.data?.message || 'Failed to create patient. Please try again.');
    } finally {
      setLoading(false); // Always set loading to false when done
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>New Patient</h2>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
        
            <label style={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={styles.input}
            />

            <label style={styles.label}>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
              style={styles.input}
            />
            
            <label style={styles.label}>Height (cm)</label>

            <input
              type="number" 
              name="height"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
              style={styles.input}
            />

            <label style={styles.label}>Weight (kg)</label>
            <input 
              type="number"
              name="weight"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
              style={styles.input}
            />

            <label style={styles.label}>Gender</label>
            <select
                name="gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                style={styles.input}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

            <label style={styles.label}>Dosha Type</label>
            <select 
              name="doshaType"
              value={formData.doshaType}
              onChange={(e) => setFormData({ ...formData, doshaType: e.target.value })}
              style={styles.input}
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
      

            <label style={styles.label}>Medical Conditions</label>
            <input
              type="text"
              name="medicalConditions"
              value={formData.medicalConditions}
              onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
              style={styles.input}
            />


            <label style={styles.label}>Allergies</label>
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              style={styles.input}
            /> 
            
          
            <label style={styles.label}>Activity Level</label>
            <select
              name="activityLevel"
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
              style={styles.input} 
            
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very-active">Very Active</option>
            </select>

          <button 
            type="submit" 
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Patient'}
          </button>

        </form>
    </div>
  </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center',
    height: '80%',
    backgroundColor: '#f0f2f5',
    borderRadius: '30px',
  },
  card: {
    backgroundColor: '#fff',  
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    width: '400px',
  },
  heading: {
    marginBottom: '20px',
    textAlign: 'center'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  }
  ,  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  error: {
    marginBottom: '16px',
    color: 'red',
    textAlign: 'center'
  }

}

export default Newpatient;