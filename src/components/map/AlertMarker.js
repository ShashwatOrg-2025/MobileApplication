import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { getMarkerColor, getMarkerSize } from '../../utils/mapUtils';

const AlertMarker = ({ alert, zoom, isCluster, onPress }) => {
  const crs = alert.crs || alert.severityIndex / 10;
  const size = getMarkerSize(crs, zoom, isCluster);
  const color = getMarkerColor(crs);

  return (
    <Marker
      coordinate={{
        latitude: alert.LOCATION.latitude,
        longitude: alert.LOCATION.longitude,
      }}
      onPress={onPress}
    >
      <View style={[styles.marker, { width: size, height: size, backgroundColor: color }]}>
        {isCluster && (
          <Text style={styles.clusterText}>{alert.count}</Text>
        )}
      </View>
      <Callout>
        <View style={styles.callout}>
          <Text style={styles.title}>{alert.NAME}</Text>
          <Text style={styles.type}>{alert.TYPE}</Text>
          <Text>{alert.Description}</Text>
          <Text style={styles.info}>{alert.OTHERINFO}</Text>
        </View>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
  marker: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  clusterText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  callout: {
    width: 200,
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  type: {
    color: 'gray',
    marginBottom: 5,
  },
  info: {
    fontStyle: 'italic',
    marginTop: 5,
  },
});

export default AlertMarker;