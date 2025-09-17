import { useState, useMemo, useCallback } from 'react';
import { useChat } from '../../context/ChatContext';
import './MessageBubble.css';

const MessageBubble = ({ 
  message, 
  isOwn = false, 
  showTimestamp = true,
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { currentUser } = useChat();

  // Format timestamp
  const formattedTime = useMemo(() => {
    if (!message.createdAt) return '';
    
    const date = new Date(message.createdAt);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      // Show time for messages within 24 hours
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 24 * 7) {
      // Show day and time for messages within a week
      return date.toLocaleDateString([], { 
        weekday: 'short',
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      // Show full date for older messages
      return date.toLocaleDateString([], { 
        month: 'short',
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }
  }, [message.createdAt]);

  // Determine if message is from current user
  const isFromCurrentUser = useMemo(() => {
    return message.senderId === currentUser?._id;
  }, [message.senderId, currentUser?._id]);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  const handleImageClick = useCallback(() => {
    if (!imageError && message.image) {
      setShowFullImage(true);
    }
  }, [imageError, message.image]);

  const handleCloseFullImage = useCallback(() => {
    setShowFullImage(false);
  }, []);

  const handleRetryImage = useCallback(() => {
    if (retryCount < 3) {
      setImageError(false);
      setImageLoading(true);
      setRetryCount(prev => prev + 1);
      
      // Force image reload by adding timestamp
      const img = new Image();
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
      img.src = `${message.image}?retry=${retryCount + 1}`;
    }
  }, [retryCount, message.image, handleImageLoad, handleImageError]);

  const bubbleClasses = [
    'message-bubble',
    isFromCurrentUser ? 'message-bubble--own' : 'message-bubble--other',
    className
  ].filter(Boolean).join(' ');

  const hasImage = message.image && !imageError;
  const hasText = message.text && message.text.trim();

  return (
    <>
      <div className={bubbleClasses}>
        <div className="message-bubble__content">
          {hasImage && (
            <div className="message-bubble__image-container">
              {imageLoading && (
                <div className="message-bubble__image-loading">
                  <div className="message-bubble__image-spinner"></div>
                </div>
              )}
              
              <img
                src={message.image}
                alt="Shared image"
                className={`message-bubble__image ${imageLoading ? 'message-bubble__image--loading' : ''}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                onClick={handleImageClick}
                loading="lazy"
                style={{ display: imageError ? 'none' : 'block' }}
              />
              
              {imageError && (
                <div className="message-bubble__image-error">
                  <span>Failed to load image</span>
                  {retryCount < 3 && (
                    <button
                      className="message-bubble__retry-button"
                      onClick={handleRetryImage}
                      type="button"
                    >
                      Retry
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          
          {hasText && (
            <div className="message-bubble__text">
              {message.text}
            </div>
          )}
          
          {showTimestamp && (
            <div className="message-bubble__timestamp">
              {formattedTime}
            </div>
          )}
        </div>
      </div>

      {/* Full-screen image modal */}
      {showFullImage && hasImage && (
        <div 
          className="message-bubble__image-modal"
          onClick={handleCloseFullImage}
        >
          <div className="message-bubble__image-modal-content">
            <button
              className="message-bubble__image-modal-close"
              onClick={handleCloseFullImage}
              aria-label="Close image"
            >
              ×
            </button>
            <img
              src={message.image}
              alt="Full size shared image"
              className="message-bubble__image-modal-img"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MessageBubble;