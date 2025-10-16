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
      <div style={styles.card}>
        <h2 style={styles.heading}>Login</h2>
        
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={{ ...styles.formGroup, marginBottom: '24px' }}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              backgroundColor: loading ? '#9ca3af' : '#2563eb',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb'
  },
  card: {
    maxWidth: '448px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    padding: '32px'
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    marginBottom: '24px'
  },
  error: {
    backgroundColor: '#fee2e2',
    border: '1px solid #f87171',
    color: '#b91c1c',
    padding: '12px 16px',
    borderRadius: '4px',
    marginBottom: '16px'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    color: '#374151',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    outline: 'none',
    fontSize: '16px',
    boxSizing: 'border-box' as const
  },
  button: {
    width: '100%',
    color: 'white',
    padding: '8px 0',
    borderRadius: '4px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  footer: {
    textAlign: 'center' as const,
    marginTop: '16px',
    color: '#4b5563'
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none'
  }
};

export default Login;