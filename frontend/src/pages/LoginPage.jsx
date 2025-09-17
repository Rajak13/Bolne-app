import { useState, useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/routes';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import './LoginPage.css';

const LoginPage = () => {
  const { user, login, isLoading, error, clearError } = useAuth();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear errors when component mounts or form data changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData, clearError]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      
      // Login successful - redirect will happen automatically via Navigate component
    } catch (err) {
      console.error('Login failed:', err);
      // Error is handled by AuthContext and displayed via error state
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect authenticated users to intended page or chat
  if (user) {
    const from = location.state?.from?.pathname || ROUTES.CHAT;
    return <Navigate to={from} replace />;
  }

  return (
    <div className="login-page">
      <div className={`login-form-container ${isLoading ? 'login-form-container--loading' : ''}`}>
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Please sign in to your account</p>
        </div>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-group">
            <Input
              type="email"
              name="email"
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
              required
              disabled={isLoading || isSubmitting}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <Input
              type="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              error={formErrors.password}
              required
              disabled={isLoading || isSubmitting}
              autoComplete="current-password"
            />
          </div>

          <div className="form-row">
            <label className="remember-me">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={isLoading || isSubmitting}
              />
              Remember me
            </label>
            
            <div className="forgot-password">
              <Link to="#" className="forgot-password-link">
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="submit"
              variant="primary"
              size="large"
              loading={isLoading || isSubmitting}
              disabled={isLoading || isSubmitting}
              className="login-button"
            >
              {isLoading || isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </div>
        </form>

        <div className="auth-links">
          <p>
            Don't have an account?{' '}
            <Link to={ROUTES.SIGNUP} className="auth-link">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;