// App.js - Main application entry point
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Alert } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { checkPermissions } from './src/utils/permissionsUtils';
import LoadingSpinner from './src/components/LoadingSpinner';

/**
 * Main App Component
 * Entry point for the Alert Reporter application
 */
export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setupPermissions = async () => {
      try {
        const permissions = await checkPermissions();
        
        if (!permissions.locationGranted || !permissions.cameraGranted) {
          Alert.alert(
            'Permission Required',
            'This app requires location and camera access to report alerts.',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Error setting up permissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    setupPermissions();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <AppNavigator />
    </View>
  );
}
