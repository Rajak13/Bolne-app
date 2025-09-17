import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal, Button, Input, LoadingSpinner } from './';
import './ProfileModal.css';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile, logout } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    profilePic: null
  });
  const [previewImage, setPreviewImage] = useState(user?.profilePic || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        profilePic: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      profilePic: null
    }));
    setPreviewImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const updateData = {
        fullName: formData.fullName.trim()
      };

      if (formData.profilePic) {
        updateData.profilePic = formData.profilePic;
      }

      await updateProfile(updateData);
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to logout');
    } finally {
      setIsLoading(false);
      setShowLogoutConfirm(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      // Reset form data when closing
      setFormData({
        fullName: user?.fullName || '',
        profilePic: null
      });
      setPreviewImage(user?.profilePic || '');
      setError('');
      setShowLogoutConfirm(false);
      onClose();
    }
  };

  const getInitials = (fullName) => {
    if (!fullName) return '?';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const hasChanges = formData.fullName !== user?.fullName || formData.profilePic !== null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="profile-modal">
      <div className="profile-modal__content">
        <div className="profile-modal__header">
          <h2 className="profile-modal__title">Profile Settings</h2>
          <button
            className="profile-modal__close"
            onClick={handleClose}
            disabled={isLoading}
            aria-label="Close profile modal"
          >
            ×
          </button>
        </div>

        {showLogoutConfirm ? (
          <div className="profile-modal__logout-confirm">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="profile-modal__logout-actions">
              <Button
                variant="secondary"
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleLogout}
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner size="small" /> : 'Logout'}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-modal__form">
            <div className="profile-modal__avatar-section">
              <div className="profile-modal__avatar-container">
                <div 
                  className="profile-modal__avatar"
                  onClick={handleImageClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleImageClick();
                    }
                  }}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="profile-modal__avatar-image"
                    />
                  ) : (
                    <div className="profile-modal__avatar-initials">
                      {getInitials(formData.fullName)}
                    </div>
                  )}
                  <div className="profile-modal__avatar-overlay">
                    <span>📷</span>
                  </div>
                </div>
                
                {previewImage && (
                  <button
                    type="button"
                    className="profile-modal__remove-image"
                    onClick={handleRemoveImage}
                    title="Remove image"
                  >
                    ×
                  </button>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="profile-modal__file-input"
                disabled={isLoading}
              />
              
              <p className="profile-modal__avatar-hint">
                Click to change profile picture
              </p>
            </div>

            <div className="profile-modal__field">
              <Input
                type="text"
                name="fullName"
                label="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="profile-modal__field">
              <Input
                type="email"
                label="Email"
                value={user?.email || ''}
                disabled={true}
                readOnly
              />
              <p className="profile-modal__field-hint">
                Email cannot be changed
              </p>
            </div>

            {error && (
              <div className="profile-modal__error">
                {error}
              </div>
            )}

            <div className="profile-modal__actions">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading || !hasChanges}
              >
                {isLoading ? <LoadingSpinner size="small" /> : 'Save Changes'}
              </Button>
            </div>

            <div className="profile-modal__logout-section">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowLogoutConfirm(true)}
                disabled={isLoading}
                className="profile-modal__logout-button"
              >
                Logout
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default ProfileModal;