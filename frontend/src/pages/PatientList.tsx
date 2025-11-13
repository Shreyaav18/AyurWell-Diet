import React, { useState, useEffect } from 'react';
import { patientService, Patient } from '../services/patientService';
import { Link } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
  },
  maxWidth: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2.5rem 2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: '-0.025em',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.75rem',
  },
  addButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.625rem 1.25rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontWeight: '500',
    fontSize: '0.875rem',
    boxShadow: '0 1px 3px rgba(37, 99, 235, 0.2)',
  },
  backButton: {
    backgroundColor: '#64748b',
    color: 'white',
    padding: '0.625rem 1.25rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontWeight: '500',
    fontSize: '0.875rem',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '4rem 0',
    fontSize: '1rem',
    color: '#64748b',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
  },
  table: {
    minWidth: '100%',
    borderCollapse: 'collapse' as const,
  },
  thead: {
    backgroundColor: '#f8fafc',
    borderBottom: '2px solid #e2e8f0',
  },
  th: {
    padding: '1rem 1.5rem',
    textAlign: 'left' as const,
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#475569',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  tbody: {
    backgroundColor: 'white',
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
    transition: 'all 0.2s ease',
  },
  td: {
    padding: '1.25rem 1.5rem',
    color: '#334155',
    fontSize: '0.9375rem',
  },
  viewLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
};

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await patientService.getAll();
      setPatients(response.data.patients);
    } catch (error) {
      console.error('Failed to fetch patients', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <div style={styles.header}>
          <h1 style={styles.title}>Patients</h1>
          <div style={styles.buttonGroup}>
            <Link 
              to="/patients/new"
              style={styles.addButton}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              Add Patient
            </Link>
            <Link 
              to="/dashboard"
              style={styles.backButton}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Age</th>
                  <th style={styles.th}>Gender</th>
                  <th style={styles.th}>Dosha</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody style={styles.tbody}>
                {patients.map((patient) => (
                  <tr 
                    key={patient._id} 
                    style={styles.tr}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <td style={styles.td}>{patient.name}</td>
                    <td style={styles.td}>{patient.age}</td>
                    <td style={styles.td}>{patient.gender}</td>
                    <td style={styles.td}>{patient.doshaType}</td>
                    <td style={styles.td}>
                      <Link 
                        to={`/patients/${patient._id}`}
                        style={styles.viewLink}
                        onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;