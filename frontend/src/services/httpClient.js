// HTTP Client utility with base configuration and error handling

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// HTTP client class
class HttpClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Get authorization token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Build headers with authentication if available
  buildHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    const token = this.getAuthToken();
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Handle response and errors
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    let data = null;

    // Parse response based on content type
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle successful responses
    if (response.ok) {
      return data;
    }

    // Handle error responses
    const errorMessage = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;
    throw new ApiError(errorMessage, response.status, data);
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: this.buildHeaders(options.headers),
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      // Handle network errors
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle fetch errors (network issues, etc.)
      throw new ApiError(
        error.message || 'Network error occurred',
        0,
        { originalError: error }
      );
    }
  }

  // HTTP method shortcuts
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data = null, options = {}) {
    const config = { ...options, method: 'POST' };
    
    if (data) {
      if (data instanceof FormData) {
        // Don't set Content-Type for FormData, let browser set it with boundary
        config.body = data;
        config.headers = this.buildHeaders({ ...options.headers, 'Content-Type': undefined });
      } else {
        config.body = JSON.stringify(data);
        config.headers = this.buildHeaders(options.headers);
      }
    }
    
    return this.request(endpoint, config);
  }

  async put(endpoint, data = null, options = {}) {
    const config = { ...options, method: 'PUT' };
    
    if (data) {
      if (data instanceof FormData) {
        config.body = data;
        config.headers = this.buildHeaders({ ...options.headers, 'Content-Type': undefined });
      } else {
        config.body = JSON.stringify(data);
        config.headers = this.buildHeaders(options.headers);
      }
    }
    
    return this.request(endpoint, config);
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // Set auth token (for login success)
  setAuthToken(token) {
    localStorage.setItem('token', token);
  }

  // Clear auth token (for logout)
  clearAuthToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

// Create and export a singleton instance
const httpClient = new HttpClient();

export default httpClient;