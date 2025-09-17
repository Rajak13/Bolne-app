import { useState, useEffect, useMemo } from 'react';
import { useChat } from '../../context/ChatContext';
import { UserListItem } from '../chat';
import { Input, LoadingSpinner } from '../common';
import './Sidebar.css';

const Sidebar = ({ 
  isOpen = true,
  onClose,
  className = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'chats'
  
  const {
    users,
    chatPartners,
    selectedUser,
    isLoadingUsers,
    error,
    setSelectedUser,
    loadContacts,
    loadChatPartners,
    refreshUsers,
    clearError
  } = useChat();

  // Load users on component mount
  useEffect(() => {
    if (activeTab === 'all') {
      loadContacts();
    } else {
      loadChatPartners();
    }
  }, [activeTab, loadContacts, loadChatPartners]);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    const userList = activeTab === 'all' ? users : chatPartners;
    
    if (!searchQuery.trim()) {
      return userList;
    }
    
    return userList.filter(user =>
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, chatPartners, searchQuery, activeTab]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    // Close sidebar on mobile after selection
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery(''); // Clear search when switching tabs
  };

  const handleRetry = () => {
    clearError();
    if (activeTab === 'all') {
      loadContacts(true);
    } else {
      loadChatPartners(true);
    }
  };

  const handleRefresh = async () => {
    await refreshUsers(activeTab);
  };

  const sidebarClasses = [
    'sidebar',
    isOpen ? 'sidebar--open' : 'sidebar--closed',
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="sidebar__overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      <aside className={sidebarClasses}>
        <div className="sidebar__header">
          <div className="sidebar__tabs">
            <button
              className={`sidebar__tab ${activeTab === 'all' ? 'sidebar__tab--active' : ''}`}
              onClick={() => handleTabChange('all')}
            >
              All Users
            </button>
            <button
              className={`sidebar__tab ${activeTab === 'chats' ? 'sidebar__tab--active' : ''}`}
              onClick={() => handleTabChange('chats')}
            >
              Chats
            </button>
            <button
              className="sidebar__refresh-button"
              onClick={handleRefresh}
              disabled={isLoadingUsers}
              title="Refresh user list"
            >
              🔄
            </button>
          </div>
          
          <div className="sidebar__search">
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="sidebar__search-input"
            />
          </div>
        </div>

        <div className="sidebar__content">
          {isLoadingUsers ? (
            <div className="sidebar__loading">
              <LoadingSpinner size="medium" />
              <span>Loading users...</span>
            </div>
          ) : error ? (
            <div className="sidebar__error">
              <p>Failed to load users</p>
              <button 
                className="sidebar__retry-button"
                onClick={handleRetry}
              >
                Try Again
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="sidebar__empty">
              {searchQuery ? (
                <p>No users found matching "{searchQuery}"</p>
              ) : activeTab === 'chats' ? (
                <p>No chat history yet. Start a conversation!</p>
              ) : (
                <p>No users available</p>
              )}
            </div>
          ) : (
            <div className="sidebar__user-list">
              {filteredUsers.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  isSelected={selectedUser?._id === user._id}
                  onClick={handleUserSelect}
                  lastMessage={user.lastMessage}
                  unreadCount={user.unreadCount || 0}
                  showLastSeen={activeTab === 'all'}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          className="sidebar__close-button"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          ×
        </button>
      </aside>
    </>
  );
};

export default Sidebar;