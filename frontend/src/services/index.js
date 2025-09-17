// Export API services
export { default as httpClient, ApiError } from './httpClient.js';
export { default as authService } from './authService.js';
export { default as messageService } from './messageService.js';

// Named exports for convenience
export {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} from './authService.js';

export {
  getContacts,
  getChatPartners,
  getMessages,
  sendMessage,
  sendTextMessage,
  sendImageMessage,
} from './messageService.js';