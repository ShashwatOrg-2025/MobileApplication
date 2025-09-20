// ErrorMessage.js - Reusable error message component
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

/**
 * ErrorMessage Component
 * @param {string} message - Error message to display
 * @param {function} onRetry - Optional retry function
 * @param {string} retryText - Text for retry button
 * @param {boolean} visible - Whether the error message is visible
 * @param {string} type - Error type ('error' | 'warning' | 'info')
 */
const ErrorMessage = ({ 
  message, 
  onRetry, 
  retryText = 'Try Again',
  visible = true,
  type = 'error'
}) => {
  if (!visible || !message) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'warning':
        return '#FFF3CD';
      case 'info':
        return '#D1ECF1';
      default:
        return '#F8D7DA';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'warning':
        return '#FFEAA7';
      case 'info':
        return '#BEE5EB';
      default:
        return '#F5C6CB';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'warning':
        return '#856404';
      case 'info':
        return '#0C5460';
      default:
        return '#721C24';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❌';
    }
  };

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: getBackgroundColor(),
        borderColor: getBorderColor(),
      }
    ]}>
      <View style={styles.messageContainer}>
        <Text style={styles.icon}>{getIcon()}</Text>
        <Text style={[styles.message, { color: getTextColor() }]}>
          {message}
        </Text>
      </View>
      
      {onRetry && (
        <TouchableOpacity 
          style={[styles.retryButton, { borderColor: getTextColor() }]}
          onPress={onRetry}
        >
          <Text style={[styles.retryText, { color: getTextColor() }]}>
            {retryText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  message: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  retryButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 5,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ErrorMessage;