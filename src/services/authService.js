// authService.js - Authentication API service functions
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API URL for the backend
const API_BASE_URL = 'https://backend-095c.onrender.com/api';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token and log requests
apiClient.interceptors.request.use(
  async (config) => {
    console.log('🚀 Making HTTP request:');
    console.log('📍 URL:', config.baseURL + config.url);
    console.log('🔧 Method:', config.method?.toUpperCase());
    console.log('📋 Headers:', config.headers);
    console.log('📦 Data:', config.data ? JSON.stringify(config.data, null, 2) : 'No data');
    
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 Added auth token to request');
      } else {
        console.log('🔓 No auth token found');
      }
    } catch (error) {
      console.error('❌ Error getting auth token:', error);
    }
    
    console.log('✅ Final request config:', {
      url: config.baseURL + config.url,
      method: config.method,
      headers: config.headers,
      timeout: config.timeout
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors and log responses
apiClient.interceptors.response.use(
  (response) => {
    console.log('📨 HTTP response received:');
    console.log('📍 URL:', response.config.url);
    console.log('✅ Status:', response.status, response.statusText);
    console.log('📋 Headers:', response.headers);
    console.log('📦 Data:', response.data);
    
    return response;
  },
  async (error) => {
    console.error('❌ HTTP response error:');
    console.error('📍 URL:', error.config?.url);
    console.error('💥 Error message:', error.message);
    console.error('📊 Response status:', error.response?.status);
    console.error('📋 Response headers:', error.response?.headers);
    console.error('📦 Response data:', error.response?.data);
    console.error('🔧 Request config:', error.config);
    
    if (error.response?.status === 401) {
      console.log('🔒 401 Unauthorized - clearing stored tokens');
      // Token expired or invalid, clear storage and redirect to login
      await AsyncStorage.multiRemove(['authToken', 'userData']);
    }
    
    return Promise.reject(error);
  }
);

/**
 * User signup function
 * @param {Object} userData - User registration data
 * @param {string} userData.username - User's chosen username
 * @param {string} userData.email - User's email address
 * @param {string} userData.phoneNumber - User's phone number
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} API response with user data
 */
export const signUp = async (userData) => {
  try {
    console.log('📝 Starting signup process...');
    console.log('👤 Signup data:', { 
      username: userData.username,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      password: '***' // Don't log actual password
    });
    
    console.log('🌐 Making API request to:', `${API_BASE_URL}/auth/register`);
    
    const response = await apiClient.post('/auth/register', userData);
    
    console.log('✅ Signup API response status:', response.status);
    console.log('📥 Signup API response data:', response.data);
    
    const result = {
      success: true,
      data: response.data,
      message: response.data.message || 'Account created successfully',
    };
    
    console.log('🎉 Signup successful, returning result:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Signup error occurred:');
    console.error('Error object:', error);
    console.error('Error message:', error.message);
    console.error('Error response:', error.response);
    console.error('Error response data:', error.response?.data);
    console.error('Error response status:', error.response?.status);
    
    const errorResult = {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to create account',
      statusCode: error.response?.status,
      fullError: error.response?.data || error.message,
    };
    
    console.log('💥 Returning signup error result:', errorResult);
    return errorResult;
  }
};

/**
 * User login function
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User's email address
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} API response with auth token and user data
 */
export const login = async (credentials) => {
  try {
    console.log('🔐 Starting login process...');
    console.log('📧 Login credentials:', { 
      email: credentials.email, 
      password: '***' // Don't log actual password
    });
    
    // Log the full request details
    console.log('🌐 Making API request to:', `${API_BASE_URL}/auth/login`);
    console.log('📤 Request payload:', { 
      email: credentials.email, 
      password: '[HIDDEN]' 
    });
    
    const response = await apiClient.post('/auth/login', credentials);
    
    console.log('✅ Login API response status:', response.status);
    console.log('📥 Login API response data:', response.data);
    
    if (response.data && response.data.token) {
      console.log('🔑 Token received, storing in AsyncStorage...');
      
      // Store auth token - the API returns user data in the JWT token
      await AsyncStorage.setItem('authToken', response.data.token);
      console.log('💾 Token stored successfully');
      
      // Decode JWT token to extract user information
      let decodedUserData = {};
      try {
        // JWT tokens have 3 parts separated by dots: header.payload.signature
        const tokenParts = response.data.token.split('.');
        if (tokenParts.length === 3) {
          // Decode the payload (second part)
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('🔓 Decoded JWT payload:', payload);
          
          decodedUserData = {
            userId: payload.userId,
            email: payload.email,
            username: payload.username,
            phoneNumber: payload.phoneNumber,
            fullName: payload.fullName || payload.username,
          };
        }
      } catch (decodeError) {
        console.warn('⚠️ Failed to decode JWT token:', decodeError);
        // Fallback to basic user data
        decodedUserData = {
          email: credentials.email,
        };
      }
      
      // Store comprehensive user info
      const userData = {
        ...decodedUserData,
        email: credentials.email, // Ensure email is always available
      };
      
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('👤 User data stored successfully:', userData);
    } else {
      console.warn('⚠️ No token received in response:', response.data);
    }
    
    const result = {
      success: true,
      data: response.data,
      message: response.data.message || 'Login successful',
    };
    
    console.log('🎉 Login successful, returning result:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Login error occurred:');
    console.error('Error object:', error);
    console.error('Error message:', error.message);
    console.error('Error response:', error.response);
    console.error('Error response data:', error.response?.data);
    console.error('Error response status:', error.response?.status);
    console.error('Error response headers:', error.response?.headers);
    
    const errorResult = {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to login',
      statusCode: error.response?.status,
      fullError: error.response?.data || error.message,
    };
    
    console.log('💥 Returning error result:', errorResult);
    return errorResult;
  }
};

/**
 * User logout function
 * @description Clears local storage and notifies the server about logout
 * @returns {Promise<Object>} Logout result with success status and message
 */
export const logout = async () => {
  try {
    console.log('🚪 Starting logout process...');
    
    // Call the backend logout endpoint
    console.log('🔄 Calling server logout endpoint...');
    const response = await apiClient.post('/auth/logout');
    console.log('✅ Server logout successful:', response.data);
    
    // Clear local storage
    console.log('🗑️ Clearing stored authentication data...');
    await AsyncStorage.multiRemove(['authToken', 'userData']);
    console.log('✅ Authentication data cleared successfully');
    
    // Verify data was cleared
    const remainingToken = await AsyncStorage.getItem('authToken');
    const remainingUserData = await AsyncStorage.getItem('userData');
    
    if (!remainingToken && !remainingUserData) {
      console.log('🎉 Logout verification successful - all data cleared');
    } else {
      console.warn('⚠️ Logout verification warning - some data may remain:', {
        token: !!remainingToken,
        userData: !!remainingUserData
      });
    }
    
    const result = {
      success: true,
      message: response.data.message || 'Logged out successfully',
    };
    
    console.log('🎉 Logout completed successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Logout error occurred:', error);
    console.error('Error details:', error.message, error.stack);
    
    // Even if server request fails, try to clear local storage
    try {
      console.log('🔄 Attempting emergency cleanup...');
      await AsyncStorage.multiRemove(['authToken', 'userData']);
      console.log('✅ Emergency cleanup successful');
    } catch (cleanupError) {
      console.error('💥 Emergency cleanup failed:', cleanupError);
    }
    
    const result = {
      success: true, // Still return success since we want to proceed with logout
      message: 'Logged out successfully (with cleanup)',
      warning: 'Some cleanup operations may have failed',
    };
    
    console.log('⚠️ Logout completed with warnings:', result);
    return result;
  }
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} Authentication status
 */
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Get stored user data
 * @returns {Promise<Object|null>} User data or null
 */
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} API response
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/profile', profileData);
    
    // Update stored user data
    await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
    
    return {
      success: true,
      data: response.data,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update profile',
    };
  }
};

/**
 * Refresh authentication token
 * @returns {Promise<Object>} Token refresh result
 */
export const refreshToken = async () => {
  try {
    const response = await apiClient.post('/refresh-token');
    
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
    }
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return {
      success: false,
      error: 'Failed to refresh token',
    };
  }
};

/**
 * Test API connectivity
 * @returns {Promise<Object>} Test result
 */
export const testApiConnection = async () => {
  try {
    console.log('🧪 Testing API connection...');
    console.log('🌐 Testing URL:', `${API_BASE_URL}/auth/login`);
    
    // Try a simple request to see if the API is reachable
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('🧪 Test response status:', response.status);
    console.log('🧪 Test response headers:', response.headers);
    
    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    console.error('🧪 API connection test failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};