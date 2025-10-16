import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { setAuthData } from '../../utils/auth';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'doctor',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.register(formData);
      setAuthData(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Register</h2>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
              minLength={6}
            />
          </div>

          <div style={{ ...styles.formGroup, marginBottom: '24px' }}>
            <label style={styles.label}>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="doctor">Doctor</option>
              <option value="dietitian">Dietitian</option>
              <option value="admin">Admin</option>
            </select>
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Login
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

export default Register;