import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { setAuthData } from '../../utils/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      setAuthData(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Side - Introduction */}
      <div style={styles.leftSection}>
        <div style={styles.leftContent}>
          <div style={styles.logoContainer}>
            🌿
          </div>
          
          <h1 style={styles.mainHeading}>
            Ayurvedic Diet
            <br />
            <span style={styles.mainHeadingAccent}>Management System</span>
          </h1>
          
          <p style={styles.subtitle}>
            Empower your practice with ancient wisdom and modern technology. 
            Personalized diet plans based on Dosha analysis for optimal wellness.
          </p>
          
          <div style={styles.features}>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>🌿</div>
              <div>
                <h3 style={styles.featureTitle}>Dosha-Based Plans</h3>
                <p style={styles.featureDesc}>Customized diet recommendations for Vata, Pitta, and Kapha</p>
              </div>
            </div>
            
            <div style={styles.feature}>
              <div style={styles.featureIcon}>✨</div>
              <div>
                <h3 style={styles.featureTitle}>Patient Management</h3>
                <p style={styles.featureDesc}>Track progress and adjust plans with ease</p>
              </div>
            </div>
            
            <div style={styles.feature}>
              <div style={styles.featureIcon}>💚</div>
              <div>
                <h3 style={styles.featureTitle}>Holistic Wellness</h3>
                <p style={styles.featureDesc}>Integrate lifestyle and dietary guidance seamlessly</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={styles.rightSection}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.heading}>Welcome Back</h2>
            <p style={styles.subheading}>Sign in to manage your practice</p>
          </div>
          
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="you@example.com"
                required
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

            <div style={{ ...styles.formGroup, marginBottom: '24px' }}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="••••••••"
                required
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

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                backgroundColor: loading ? '#B6CEB4' : '#96A78D',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
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
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(150, 167, 141, 0.2)';
                }
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={styles.footer}>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              style={styles.link}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#7d8f78';
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#96A78D';
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'row' as const,
    backgroundColor: '#F0F0F0'
  },
  leftSection: {
    flex: 1,
    background: 'linear-gradient(135deg, #96A78D 0%, #B6CEB4 100%)',
    padding: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    overflow: 'hidden' as const
  },
  leftContent: {
    maxWidth: '560px',
    zIndex: 1,
    color: 'white'
  },
  logoContainer: {
    marginBottom: '32px',
    fontSize: '64px'
  },
  mainHeading: {
    fontSize: '48px',
    fontWeight: '700',
    lineHeight: '1.2',
    marginBottom: '24px',
    color: 'white',
    letterSpacing: '-0.02em'
  },
  mainHeadingAccent: {
    color: '#D9E9CF',
    fontWeight: '300'
  },
  subtitle: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: '#F0F0F0',
    marginBottom: '48px',
    opacity: 0.95
  },
  features: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px'
  },
  feature: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    transition: 'transform 0.3s ease',
    cursor: 'default'
  },
  featureIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: '24px',
    transition: 'all 0.3s ease'
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '4px',
    color: 'white',
    marginTop: '0'
  },
  featureDesc: {
    fontSize: '14px',
    color: '#F0F0F0',
    lineHeight: '1.5',
    opacity: 0.9,
    margin: '0'
  },
  rightSection: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    backgroundColor: '#F0F0F0'
  },
  card: {
    maxWidth: '480px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(150, 167, 141, 0.15)',
    padding: '48px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid #D9E9CF'
  },
  cardHeader: {
    marginBottom: '32px',
    textAlign: 'center' as const
  },
  heading: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '8px',
    letterSpacing: '-0.02em',
    marginTop: '0'
  },
  subheading: {
    fontSize: '15px',
    color: '#718096',
    fontWeight: '400',
    margin: '0'
  },
  error: {
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    color: '#991b1b',
    padding: '14px 16px',
    borderRadius: '12px',
    marginBottom: '24px',
    fontSize: '14px',
    transition: 'all 0.3s ease'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    color: '#4a5568',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #D9E9CF',
    borderRadius: '12px',
    outline: 'none',
    fontSize: '15px',
    boxSizing: 'border-box' as const,
    transition: 'all 0.3s ease',
    backgroundColor: '#fafafa'
  },
  button: {
    width: '100%',
    color: 'white',
    padding: '14px 0',
    borderRadius: '12px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 8px rgba(150, 167, 141, 0.2)',
    letterSpacing: '0.02em'
  },
  footer: {
    textAlign: 'center' as const,
    marginTop: '24px',
    color: '#718096',
    fontSize: '15px',
    margin: '24px 0 0 0'
  },
  link: {
    color: '#96A78D',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  }
};

export default Login;