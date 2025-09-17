import { useState, useRef, useCallback, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { LoadingSpinner } from '../common';
import './MessageInput.css';

const MessageInput = ({ 
  onSendMessage,
  disabled = false,
  placeholder = "Type a message...",
  className = '' 
}) => {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [sendError, setSendError] = useState(null);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  
  const { selectedUser, isSendingMessage, messageError, sendMessage, retryMessage, clearMessageError } = useChat();

  // Clear local error when message error from context changes
  useEffect(() => {
    if (!messageError) {
      setSendError(null);
      setLastFailedMessage(null);
    }
  }, [messageError]);

  // Handle text input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  // Handle image selection with validation and optimization
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Clear previous errors
    setSendError(null);
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setSendError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }
    
    // Validate file size (10MB absolute limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setSendError('Image size must be less than 10MB');
      return;
    }
    
    // Always compress images for better performance
    compressImage(file, (compressedFile) => {
      setSelectedImage(compressedFile);
      createImagePreview(compressedFile);
      
      // Log compression results for debugging
      const compressionRatio = ((file.size - compressedFile.size) / file.size * 100).toFixed(1);
      console.log(`Image compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB (${compressionRatio}% reduction)`);
    });
  };

  // Create image preview with error handling
  const createImagePreview = (file) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    
    reader.onerror = () => {
      setSendError('Failed to create image preview');
      setSelectedImage(null);
    };
    
    reader.readAsDataURL(file);
  };

  // Compress image with better quality control
  const compressImage = (file, callback) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions based on device and file size
      const isMobile = window.innerWidth <= 768;
      const maxWidth = isMobile ? 800 : 1200;
      const maxHeight = isMobile ? 600 : 900;
      let { width, height } = img;
      
      // Calculate scaling factor
      const scaleX = maxWidth / width;
      const scaleY = maxHeight / height;
      const scale = Math.min(scaleX, scaleY, 1); // Don't upscale
      
      const newWidth = Math.floor(width * scale);
      const newHeight = Math.floor(height * scale);
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Enable image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // Determine quality based on file size and device
      let quality = 0.8;
      if (file.size > 2 * 1024 * 1024) { // > 2MB
        quality = 0.6;
      } else if (file.size > 1 * 1024 * 1024) { // > 1MB
        quality = 0.7;
      }
      
      if (isMobile) {
        quality = Math.min(quality, 0.7); // Lower quality for mobile
      }
      
      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          callback(compressedFile);
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = () => {
      console.error('Failed to load image for compression');
      callback(file); // Return original file if compression fails
    };
    
    img.src = URL.createObjectURL(file);
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle send message
  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    
    if (!selectedUser) {
      setSendError('Please select a user to send message to');
      return;
    }
    
    const trimmedMessage = message.trim();
    
    // Check if we have content to send
    if (!trimmedMessage && !selectedImage) {
      return;
    }
    
    // Clear previous errors
    setSendError(null);
    clearMessageError();
    
    const messageData = {};
    
    if (trimmedMessage) {
      messageData.text = trimmedMessage;
    }
    
    if (selectedImage) {
      messageData.image = selectedImage;
    }
    
    // Store message data for potential retry
    setLastFailedMessage(messageData);
    
    try {
      // Send message using context
      await sendMessage(selectedUser._id, messageData);
      
      // Call optional callback
      if (onSendMessage) {
        onSendMessage(messageData);
      }
      
      // Clear form on success
      setMessage('');
      setSelectedImage(null);
      setImagePreview(null);
      setLastFailedMessage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      setSendError(error.message || 'Failed to send message');
    }
  }, [message, selectedImage, selectedUser, sendMessage, onSendMessage, clearMessageError]);

  // Handle key down (replaces deprecated onKeyPress)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Handle retry message
  const handleRetryMessage = useCallback(async () => {
    if (!lastFailedMessage || !selectedUser) return;
    
    setSendError(null);
    clearMessageError();
    
    try {
      await retryMessage(selectedUser._id, lastFailedMessage);
      
      // Clear form on success
      setMessage('');
      setSelectedImage(null);
      setImagePreview(null);
      setLastFailedMessage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      setSendError(error.message || 'Failed to retry message');
    }
  }, [lastFailedMessage, selectedUser, retryMessage, clearMessageError]);

  // Handle image button click
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const inputClasses = [
    'message-input',
    disabled ? 'message-input--disabled' : '',
    className
  ].filter(Boolean).join(' ');

  const canSend = (message.trim() || selectedImage) && !isSendingMessage && !disabled;

  return (
    <form className={inputClasses} onSubmit={handleSendMessage}>
      {/* Error display */}
      {(sendError || messageError) && (
        <div className="message-input__error">
          <span className="message-input__error-text">
            {sendError || messageError}
          </span>
          {lastFailedMessage && (
            <button
              type="button"
              className="message-input__retry-button"
              onClick={handleRetryMessage}
              disabled={isSendingMessage}
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Image preview */}
      {imagePreview && (
        <div className="message-input__image-preview">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="message-input__preview-image"
          />
          <button
            type="button"
            className="message-input__remove-image"
            onClick={handleRemoveImage}
            aria-label="Remove image"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="message-input__container">
        {/* Image upload button */}
        <button
          type="button"
          className="message-input__image-button"
          onClick={handleImageButtonClick}
          disabled={disabled || isSendingMessage}
          aria-label="Attach image"
        >
          📷
        </button>
        
        {/* Hidden file input with mobile camera support */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment" // Use rear camera on mobile
          onChange={handleImageSelect}
          className="message-input__file-input"
          disabled={disabled || isSendingMessage}
        />
        
        {/* Text input */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Select a user to start chatting' : placeholder}
          className="message-input__textarea"
          disabled={disabled || isSendingMessage}
          rows={1}
          maxLength={1000}
        />
        
        {/* Send button */}
        <button
          type="submit"
          className="message-input__send-button"
          disabled={!canSend}
          aria-label="Send message"
        >
          {isSendingMessage ? (
            <LoadingSpinner size="small" />
          ) : (
            <span className="message-input__send-icon">➤</span>
          )}
        </button>
      </div>
      
      {/* Character count */}
      {message.length > 800 && (
        <div className="message-input__char-count">
          {message.length}/1000
        </div>
      )}
    </form>
  );
};

export default MessageInput;