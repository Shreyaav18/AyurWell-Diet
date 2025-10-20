import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
  },
  nav: {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '1rem',
  },
  navContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  welcomeText: {
    color: '#374151',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  mainContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
  },
  gridMd: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none',
    display: 'block',
    transition: 'box-shadow 0.3s ease',
  },
  cardHover: {
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  cardTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#000',
  },
  cardDescription: {
    color: '#4b5563',
    margin: 0,
  },
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getGridStyle = () => {
    return windowWidth >= 768 ? styles.gridMd : styles.grid;
  };

  const getCardStyle = (cardName: string) => ({
    ...styles.card,
    ...(hoveredCard === cardName ? styles.cardHover : {}),
  });

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
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={styles.mainContent}>
        <div style={getGridStyle()}>
          <Link 
            to="/patients"
            style={getCardStyle('patients')}
            onMouseEnter={() => setHoveredCard('patients')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <h3 style={styles.cardTitle}>Patients</h3>
            <p style={styles.cardDescription}>Manage patient profiles</p>
          </Link>

          <Link 
            to="/foods"
            style={getCardStyle('foods')}
            onMouseEnter={() => setHoveredCard('foods')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <h3 style={styles.cardTitle}>Food Database</h3>
            <p style={styles.cardDescription}>Browse food items</p>
          </Link>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Diet Charts</h3>
            <p style={styles.cardDescription}>Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;