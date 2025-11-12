import React, { useState} from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const API_URL = 'http://127.0.0.1:5000';


const LoginView = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate  = useNavigate()

const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setSuccessMessage('Login successful! Redirecting...');
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/')
          
        });
      } else {
        setErrors({ submit: data.error || 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '28rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            Welcome back
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Sign in to your Sports Hub account
          </p>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          {successMessage && (
            <div style={{ padding: '1rem', backgroundColor: '#d1fae5', borderRadius: '0.375rem', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#065f46' }}>{successMessage}</p>
            </div>
          )}

          {errors.submit && (
            <div style={{ padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '0.375rem', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#991b1b' }}>{errors.submit}</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Email <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                onKeyPress={handleKeyPress}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: `1px solid ${errors.email ? '#dc2626' : '#d1d5db'}`,
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Password <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                onKeyPress={handleKeyPress}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: `1px solid ${errors.password ? '#dc2626' : '#d1d5db'}`,
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
                placeholder="••••••••"
              />
              {errors.password && (
                <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.password}</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginTop: '0.5rem'
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Don't have an account?{' '}
                <NavLink to="/signup" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>
                  Sign up
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView