import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  backgroundPattern: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  },
  nav: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    padding: '1.25rem 1rem',
    position: 'relative' as const,
    zIndex: 10,
  },
  navContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '1rem',
  },
  navTitle: {
    fontSize: '1.875rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.025em',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoIcon: {
    width: '2rem',
    height: '2rem',
    borderRadius: '0.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
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
    fontWeight: '500',
    fontSize: '0.95rem',
  },
  logoutButton: {
    background: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)',
    color: 'white',
    padding: '0.625rem 1.25rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    fontSize: '0.875rem',
    boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.3)',
  },
  mainContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '3rem 1rem',
    position: 'relative' as const,
    zIndex: 1,
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '3rem',
    animation: 'fadeInDown 0.6s ease-out',
  },
  headerTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: 'white',
    marginBottom: '0.5rem',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  headerSubtitle: {
    fontSize: '1.125rem',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2rem',
    animation: 'fadeInUp 0.6s ease-out',
  },
  gridMd: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    animation: 'fadeInUp 0.6s ease-out',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    textDecoration: 'none',
    display: 'block',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden',
    border: '2px solid transparent',
  },
  cardActive: {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    borderColor: '#667eea',
  },
  cardInactive: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  cardIcon: {
    width: '3.5rem',
    height: '3.5rem',
    borderRadius: '0.75rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    fontSize: '1.75rem',
    boxShadow: '0 4px 6px -1px rgba(102, 126, 234, 0.3)',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '0.75rem',
    color: '#1f2937',
  },
  cardDescription: {
    color: '#6b7280',
    margin: 0,
    fontSize: '1rem',
    lineHeight: '1.6',
  },
  comingSoonBadge: {
    position: 'absolute' as const,
    top: '1rem',
    right: '1rem',
    backgroundColor: '#fbbf24',
    color: '#78350f',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
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

  const getCardStyle = (cardName: string, isActive: boolean = true) => ({
    ...styles.card,
    ...(hoveredCard === cardName && isActive ? styles.cardActive : {}),
    ...(!isActive ? styles.cardInactive : {}),
  });

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern} />
      
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <h1 style={styles.navTitle}>
            <div style={styles.logoIcon}>🌿</div>
            Ayurwell
          </h1>
          <div style={styles.navRight}>
            <span style={styles.welcomeText}>
              Welcome, {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={handleLogout}
              style={styles.logoutButton}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(220, 38, 38, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(220, 38, 38, 0.3)';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>Welcome to Your Dashboard</h2>
          <p style={styles.headerSubtitle}>Manage your Ayurvedic diet and wellness journey</p>
        </div>

        <div style={getGridStyle()}>
          <Link 
            to="/patients"
            style={getCardStyle('patients')}
            onMouseEnter={() => setHoveredCard('patients')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardIcon}>👥</div>
            <h3 style={styles.cardTitle}>Patients</h3>
            <p style={styles.cardDescription}>Manage and track patient profiles, health records, and treatment plans</p>
          </Link>

          <Link 
            to="/foods"
            style={getCardStyle('foods')}
            onMouseEnter={() => setHoveredCard('foods')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardIcon}>🥗</div>
            <h3 style={styles.cardTitle}>Food Database</h3>
            <p style={styles.cardDescription}>Browse comprehensive Ayurvedic food items and their properties</p>
          </Link>

          <div 
            style={getCardStyle('dietcharts', false)}
          >
            <span style={styles.comingSoonBadge}>Coming Soon</span>
            <div style={styles.cardIcon}>📋</div>
            <h3 style={styles.cardTitle}>Diet Charts</h3>
            <p style={styles.cardDescription}>Create personalized diet plans based on dosha and health conditions</p>
            
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 640px) {
            h1 {
              font-size: 1.5rem !important;
            }
            h2 {
              font-size: 1.875rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;