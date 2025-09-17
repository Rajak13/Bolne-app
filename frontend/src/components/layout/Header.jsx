import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { UserAvatar } from '../chat';
import { Button, ProfileModal } from '../common';
import './Header.css';

const Header = ({ 
  onToggleSidebar,
  isSidebarOpen = true,
  className = '' 
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { user: currentUser } = useAuth();
  const { selectedUser } = useChat();



  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleCloseProfile = () => {
    setShowProfileModal(false);
  };

  const headerClasses = [
    'header',
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      <header className={headerClasses}>
        <div className="header__left">
          {/* Mobile sidebar toggle */}
          <button
            className="header__sidebar-toggle"
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <span className="header__hamburger">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          {/* Selected user info */}
          {selectedUser ? (
            <div className="header__selected-user">
              <UserAvatar 
                user={selectedUser} 
                size="small" 
                showOnlineStatus={true}
              />
              <div className="header__user-info">
                <h2 className="header__user-name">
                  {selectedUser.fullName}
                </h2>
                <span className="header__user-status">
                  {selectedUser.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          ) : (
            <div className="header__app-title">
              <h1>Chat App</h1>
            </div>
          )}
        </div>

        <div className="header__right">
          {/* Current user profile */}
          <div className="header__current-user">
            <UserAvatar 
              user={currentUser} 
              size="small" 
              showOnlineStatus={false}
              onClick={handleProfileClick}
              className="header__profile-avatar"
            />
            <span className="header__current-user-name">
              {currentUser?.fullName}
            </span>
          </div>

          {/* Settings/Menu button */}
          <Button
            variant="ghost"
            size="small"
            onClick={handleProfileClick}
            className="header__menu-button"
            title="Profile & Settings"
          >
            ⚙️
          </Button>
        </div>
      </header>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={handleCloseProfile}
      />
    </>
  );
};

export default Header;