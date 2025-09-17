import { useMemo } from 'react';
import UserAvatar from './UserAvatar';
import { formatLastSeen } from '../../services/messageService';
import './UserListItem.css';

const UserListItem = ({ 
  user, 
  lastMessage = null, 
  unreadCount = 0, 
  isSelected = false, 
  onClick,
  showLastSeen = false,
  className = '' 
}) => {
  // Format last message timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes < 1 ? 'now' : `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? '1d' : `${diffInDays}d`;
    }
  };

  // Format last message preview
  const formatLastMessage = useMemo(() => {
    if (!lastMessage) {
      return showLastSeen && user?.lastSeen 
        ? `Last seen ${formatLastSeen(user.lastSeen)}`
        : 'No messages yet';
    }
    
    if (lastMessage.image && lastMessage.text) {
      return `📷 ${lastMessage.text}`;
    } else if (lastMessage.image) {
      return '📷 Photo';
    } else if (lastMessage.text) {
      return lastMessage.text.length > 50 
        ? `${lastMessage.text.substring(0, 50)}...` 
        : lastMessage.text;
    }
    
    return 'No messages yet';
  }, [lastMessage, showLastSeen, user?.lastSeen]);

  // Determine if user is online (can be enhanced with real-time data)
  const isUserOnline = useMemo(() => {
    if (user?.isOnline !== undefined) {
      return user.isOnline;
    }
    
    // Consider user online if last seen within 5 minutes
    if (user?.lastSeen) {
      const lastSeenTime = new Date(user.lastSeen);
      const now = new Date();
      const diffInMinutes = (now - lastSeenTime) / (1000 * 60);
      return diffInMinutes < 5;
    }
    
    return false;
  }, [user?.isOnline, user?.lastSeen]);

  const itemClasses = [
    'user-list-item',
    isSelected ? 'user-list-item--selected' : '',
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (onClick) {
      onClick(user);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div 
      className={itemClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Chat with ${user.fullName}`}
    >
      <div className="user-list-item__avatar">
        <UserAvatar 
          user={{...user, isOnline: isUserOnline}} 
          size="medium" 
          showOnlineStatus={true}
        />
      </div>
      
      <div className="user-list-item__content">
        <div className="user-list-item__header">
          <h3 className="user-list-item__name">
            {user.fullName || 'Unknown User'}
          </h3>
          
          {lastMessage && (
            <span className="user-list-item__timestamp">
              {formatTimestamp(lastMessage.createdAt)}
            </span>
          )}
        </div>
        
        <div className="user-list-item__footer">
          <p className={`user-list-item__last-message ${
            showLastSeen && !lastMessage ? 'user-list-item__last-message--last-seen' : ''
          }`}>
            {formatLastMessage}
          </p>
          
          {unreadCount > 0 && (
            <span className="user-list-item__unread-badge">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListItem;