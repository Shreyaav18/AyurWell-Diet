import React, { useState, useEffect } from 'react';
import { patientService, Patient } from '../services/patientService';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

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

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.doshaType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Navigation Bar */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <Link to="/dashboard" style={styles.navBrand}>
            <div style={styles.logoIcon}>🌿</div>
            <span style={styles.brandText}>Ayurwell</span>
          </Link>
          
          <div style={styles.navLinks}>
            <Link 
              to="/dashboard" 
              style={styles.navLink}
              onMouseOver={(e) => e.currentTarget.style.color = '#96A78D'}
              onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
            >
              Dashboard
            </Link>
            <Link 
              to="/patients" 
              style={{...styles.navLink, ...styles.navLinkActive}}
            >
              Patients
            </Link>
            <Link 
              to="/foods" 
              style={styles.navLink}
              onMouseOver={(e) => e.currentTarget.style.color = '#96A78D'}
              onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
            >
              Foods
            </Link>
          </div>

          <div style={styles.navRight}>
            <span style={styles.userName}>{user?.firstName}</span>
            <button
              onClick={handleLogout}
              style={styles.logoutButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#7d8f78';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#96A78D';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.maxWidth}>
          {/* Header Section */}
          <div style={styles.headerSection}>
            <div style={styles.headerLeft}>
              <h1 style={styles.title}>Patient Management</h1>
              <p style={styles.subtitle}>View and manage all your patients in one place</p>
            </div>
            <Link 
              to="/patients/new"
              style={styles.addButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#7d8f78';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(150, 167, 141, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#96A78D';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(150, 167, 141, 0.2)';
              }}
            >
              <span style={styles.buttonIcon}>+</span>
              Add New Patient
            </Link>
          </div>

          {/* Stats Cards */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>

              <div style={styles.statContent}>
                <div style={styles.statValue}>{patients.length}</div>
                <div style={styles.statLabel}>Total Patients</div>
              </div>
            </div>
            <div style={styles.statCard}>
              
              <div style={styles.statContent}>
                <div style={styles.statValue}>
                  {patients.filter(p => p.doshaType.includes('vata')).length}
                </div>
                <div style={styles.statLabel}>Vata Patients</div>
              </div>
            </div>
            <div style={styles.statCard}>
              
              <div style={styles.statContent}>
                <div style={styles.statValue}>
                  {patients.filter(p => p.doshaType.includes('pitta')).length}
                </div>
                <div style={styles.statLabel}>Pitta Patients</div>
              </div>
            </div>
            <div style={styles.statCard}>
              
              <div style={styles.statContent}>
                <div style={styles.statValue}>
                  {patients.filter(p => p.doshaType.includes('kapha')).length}
                </div>
                <div style={styles.statLabel}>Kapha Patients</div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search patients by name or dosha type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#96A78D';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(150, 167, 141, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#D9E9CF';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <span style={styles.searchIcon}></span>
          </div>

          {/* Patients Table */}
          {loading ? (
            <div style={styles.loading}>
              <div style={styles.loadingSpinner}></div>
              <p>Loading patients...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}></div>
              <h3 style={styles.emptyTitle}>No patients found</h3>
              <p style={styles.emptyText}>
                {searchTerm ? 'Try adjusting your search' : 'Get started by adding your first patient'}
              </p>
            </div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead style={styles.thead}>
                  <tr>
                    <th style={styles.th}>Patient Name</th>
                    <th style={styles.th}>Age</th>
                    <th style={styles.th}>Gender</th>
                    <th style={styles.th}>Dosha Type</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody style={styles.tbody}>
                  {filteredPatients.map((patient) => (
                    <tr 
                      key={patient._id} 
                      style={styles.tr}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#F0F0F0';
                        e.currentTarget.style.transform = 'scale(1.002)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <td style={styles.td}>
                        <div style={styles.nameCell}>
                          <div style={styles.avatar}>
                            {patient.name.charAt(0).toUpperCase()}
                          </div>
                          <span style={styles.patientName}>{patient.name}</span>
                        </div>
                      </td>
                      <td style={styles.td}>{patient.age}</td>
                      <td style={styles.td}>
                        <span style={styles.genderBadge}>
                          {patient.gender}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.doshaBadge}>
                          {patient.doshaType}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <Link 
                          to={`/patients/${patient._id}`}
                          style={styles.viewButton}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#96A78D';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'translateX(4px)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(150, 167, 141, 0.1)';
                            e.currentTarget.style.color = '#96A78D';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          View Details →
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
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #F0F0F0, #D9E9CF)',
  },
  nav: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '2px solid #D9E9CF',
    padding: '1rem 1.5rem',
    position: 'sticky' as const,
    top: 0,
    zIndex: 50,
    boxShadow: '0 2px 8px rgba(150, 167, 141, 0.1)',
  },
  navContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '2.25rem',
    height: '2.25rem',
    borderRadius: '0.625rem',
    background: 'linear-gradient(135deg, #96A78D, #B6CEB4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    boxShadow: '0 2px 8px rgba(150, 167, 141, 0.3)',
  },
  brandText: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#2d3748',
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
    flex: 1,
  },
  navLink: {
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '0.9375rem',
    fontWeight: '500',
    transition: 'color 0.2s ease',
    padding: '0.5rem 0',
    borderBottom: '2px solid transparent',
  },
  navLinkActive: {
    color: '#96A78D',
    borderBottom: '2px solid #96A78D',
    fontWeight: '600',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    color: '#4a5568',
    fontSize: '0.9375rem',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#96A78D',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  mainContent: {
    padding: '2.5rem 1.5rem',
  },
  maxWidth: {
    maxWidth: '1280px',
    margin: '0 auto',
  },
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    gap: '2rem',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#64748b',
    margin: 0,
  },
  addButton: {
    backgroundColor: '#96A78D',
    color: 'white',
    padding: '0.875rem 1.5rem',
    borderRadius: '0.75rem',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontWeight: '600',
    fontSize: '0.9375rem',
    boxShadow: '0 4px 12px rgba(150, 167, 141, 0.2)',
    whiteSpace: 'nowrap' as const,
  },
  buttonIcon: {
    fontSize: '1.25rem',
    fontWeight: '700',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    border: '2px solid #D9E9CF',
    boxShadow: '0 4px 12px rgba(150, 167, 141, 0.08)',
    transition: 'all 0.3s ease',
  },
  statIcon: {
    fontSize: '2rem',
    width: '3rem',
    height: '3rem',
    borderRadius: '0.75rem',
    background: 'linear-gradient(135deg, #D9E9CF, #B6CEB4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '0.25rem',
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#64748b',
    fontWeight: '500',
  },
  searchContainer: {
    position: 'relative' as const,
    marginBottom: '2rem',
  },
  searchInput: {
    width: '100%',
    padding: '1rem 3rem 1rem 1.25rem',
    borderRadius: '0.75rem',
    border: '2px solid #D9E9CF',
    fontSize: '0.9375rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: 'white',
    boxSizing: 'border-box' as const,
  },
  searchIcon: {
    position: 'absolute' as const,
    right: '1.25rem',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.25rem',
    opacity: 0.5,
  },
  loading: {
    textAlign: 'center' as const,
    padding: '4rem 0',
    color: '#64748b',
  },
  loadingSpinner: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    border: '2px solid #D9E9CF',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 0.5rem 0',
  },
  emptyText: {
    fontSize: '1rem',
    color: '#64748b',
    margin: 0,
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(150, 167, 141, 0.1)',
    overflow: 'hidden',
    border: '2px solid #D9E9CF',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  thead: {
    backgroundColor: '#F0F0F0',
    borderBottom: '2px solid #D9E9CF',
  },
  th: {
    padding: '1.25rem 1.5rem',
    textAlign: 'left' as const,
    fontSize: '0.8125rem',
    fontWeight: '700',
    color: '#4a5568',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  tbody: {
    backgroundColor: 'white',
  },
  tr: {
    borderBottom: '1px solid #F0F0F0',
    transition: 'all 0.2s ease',
  },
  td: {
    padding: '1.25rem 1.5rem',
    color: '#334155',
    fontSize: '0.9375rem',
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  avatar: {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '0.5rem',
    background: 'linear-gradient(135deg, #96A78D, #B6CEB4)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1rem',
  },
  patientName: {
    fontWeight: '600',
    color: '#2d3748',
  },
  genderBadge: {
    padding: '0.375rem 0.875rem',
    borderRadius: '0.5rem',
    fontSize: '0.8125rem',
    fontWeight: '600',
    backgroundColor: 'rgba(150, 167, 141, 0.1)',
    color: '#96A78D',
    textTransform: 'capitalize' as const,
  },
  doshaBadge: {
    padding: '0.375rem 0.875rem',
    borderRadius: '0.5rem',
    fontSize: '0.8125rem',
    fontWeight: '600',
    backgroundColor: 'rgba(182, 206, 180, 0.2)',
    color: '#7d8f78',
    textTransform: 'capitalize' as const,
  },
  viewButton: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    backgroundColor: 'rgba(150, 167, 141, 0.1)',
    color: '#96A78D',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'inline-block',
  },
};

export default PatientList;