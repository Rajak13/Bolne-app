import httpClient from './httpClient.js';

// Message API service functions

/**
 * Get all contacts (all users in the system)
 * @returns {Promise<Array>} Array of all users with enhanced information
 */
export const getContacts = async () => {
  try {
    const response = await httpClient.get('/messages/contacts');
    
    // Enhance each user with additional information
    const enhancedUsers = response.map(user => ({
      ...user,
      lastSeen: user.updatedAt || user.createdAt,
      isOnline: false, // Default to offline, can be enhanced with real-time status
      lastMessage: null // No last message for all contacts view
    }));
    
    // Sort alphabetically by full name
    return enhancedUsers.sort((a, b) => 
      (a.fullName || '').localeCompare(b.fullName || '')
    );
  } catch (error) {
    console.error('Get contacts error:', error);
    throw error;
  }
};

/**
 * Get chat partners (users with existing chat history)
 * @returns {Promise<Array>} Array of users with chat history and last message info
 */
export const getChatPartners = async () => {
  try {
    const response = await httpClient.get('/messages/chats');
    
    // Enhance each user with last message information
    const enhancedUsers = await Promise.all(
      response.map(async (user) => {
        try {
          const messages = await getMessages(user._id);
          const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
          
          return {
            ...user,
            lastMessage,
            lastSeen: user.updatedAt || user.createdAt, // Use updatedAt as last seen
            isOnline: false // Default to offline, can be enhanced with real-time status
          };
        } catch (error) {
          console.error(`Error getting messages for user ${user._id}:`, error);
          return {
            ...user,
            lastMessage: null,
            lastSeen: user.updatedAt || user.createdAt,
            isOnline: false
          };
        }
      })
    );
    
    // Sort by last message timestamp (most recent first)
    return enhancedUsers.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt || a.lastSeen || 0;
      const bTime = b.lastMessage?.createdAt || b.lastSeen || 0;
      return new Date(bTime) - new Date(aTime);
    });
  } catch (error) {
    console.error('Get chat partners error:', error);
    throw error;
  }
};

/**
 * Get messages with a specific user
 * @param {string} userId - ID of the user to get messages with
 * @returns {Promise<Array>} Array of messages
 */
export const getMessages = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const response = await httpClient.get(`/messages/${userId}`);
    return response;
  } catch (error) {
    console.error('Get messages error:', error);
    throw error;
  }
};

/**
 * Send a message to a specific user
 * @param {string} userId - ID of the recipient user
 * @param {Object} messageData - Message data
 * @param {string} [messageData.text] - Text content of the message
 * @param {File} [messageData.image] - Image file to send
 * @returns {Promise<Object>} Sent message object
 */
export const sendMessage = async (userId, messageData) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    if (!messageData.text && !messageData.image) {
      throw new Error('Message must contain either text or image');
    }

    const payload = {};
    
    // Add text if provided
    if (messageData.text) {
      payload.text = messageData.text;
    }
    
    // Convert image file to base64 if provided
    if (messageData.image) {
      const base64Image = await convertFileToBase64(messageData.image);
      payload.image = base64Image;
    }

    const response = await httpClient.post(`/messages/send/${userId}`, payload);
    return response;
  } catch (error) {
    console.error('Send message error:', error);
    throw error;
  }
};

/**
 * Convert a File object to base64 string
 * @param {File} file - File to convert
 * @returns {Promise<string>} Base64 string
 */
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Send a text message to a specific user
 * @param {string} userId - ID of the recipient user
 * @param {string} text - Text content of the message
 * @returns {Promise<Object>} Sent message object
 */
export const sendTextMessage = async (userId, text) => {
  return sendMessage(userId, { text });
};

/**
 * Send an image message to a specific user
 * @param {string} userId - ID of the recipient user
 * @param {File} image - Image file to send
 * @param {string} [text] - Optional text to accompany the image
 * @returns {Promise<Object>} Sent message object
 */
export const sendImageMessage = async (userId, image, text = '') => {
  const messageData = { image };
  if (text) {
    messageData.text = text;
  }
  return sendMessage(userId, messageData);
};

/**
 * Get enhanced user information with last message and online status
 * @param {string} userId - ID of the user
 * @returns {Promise<Object>} Enhanced user object
 */
export const getUserInfo = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    // Get user's messages to determine last activity
    const messages = await getMessages(userId);
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    
    return {
      lastMessage,
      messageCount: messages.length,
      lastActivity: lastMessage?.createdAt || null
    };
  } catch (error) {
    console.error('Get user info error:', error);
    throw error;
  }
};

/**
 * Format last seen timestamp for display
 * @param {string|Date} timestamp - Timestamp to format
 * @returns {string} Formatted last seen string
 */
export const formatLastSeen = (timestamp) => {
  if (!timestamp) return 'Never';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) { // 24 hours
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ago`;
  } else if (diffInMinutes < 10080) { // 7 days
    const days = Math.floor(diffInMinutes / 1440);
    return `${days}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Export all message functions
export default {
  getContacts,
  getChatPartners,
  getMessages,
  sendMessage,
  sendTextMessage,
  sendImageMessage,
  getUserInfo,
  formatLastSeen,
};