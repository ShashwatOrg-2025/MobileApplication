// alertService.js - Alert and report API service functions
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

/**
 * Submit a new alert report
 * @param {Object} reportData - Alert report data
 * @param {string} reportData.title - Report title
 * @param {string} reportData.description - Report description
 * @param {string} reportData.location - Report location
 * @param {string} reportData.category - Report category
 * @param {string} reportData.severity - Report severity level
 * @returns {Promise<Object>} API response
 */
export const submitReport = async (reportData) => {
  try {
    const response = await apiClient.post('/reports', {
      ...reportData,
      timestamp: new Date().toISOString(),
    });
    
    return {
      success: true,
      data: response.data,
      message: 'Report submitted successfully',
    };
  } catch (error) {
    console.error('Submit report error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to submit report',
    };
  }
};

/**
 * Get user's submitted reports
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of reports per page
 * @returns {Promise<Object>} API response with reports list
 */
export const getUserReports = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get('/reports/user', {
      params: { page, limit },
    });
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get user reports error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch reports',
    };
  }
};

/**
 * Get active alerts in a specific area
 * @param {Object} location - Location parameters
 * @param {number} location.latitude - Latitude coordinate
 * @param {number} location.longitude - Longitude coordinate
 * @param {number} location.radius - Search radius in kilometers
 * @returns {Promise<Object>} API response with alerts list
 */
export const getActiveAlerts = async (location = null) => {
  try {
    const params = location ? {
      lat: location.latitude,
      lng: location.longitude,
      radius: location.radius || 10,
    } : {};
    
    const response = await apiClient.get('/alerts/active', { params });
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get active alerts error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch alerts',
    };
  }
};

/**
 * Get all alerts for map display
 * @param {Object} bounds - Map bounds for filtering
 * @param {number} bounds.northEast.lat - Northeast latitude
 * @param {number} bounds.northEast.lng - Northeast longitude
 * @param {number} bounds.southWest.lat - Southwest latitude
 * @param {number} bounds.southWest.lng - Southwest longitude
 * @returns {Promise<Object>} API response with map alerts
 */
export const getMapAlerts = async (bounds = null) => {
  try {
    const params = bounds ? {
      neLat: bounds.northEast.lat,
      neLng: bounds.northEast.lng,
      swLat: bounds.southWest.lat,
      swLng: bounds.southWest.lng,
    } : {};
    
    const response = await apiClient.get('/alerts/map', { params });
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get map alerts error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch map alerts',
    };
  }
};

/**
 * Get detailed information about a specific alert
 * @param {string} alertId - Alert ID
 * @returns {Promise<Object>} API response with alert details
 */
export const getAlertDetails = async (alertId) => {
  try {
    const response = await apiClient.get(`/alerts/${alertId}`);
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get alert details error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch alert details',
    };
  }
};

/**
 * Update a user's report
 * @param {string} reportId - Report ID
 * @param {Object} updateData - Updated report data
 * @returns {Promise<Object>} API response
 */
export const updateReport = async (reportId, updateData) => {
  try {
    const response = await apiClient.put(`/reports/${reportId}`, updateData);
    
    return {
      success: true,
      data: response.data,
      message: 'Report updated successfully',
    };
  } catch (error) {
    console.error('Update report error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update report',
    };
  }
};

/**
 * Delete a user's report
 * @param {string} reportId - Report ID
 * @returns {Promise<Object>} API response
 */
export const deleteReport = async (reportId) => {
  try {
    const response = await apiClient.delete(`/reports/${reportId}`);
    
    return {
      success: true,
      message: 'Report deleted successfully',
    };
  } catch (error) {
    console.error('Delete report error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete report',
    };
  }
};

/**
 * Search alerts by keyword or category
 * @param {Object} searchParams - Search parameters
 * @param {string} searchParams.query - Search query
 * @param {string} searchParams.category - Alert category filter
 * @param {string} searchParams.severity - Severity level filter
 * @param {Object} searchParams.location - Location for proximity search
 * @returns {Promise<Object>} API response with search results
 */
export const searchAlerts = async (searchParams) => {
  try {
    const response = await apiClient.get('/alerts/search', {
      params: searchParams,
    });
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Search alerts error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to search alerts',
    };
  }
};

/**
 * Get alert statistics for dashboard
 * @returns {Promise<Object>} API response with statistics
 */
export const getAlertStatistics = async () => {
  try {
    const response = await apiClient.get('/alerts/statistics');
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get alert statistics error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch statistics',
    };
  }
};