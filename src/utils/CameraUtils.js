// CameraUtils.js - Camera utility functions and constants
import { Camera } from 'expo-camera';

// Camera constants
export const CAMERA_TYPES = {
  BACK: 'back',
  FRONT: 'front'
};

export const FLASH_MODES = {
  ON: 'on',
  OFF: 'off',
  AUTO: 'auto',
  TORCH: 'torch'
};

// Permission functions
export const getCameraPermission = async () => {
  try {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return { granted: status === 'granted', status };
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return { granted: false, error };
  }
};

// Camera utility functions
export const takePictureAsync = async (cameraRef, options = {}) => {
  try {
    if (!cameraRef.current) {
      throw new Error('Camera reference is not available');
    }
    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.8,
      base64: false,
      exif: false,
      ...options
    });
    return { success: true, photo };
  } catch (error) {
    console.error('Error taking picture:', error);
    return { success: false, error };
  }
};

