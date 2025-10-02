// src/utils/permissionsUtils.js

import * as Location from 'expo-location';
// Correctly import ONLY the function you need with curly braces {}
import { getCameraPermission } from './CameraUtils'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    await AsyncStorage.setItem('locationPermission', status);
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

export const requestCameraPermission = async () => {
  try {
    // Call the function directly, without the "CameraUtils." prefix
    const result = await getCameraPermission(); 
    if (result && result.status) {
      await AsyncStorage.setItem('cameraPermission', result.status);
    }
    return !!(result && result.granted);
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};

export const checkPermissions = async () => {
  const locationPermission = await requestLocationPermission();
  const cameraPermission = await requestCameraPermission();
  
  return {
    locationGranted: locationPermission,
    cameraGranted: cameraPermission
  };
};

export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission not granted');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    throw error;
  }
};

// New function to prompt for geo-tagged image upload
export const promptForGeoTaggedImage = () => {
  Alert.alert(
    'Upload Required',
    'Please upload a geo-tagged image only for this alert.',
    [{ text: 'OK', style: 'default' }]
  );
};