import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { ProfileModal } from '../common';
import './BottomBar.css';

const BottomBar = ({ 
  onToggleSidebar,
  isSidebarOpen = false,
  isCollapsed = false,
  onToggleCollapse,
  className = '' 
}) => {
  const { user } = useAuth();
  const { selectedUser } = useChat();
  const [activeTab, setActiveTab] = useState('chat');
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    
    switch (tab) {
      case 'contacts':
        onToggleSidebar?.();
        break;
      case 'chat':
        // Focus on chat area
        break;
      case 'profile':
        setShowProfileModal(true);
        break;
      default:
        break;
    }
  };

  const handleCloseProfile = () => {
    setShowProfileModal(false);
    setActiveTab('chat');
  };

  const bottomBarClasses = [
    'bottom-bar',
    isCollapsed ? 'bottom-bar--collapsed' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <nav className={bottomBarClasses}>
      {/* Collapse toggle button */}
      {!isCollapsed && (
        <button
          className="bottom-bar__collapse-toggle"
          onClick={onToggleCollapse}
          aria-label="Minimize bottom bar"
        >
          ⌄
        </button>
      )}
      
      {/* Expand button when collapsed */}
      {isCollapsed && (
        <button
          className="bottom-bar__expand-button"
          onClick={onToggleCollapse}
          aria-label="Show bottom bar"
        >
          ⌃
        </button>
      )}
      
      <div className="bottom-bar__container">
        {/* Contacts/Users Tab */}
        <button
          className={`bottom-bar__tab ${
            (activeTab === 'contacts' || isSidebarOpen) ? 'bottom-bar__tab--active' : ''
          }`}
          onClick={() => handleTabClick('contacts')}
          aria-label="View contacts"
        >
          <div className="bottom-bar__icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="9"
                cy="7"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m22 21-3-3m0 0a5.5 5.5 0 1 0-7.78-7.78 5.5 5.5 0 0 0 7.78 7.78Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="bottom-bar__label">Contacts</span>
        </button>

        {/* Chat Tab */}
        <button
          className={`bottom-bar__tab ${
            activeTab === 'chat' && !isSidebarOpen ? 'bottom-bar__tab--active' : ''
          }`}
          onClick={() => handleTabClick('chat')}
          aria-label="View chat"
        >
          <div className="bottom-bar__icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="bottom-bar__label">
            {selectedUser ? selectedUser.fullName : 'Chat'}
          </span>
        </button>

        {/* Profile Tab */}
        <button
          className={`bottom-bar__tab ${
            activeTab === 'profile' ? 'bottom-bar__tab--active' : ''
          }`}
          onClick={() => handleTabClick('profile')}
          aria-label="View profile"
        >
          <div className="bottom-bar__icon">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt={user.fullName}
                className="bottom-bar__avatar"
              />
            ) : (
              <div className="bottom-bar__avatar bottom-bar__avatar--fallback">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <span className="bottom-bar__label">Profile</span>
        </button>

        {/* Settings Tab */}
        <button
          className="bottom-bar__tab"
          onClick={() => handleTabClick('profile')}
          aria-label="Settings"
        >
          <div className="bottom-bar__icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <span className="bottom-bar__label">Settings</span>
        </button>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={handleCloseProfile}
      />
    </nav>
  );
};

export default BottomBar;