import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <h1 style={styles.navTitle}>Ayurvedic Diet Management</h1>
          <div style={styles.navRight}>
            <span style={styles.welcomeText}>
              Welcome, {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={handleLogout}
              style={styles.logoutButton}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={styles.mainContent}>
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Patients</h3>
            <p style={styles.cardText}>Manage patient profiles</p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Diet Charts</h3>
            <p style={styles.cardText}>Create and manage diet plans</p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Food Database</h3>
            <p style={styles.cardText}>Browse food items</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb'
  },
  nav: {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    padding: '16px'
  },
  navContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navTitle: {
    fontSize: '20px',
    fontWeight: 'bold'
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  welcomeText: {
    color: '#374151'
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px'
  },
  mainContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '32px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  card: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px'
  },
  cardText: {
    color: '#4b5563'
  }
};

export default Dashboard;