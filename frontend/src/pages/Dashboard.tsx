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
              Welcome, {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={handleLogout}
              style={styles.logoutButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#7d8f78';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(125, 143, 120, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#96A78D';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
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
            <div style={styles.cardArrow}>→</div>
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
            <div style={styles.cardArrow}>→</div>
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
                <li>
                  <Link 
                    to="/patients" 
                    style={styles.footerLink}
                    onMouseOver={(e) => e.currentTarget.style.color = '#96A78D'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
                  >
                    Patients
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/foods" 
                    style={styles.footerLink}
                    onMouseOver={(e) => e.currentTarget.style.color = '#96A78D'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
                  >
                    Food Database
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => {}} 
                    style={styles.footerLinkButton}
                    onMouseOver={(e) => e.currentTarget.style.color = '#96A78D'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
                  >
                    Documentation
                  </button>
                </li>
              </ul>
            </div>
            
            <div style={styles.footerSection}>
              <h4 style={styles.footerHeading}>Support</h4>
              <ul style={styles.footerList}>
                <li>
                  <button 
                    onClick={() => {}} 
                    style={styles.footerLinkButton}
                    onMouseOver={(e) => e.currentTarget.style.color = '#96A78D'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {}} 
                    style={styles.footerLinkButton}
                    onMouseOver={(e) => e.currentTarget.style.color = '#96A78D'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {}} 
                    style={styles.footerLinkButton}
                    onMouseOver={(e) => e.currentTarget.style.color = '#96A78D'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
                  >
                    Privacy Policy
                  </button>
                </li>
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
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
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
    background: 'linear-gradient(to bottom, #F0F0F0, #D9E9CF)',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  nav: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #D9E9CF',
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
    flexWrap: 'wrap' as const,
    gap: '1rem',
  },
  navTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2d3748',
    letterSpacing: '-0.025em',
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    margin: 0,
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
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  welcomeText: {
    color: '#4a5568',
    fontWeight: '500',
    fontSize: '0.9375rem',
  },
  logoutButton: {
    backgroundColor: '#96A78D',
    color: 'white',
    padding: '0.625rem 1.25rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontWeight: '600',
    fontSize: '0.875rem',
    letterSpacing: '0.01em',
  },
  mainContent: {
    flex: 1,
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto',
    padding: '3rem 1.5rem',
    animation: 'fadeIn 0.6s ease-out',
  },
  header: {
    marginBottom: '3rem',
    textAlign: 'center' as const,
  },
  headerTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #96A78D, #7d8f78)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '0.5rem',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  headerSubtitle: {
    fontSize: '1.125rem',
    color: '#64748b',
    fontWeight: '400',
    margin: '0.75rem 0 0 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
  },
  gridMd: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '1rem',
    border: '2px solid #D9E9CF',
    textDecoration: 'none',
    display: 'block',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative' as const,
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(150, 167, 141, 0.08)',
  },
  cardActive: {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(150, 167, 141, 0.2)',
    borderColor: '#B6CEB4',
  },
  cardInactive: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  cardIcon: {
    width: '3.5rem',
    height: '3.5rem',
    borderRadius: '0.75rem',
    background: 'linear-gradient(135deg, #D9E9CF, #B6CEB4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    fontSize: '1.75rem',
    boxShadow: '0 4px 12px rgba(150, 167, 141, 0.15)',
    transition: 'all 0.3s ease',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '0.75rem',
    color: '#007686ff',
    margin: '0 0 0.75rem 0',
    letterSpacing: '-0.01ems',
  },
  cardDescription: {
    color: '#64748b',
    margin: 0,
    fontSize: '0.9375rem',
    lineHeight: '1.7',
  },
  cardArrow: {
    position: 'absolute' as const,
    bottom: '2rem',
    right: '2rem',
    fontSize: '1.5rem',
    color: '#96A78D',
    transition: 'all 0.3s ease',
    opacity: 0.6,
  },
  comingSoonBadge: {
    position: 'absolute' as const,
    top: '1.25rem',
    right: '1.25rem',
    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    color: '#92400e',
    padding: '0.375rem 0.875rem',
    borderRadius: '0.5rem',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
    boxShadow: '0 2px 8px rgba(146, 64, 14, 0.15)',
  },
  footer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderTop: '2px solid #D9E9CF',
    marginTop: 'auto',
  },
  footerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '3rem 1.5rem 1.5rem',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '2.5rem',
    marginBottom: '2.5rem',
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  footerTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#2d3748',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
    margin: '0 0 1rem 0',
  },
  footerLogoIcon: {
    width: '1.75rem',
    height: '1.75rem',
    borderRadius: '0.5rem',
    background: 'linear-gradient(135deg, #96A78D, #B6CEB4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    boxShadow: '0 2px 6px rgba(150, 167, 141, 0.25)',
  },
  footerText: {
    color: '#64748b',
    fontSize: '0.9375rem',
    lineHeight: '1.7',
    margin: 0,
  },
  footerHeading: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '1rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.075em',
    margin: '0 0 1rem 0',
  },
  footerList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.625rem',
  },
  footerLink: {
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '0.9375rem',
    transition: 'all 0.2s ease',
    display: 'inline-block',
  },
  footerLinkButton: {
    color: '#64748b',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: '0.9375rem',
    transition: 'all 0.2s ease',
    textAlign: 'left' as const,
  },
  footerBottom: {
    paddingTop: '2rem',
    borderTop: '1px solid #D9E9CF',
  },
  footerCopyright: {
    textAlign: 'center' as const,
    color: '#94a3b8',
    fontSize: '0.875rem',
    margin: 0,
  },
};

export default Dashboard;