// LoadingSpinner.js - Reusable loading spinner component
import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Modal,
} from 'react-native';

/**
 * LoadingSpinner Component
 * @param {boolean} visible - Whether the spinner is visible
 * @param {string} text - Optional loading text to display
 * @param {boolean} overlay - Whether to show as modal overlay
 * @param {string} size - Size of the spinner ('small' | 'large')
 * @param {string} color - Color of the spinner
 */
const LoadingSpinner = ({ 
  visible = false, 
  text = 'Loading...', 
  overlay = false,
  size = 'large',
  color = '#007AFF'
}) => {
  const SpinnerContent = () => (
    <View style={[styles.container, overlay && styles.overlayContainer]}>
      <View style={styles.spinnerWrapper}>
        <ActivityIndicator size={size} color={color} />
        {text && <Text style={styles.loadingText}>{text}</Text>}
      </View>
    </View>
  );

  if (overlay) {
    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={visible}
        statusBarTranslucent={true}
      >
        <SpinnerContent />
      </Modal>
    );
  }

  return visible ? <SpinnerContent /> : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlayContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  spinnerWrapper: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default LoadingSpinner;