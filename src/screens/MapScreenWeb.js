import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapScreenWeb = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Maps are currently not supported in web version.
        Please use the mobile app for full functionality.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

export default MapScreenWeb;