import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  FlatList,
  Pressable,
} from 'react-native';
import * as Location from 'expo-location';
import mapService from '../services/mapService';
import {
  getMarkerColor,
} from '../utils/mapUtils';
import MapScreenWeb from './MapScreenWeb';
import CustomBottomSheet from '../components/CustomBottomSheet';

// Only import MapView if not on web
let MapView, Marker;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
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

  // Refs
  const mapRef = useRef(null);

  useEffect(() => {
    const sampleAlerts = require('../../report.json');
    mapService.setAlerts(sampleAlerts);
    updateAlerts(currentZoom);
  }, []);

  const updateAlerts = (zoom) => {
    const groupedAlerts = mapService.getGroupedAlerts(zoom);
    setAlerts(groupedAlerts);
  };

  const onRegionChange = (newRegion) => {
    const zoom = Math.round(Math.log(360 / newRegion.latitudeDelta) / Math.LN2);

    if (zoom !== currentZoom) {
      setCurrentZoom(zoom);
      updateAlerts(zoom);
    }
    setRegion(newRegion);
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

  const handleAlertPress = (alert) => {
    if (!mapRef.current) return;

    // Animate map to alert location
    mapRef.current.animateToRegion(
      {
        latitude: alert.LOCATION.latitude,
        longitude: alert.LOCATION.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      1000 // duration
    );
  };

  const renderAlertItem = ({ item }) => (
    <Pressable onPress={() => handleAlertPress(item)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
      <View style={styles.alertCard}>
        <Text style={styles.alertTitle}>{item.NAME}</Text>
        <Text style={styles.alertDesc}>{item.Description}</Text>
        <View style={styles.alertFooter}>
          <Text style={styles.severity}>
            Severity: {item.severityIndex || 'N/A'}
          </Text>
          {item.isCluster && (
            <Text style={styles.clusterTag}>+{item.count} reports</Text>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
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

      {/* Reset Button */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => {
            if (!mapRef.current) return;
            mapRef.current.animateToRegion(
              {
                latitude: 20.5937,
                longitude: 78.9629,
                latitudeDelta: 20,
                longitudeDelta: 20,
              },
              1000
            );
          }}
        >
          <Text style={styles.controlButtonText}>🏠 Reset View</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Bottom Sheet for Alerts */}
      <CustomBottomSheet>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>📢 Active Alerts</Text>
          {alerts.length > 0 ? (
            <FlatList
              data={alerts}
              keyExtractor={(item, index) => `${item.NAME}-${index}`}
              renderItem={renderAlertItem}
              contentContainerStyle={{ paddingBottom: 50 }}
            />
          ) : (
            <Text style={styles.noDataText}>No alerts available</Text>
          )}
        </View>
      </CustomBottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#1E90FF',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  controlButton: {
    alignItems: 'center',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertDesc: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severity: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FF4500',
  },
  clusterTag: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E90FF',
  },
});

export default MapScreen;
