import httpClient from './httpClient.js';

// Authentication API service functions

/**
 * User signup
 * @param {Object} userData - User registration data
 * @param {string} userData.fullName - User's full name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {File} [userData.profilePic] - User's profile picture file
 * @returns {Promise<Object>} Response with user data and token
 */
export const signup = async (userData) => {
  try {
    const payload = {
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
    };
    
    // Convert profile picture to base64 if provided
    if (userData.profilePic) {
      const base64ProfilePic = await convertFileToBase64(userData.profilePic);
      payload.profilePic = base64ProfilePic;
    }

    const response = await httpClient.post('/auth/signup', payload);
    
    // Store token and user data on successful signup
    if (response.token) {
      httpClient.setAuthToken(response.token);
      localStorage.setItem('user', JSON.stringify(response));
    }
    
    return response;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

/**
 * User login
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} Response with user data and token
 */
export const login = async (credentials) => {
  try {
    const response = await httpClient.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    
    // Store token and user data on successful login
    if (response.token) {
      httpClient.setAuthToken(response.token);
      localStorage.setItem('user', JSON.stringify(response));
    }
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * User logout
 * @returns {Promise<Object>} Logout response
 */
export const logout = async () => {
  try {
    const response = await httpClient.post('/auth/logout');
    
    // Clear stored auth data
    httpClient.clearAuthToken();
    
    return response;
  } catch (error) {
    // Even if logout fails on server, clear local auth data
    httpClient.clearAuthToken();
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Profile update data
 * @param {string} [profileData.fullName] - Updated full name
 * @param {File} [profileData.profilePic] - Updated profile picture file
 * @returns {Promise<Object>} Response with updated user data
 */
export const updateProfile = async (profileData) => {
  try {
    const payload = {};
    
    // Add fields that are being updated
    if (profileData.fullName) {
      payload.fullName = profileData.fullName;
    }
    
    // Convert profile picture to base64 if provided
    if (profileData.profilePic) {
      const base64ProfilePic = await convertFileToBase64(profileData.profilePic);
      payload.profilePic = base64ProfilePic;
    }

    const response = await httpClient.put('/auth/update-profile', payload);
    
    // Update stored user data
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

/**
 * Check authentication status
 * @returns {Promise<Object>} Current user data
 */
export const checkAuth = async () => {
  try {
    const response = await httpClient.get('/auth/check');
    
    // Update stored user data if different
    if (response) {
      localStorage.setItem('user', JSON.stringify(response));
    }
    
    return response;
  } catch (error) {
    // If auth check fails, clear stored auth data
    httpClient.clearAuthToken();
    console.error('Auth check error:', error);
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

// Export all auth functions
export default {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
};