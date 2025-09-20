import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import * as Location from 'expo-location';
import mapService from '../services/mapService';
import { groupAlertsByGrid, getMarkerColor, getMarkerSize } from '../utils/mapUtils';
import MapScreenWeb from './MapScreenWeb';

// Only import MapView if not on web platform
let MapView, Marker, Polygon;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  Polygon = Maps.Polygon;
}

const MapScreen = () => {
  // Return web version if platform is web
  if (Platform.OS === 'web') {
    return <MapScreenWeb />;
  }

  const [region, setRegion] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 20,
    longitudeDelta: 20,
  });
  const [currentZoom, setCurrentZoom] = useState(5);
  const [alerts, setAlerts] = useState([]);
  const [gridKeys, setGridKeys] = useState([]);

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    const sampleAlerts = require('../../report.json');
    mapService.setAlerts(sampleAlerts);
    updateAlerts(currentZoom);
  }, []);

  const updateAlerts = (zoom) => {
    const groupedAlerts = mapService.getGroupedAlerts(zoom);
    setAlerts(groupedAlerts);

    if (zoom >= 10) {
      const groups = groupAlertsByGrid(mapService.getAllAlerts());
      setGridKeys(Object.keys(groups));
    } else {
      setGridKeys([]);
    }
  };

  const onRegionChange = (newRegion) => {
    // Calculate zoom level based on latitude delta
    const zoom = Math.round(Math.log(360 / newRegion.latitudeDelta) / Math.LN2);
    
    if (zoom !== currentZoom) {
      setCurrentZoom(zoom);
      updateAlerts(zoom);
    }
    
    setRegion(newRegion);
  };

  const handleMarkerPress = (alert) => {
    if (alert.isCluster && currentZoom < 10) {
      // Zoom into the cluster
      setRegion({
        latitude: alert.LOCATION.latitude,
        longitude: alert.LOCATION.longitude,
        latitudeDelta: region.latitudeDelta / 2,
        longitudeDelta: region.longitudeDelta / 2,
      });
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={onRegionChange}
      >
        {alerts.map((alert, index) => {
          const crs = alert.severityIndex / 10;
          return (
            <Marker
              key={`${alert.NAME}-${index}`}
              coordinate={{
                latitude: alert.LOCATION.latitude,
                longitude: alert.LOCATION.longitude,
              }}
              title={alert.NAME}
              description={alert.Description}
              pinColor={getMarkerColor(crs)}
            />
          );
        })}
      </MapView>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => {
            setRegion({
              latitude: 20.5937,
              longitude: 78.9629,
              latitudeDelta: 20,
              longitudeDelta: 20,
            });
          }}
        >
          <Text style={styles.controlButtonText}>🏠 Reset View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  controlButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.45,
    alignItems: 'center',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MapScreen;