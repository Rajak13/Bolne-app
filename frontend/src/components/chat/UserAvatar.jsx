import { useState } from 'react';
import './UserAvatar.css';

const UserAvatar = ({ 
  user, 
  size = 'medium', 
  showOnlineStatus = true, 
  className = '',
  onClick 
}) => {
  const [imageError, setImageError] = useState(false);

  // Generate initials from user's full name
  const getInitials = (fullName) => {
    if (!fullName) return '?';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const avatarClasses = [
    'user-avatar',
    `user-avatar--${size}`,
    className,
    onClick ? 'user-avatar--clickable' : ''
  ].filter(Boolean).join(' ');

  const hasValidImage = user?.profilePic && !imageError;

  return (
    <div className={avatarClasses} onClick={onClick}>
      <div className="user-avatar__image-container">
        {hasValidImage ? (
          <img
            src={user.profilePic}
            alt={`${user.fullName || 'User'} avatar`}
            className="user-avatar__image"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          <div className="user-avatar__initials">
            {getInitials(user?.fullName)}
          </div>
        )}
      </div>
      
      {showOnlineStatus && (
        <div 
          className={`user-avatar__status ${
            user?.isOnline ? 'user-avatar__status--online' : 'user-avatar__status--offline'
          }`}
          title={user?.isOnline ? 'Online' : 'Offline'}
        />
      )}
    </div>
  );
};

export default UserAvatar;