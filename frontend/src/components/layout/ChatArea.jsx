import { useEffect, useRef, useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { MessageBubble, MessageInput } from '../chat';
import { LoadingSpinner } from '../common';
import './ChatArea.css';

const ChatArea = ({ className = '' }) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  
  const {
    selectedUser,
    messages,
    isLoadingMessages,
    messageError,
    currentUser,
    startMessagePolling,
    stopMessagePolling,
    clearMessageError,
    loadMessages
  } = useChat();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start/stop message polling when user is selected
  useEffect(() => {
    if (selectedUser?._id) {
      // Start polling for new messages
      const intervalId = startMessagePolling(selectedUser._id, 3000);
      setPollingInterval(intervalId);
      
      return () => {
        if (intervalId) {
          stopMessagePolling(intervalId);
        }
      };
    } else {
      // Stop polling when no user is selected
      if (pollingInterval) {
        stopMessagePolling(pollingInterval);
        setPollingInterval(null);
      }
    }
  }, [selectedUser?._id, startMessagePolling, stopMessagePolling]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        stopMessagePolling(pollingInterval);
      }
    };
  }, [pollingInterval, stopMessagePolling]);

  const handleSendMessage = (messageData) => {
    // Message sending is handled by MessageInput component
    // This callback can be used for additional actions if needed
    console.log('Message sent:', messageData);
  };

  const handleRetryLoadMessages = () => {
    clearMessageError();
    if (selectedUser?._id) {
      // Manually trigger message reload
      loadMessages(selectedUser._id);
    }
  };

  const chatAreaClasses = [
    'chat-area',
    className
  ].filter(Boolean).join(' ');

  // No user selected state
  if (!selectedUser) {
    return (
      <div className={chatAreaClasses}>
        <div className="chat-area__empty-state">
          <div className="chat-area__empty-content">
            <div className="chat-area__empty-icon">💬</div>
            <h2>Welcome to Chat App</h2>
            <p>Select a user from the sidebar to start chatting</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={chatAreaClasses}>
      {/* Messages container */}
      <div 
        className="chat-area__messages"
        ref={messagesContainerRef}
      >
        {isLoadingMessages ? (
          <div className="chat-area__loading">
            <LoadingSpinner size="medium" />
            <span>Loading messages...</span>
          </div>
        ) : messageError ? (
          <div className="chat-area__error">
            <p>Failed to load messages</p>
            <button 
              className="chat-area__retry-button"
              onClick={handleRetryLoadMessages}
            >
              Try Again
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-area__no-messages">
            <div className="chat-area__no-messages-content">
              <div className="chat-area__no-messages-icon">👋</div>
              <h3>Start a conversation</h3>
              <p>Send a message to {selectedUser.fullName} to get started</p>
            </div>
          </div>
        ) : (
          <div className="chat-area__message-list">
            {messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={message.senderId === currentUser?._id}
                showTimestamp={true}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="chat-area__input">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={!selectedUser}
          placeholder={`Message ${selectedUser.fullName}...`}
        />
      </div>
    </div>
  );
};

export default ChatArea;