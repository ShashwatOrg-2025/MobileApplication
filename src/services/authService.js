// authService.js - Authentication API service functions
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API URL - Replace with your actual API endpoint
const API_BASE_URL = 'https://your-api-endpoint.com/api';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
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
    const response = await apiClient.post('/signup', userData);
    return {
      success: true,
      data: response.data,
      message: 'Account created successfully',
    };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create account',
    };
  }
};

/**
 * User login function
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.username - User's username
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} API response with auth token and user data
 */
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/login', credentials);
    
    if (response.data.token) {
      // Store auth token and user data
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    
    return {
      success: true,
      data: response.data,
      message: 'Login successful',
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to login',
    };
  }
};

/**
 * User logout function
 * Clears local storage and optionally notifies server
 * @returns {Promise<Object>} Logout result
 */
export const logout = async () => {
  try {
    // Optional: Notify server about logout
    // await apiClient.post('/logout');
    
    // Clear local storage
    await AsyncStorage.multiRemove(['authToken', 'userData']);
    
    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    console.error('Logout error:', error);
    // Even if server request fails, clear local storage
    await AsyncStorage.multiRemove(['authToken', 'userData']);
    return {
      success: true,
      message: 'Logged out successfully',
    };
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