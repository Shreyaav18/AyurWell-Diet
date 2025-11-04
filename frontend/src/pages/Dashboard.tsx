import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

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
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <h1 style={styles.navTitle}>
            <div style={styles.logoIcon}>🌿</div>
            Ayurwell
          </h1>
          <div style={styles.navRight}>
            <span style={styles.welcomeText}>
              {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={handleLogout}
              style={styles.logoutButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>Dashboard</h2>
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

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerGrid}>
            <div style={styles.footerSection}>
              <h3 style={styles.footerTitle}>
                <div style={styles.footerLogoIcon}>🌿</div>
                Ayurwell
              </h3>
              <p style={styles.footerText}>
                Professional Ayurvedic diet management system for healthcare practitioners.
              </p>
            </div>
            
            <div style={styles.footerSection}>
              <h4 style={styles.footerHeading}>Quick Links</h4>
              <ul style={styles.footerList}>
                <li><Link to="/patients" style={styles.footerLink}>Patients</Link></li>
                <li><Link to="/foods" style={styles.footerLink}>Food Database</Link></li>
                <li><button onClick={() => {}} style={styles.footerLink}>Documentation</button></li>
              </ul>
            </div>
            
            <div style={styles.footerSection}>
              <h4 style={styles.footerHeading}>Support</h4>
              <ul style={styles.footerList}>
                <li><button onClick={() => {}} style={styles.footerLink}>Help Center</button></li>
                <li><button onClick={() => {}} style={styles.footerLink}>Contact Us</button></li>
                <li><button onClick={() => {}} style={styles.footerLink}>Privacy Policy</button></li>
              </ul>
            </div>
          </div>
          
          <div style={styles.footerBottom}>
            <p style={styles.footerCopyright}>
              © {new Date().getFullYear()} Ayurwell. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
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

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  nav: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '1rem 1.5rem',
    position: 'sticky' as const,
    top: 0,
    zIndex: 50,
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
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#0f172a',
    letterSpacing: '-0.025em',
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    margin: 0,
  },
  logoIcon: {
    width: '2rem',
    height: '2rem',
    borderRadius: '0.5rem',
    backgroundColor: '#10b981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.125rem',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  welcomeText: {
    color: '#475569',
    fontWeight: '500',
    fontSize: '0.875rem',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    fontWeight: '500',
    fontSize: '0.875rem',
  },
  mainContent: {
    flex: 1,
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto',
    padding: '3rem 1.5rem',
    animation: 'fadeIn 0.4s ease-out',
  },
  header: {
    marginBottom: '2.5rem',
  },
  headerTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '0.5rem',
    margin: 0,
  },
  headerSubtitle: {
    fontSize: '1rem',
    color: '#64748b',
    fontWeight: '400',
    margin: '0.5rem 0 0 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
  },
  gridMd: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '1.75rem',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
    textDecoration: 'none',
    display: 'block',
    transition: 'all 0.2s ease',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  cardActive: {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.08)',
    borderColor: '#cbd5e1',
  },
  cardInactive: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  cardIcon: {
    width: '3rem',
    height: '3rem',
    borderRadius: '0.5rem',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem',
    fontSize: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#0f172a',
    margin: '0 0 0.5rem 0',
  },
  cardDescription: {
    color: '#64748b',
    margin: 0,
    fontSize: '0.875rem',
    lineHeight: '1.6',
  },
  comingSoonBadge: {
    position: 'absolute' as const,
    top: '1rem',
    right: '1rem',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '0.25rem 0.625rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    marginTop: 'auto',
  },
  footerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '3rem 1.5rem 1.5rem',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem',
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  footerTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem',
    margin: '0 0 0.75rem 0',
  },
  footerLogoIcon: {
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '0.375rem',
    backgroundColor: '#10b981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
  },
  footerText: {
    color: '#64748b',
    fontSize: '0.875rem',
    lineHeight: '1.6',
    margin: 0,
  },
  footerHeading: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    margin: '0 0 0.75rem 0',
  },
  footerList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  footerLink: {
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '0.875rem',
    transition: 'color 0.2s ease',
  },
  footerBottom: {
    paddingTop: '1.5rem',
    borderTop: '1px solid #e2e8f0',
  },
  footerCopyright: {
    textAlign: 'center' as const,
    color: '#94a3b8',
    fontSize: '0.875rem',
    margin: 0,
  },
};

export default Dashboard;