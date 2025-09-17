import { useState, useEffect, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/routes';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import './SignupPage.css';

const SignupPage = () => {
  const { user, signup, isLoading, error, clearError } = useAuth();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePic: null,
    agreeToTerms: false,
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState('');

  // Redirect authenticated users to chat page
  if (user) {
    return <Navigate to={ROUTES.CHAT} replace />;
  }

  // Clear errors when component mounts or form data changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData, clearError]);

  // Calculate password strength
  useEffect(() => {
    const calculatePasswordStrength = (password) => {
      if (!password) return '';
      
      let score = 0;
      
      // Length check
      if (password.length >= 8) score += 1;
      if (password.length >= 12) score += 1;
      
      // Character variety checks
      if (/[a-z]/.test(password)) score += 1;
      if (/[A-Z]/.test(password)) score += 1;
      if (/[0-9]/.test(password)) score += 1;
      if (/[^A-Za-z0-9]/.test(password)) score += 1;
      
      if (score <= 2) return 'weak';
      if (score <= 4) return 'medium';
      return 'strong';
    };
    
    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    // Full name validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }
    
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
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms agreement validation
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
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

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelection(file);
  };

  const handleFileSelection = (file) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({
          ...prev,
          profilePic: 'Please select a valid image file',
        }));
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          profilePic: 'Image size must be less than 5MB',
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        profilePic: file,
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous error
      if (formErrors.profilePic) {
        setFormErrors(prev => ({
          ...prev,
          profilePic: '',
        }));
      }
    }
  };

  // Remove profile picture
  const removeProfilePicture = () => {
    setFormData(prev => ({
      ...prev,
      profilePic: null,
    }));
    setProfilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      await signup({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        profilePic: formData.profilePic,
      });
      
      // Signup successful - redirect will happen automatically via Navigate component
    } catch (err) {
      console.error('Signup failed:', err);
      // Error is handled by AuthContext and displayed via error state
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
      <div className={`signup-form-container ${isLoading ? 'signup-form-container--loading' : ''}`}>
        <div className="signup-header">
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">Join our chat community today!</p>
        </div>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="signup-form" noValidate>
          {/* Profile Picture Upload */}
          <div className="form-group">
            <div className="profile-upload">
              <div className="profile-preview">
                {profilePreview ? (
                  <>
                    <img src={profilePreview} alt="Profile preview" />
                    <button
                      type="button"
                      className="profile-remove-button"
                      onClick={removeProfilePicture}
                      aria-label="Remove profile picture"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <div className="profile-placeholder">👤</div>
                )}
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="small"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || isSubmitting}
                className="profile-upload-button"
              >
                {profilePreview ? 'Change Photo' : 'Add Photo'}
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="profile-upload-input"
                disabled={isLoading || isSubmitting}
              />
              
              <p className="upload-hint">
                Optional: Upload a profile picture (max 5MB)
              </p>
              
              {formErrors.profilePic && (
                <span className="input-error" role="alert">
                  {formErrors.profilePic}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <Input
              type="text"
              name="fullName"
              label="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              error={formErrors.fullName}
              required
              disabled={isLoading || isSubmitting}
              autoComplete="name"
            />
          </div>

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
              autoComplete="new-password"
            />
            
            {formData.password && (
              <div className="password-strength">
                <div className="password-strength-bar">
                  <div className={`password-strength-fill ${passwordStrength}`}></div>
                </div>
                <p className="password-strength-text">
                  Password strength: {passwordStrength || 'Enter a password'}
                </p>
              </div>
            )}
          </div>

          <div className="form-group">
            <Input
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={formErrors.confirmPassword}
              required
              disabled={isLoading || isSubmitting}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label className="terms-checkbox">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                disabled={isLoading || isSubmitting}
                required
              />
              I agree to the{' '}
              <Link to="#" className="terms-link">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="#" className="terms-link">
                Privacy Policy
              </Link>
            </label>
            
            {formErrors.agreeToTerms && (
              <span className="input-error" role="alert">
                {formErrors.agreeToTerms}
              </span>
            )}
          </div>

          <div className="form-actions">
            <Button
              type="submit"
              variant="primary"
              size="large"
              loading={isLoading || isSubmitting}
              disabled={isLoading || isSubmitting}
              className="signup-button"
            >
              {isLoading || isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>

        <div className="auth-links">
          <p>
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;