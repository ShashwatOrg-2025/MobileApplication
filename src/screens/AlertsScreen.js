// AlertsScreen.js - Display active emergency alerts
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

const AlertsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);

  // Sample alerts data (will be replaced with API data)
  const sampleAlerts = [
    {
      id: 1,
      title: 'Severe Weather Warning',
      description: 'Heavy rainfall expected in downtown area',
      severity: 'High',
      location: 'Downtown District',
      time: '2 hours ago',
      type: 'Weather',
    },
    {
      id: 2,
      title: 'Road Closure',
      description: 'Main Street closed due to construction',
      severity: 'Medium',
      location: 'Main Street',
      time: '4 hours ago',
      type: 'Traffic',
    },
    {
      id: 3,
      title: 'Community Event',
      description: 'Local festival causing increased foot traffic',
      severity: 'Low',
      location: 'City Center',
      time: '6 hours ago',
      type: 'Event',
    },
  ];

  // Get severity color based on alert severity
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High':
        return '#FF6B6B';
      case 'Medium':
        return '#FFA500';
      case 'Low':
        return '#4CAF50';
      default:
        return '#666';
    }
  };

  // Get type icon based on alert type
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Weather':
        return '🌧️';
      case 'Traffic':
        return '🚧';
      case 'Security':
        return '🚨';
      case 'Event':
        return '🎉';
      default:
        return '⚠️';
    }
  };

  // Handle refresh action
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Render individual alert card
  const renderAlertCard = (alert) => (
    <TouchableOpacity key={alert.id} style={styles.alertCard}>
      <View style={styles.alertHeader}>
        <View style={styles.alertTitleContainer}>
          <Text style={styles.alertIcon}>{getTypeIcon(alert.type)}</Text>
          <Text style={styles.alertTitle}>{alert.title}</Text>
        </View>
        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(alert.severity) }]}>
          <Text style={styles.severityText}>{alert.severity}</Text>
        </View>
      </View>
      
      <Text style={styles.alertDescription}>{alert.description}</Text>
      <Text style={styles.alertLocation}>📍 {alert.location}</Text>
      <Text style={styles.alertTime}>🕒 {alert.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Active Alerts</Text>
        <Text style={styles.subtitle}>Stay informed about local incidents</Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {sampleAlerts.length > 0 ? (
          <View style={styles.alertsContainer}>
            <Text style={styles.sectionTitle}>Current Alerts ({sampleAlerts.length})</Text>
            {sampleAlerts.map(renderAlertCard)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyTitle}>No Active Alerts</Text>
            <Text style={styles.emptySubtext}>
              All clear! No emergency alerts in your area right now.
            </Text>
          </View>
        )}

        {/* Alert Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsTitle}>Alert Preferences</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsButtonText}>🔔 Notification Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsButtonText}>📍 Location Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FFA07A',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  alertsContainer: {
    marginBottom: 30,
  },
  alertCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  alertDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    lineHeight: 22,
  },
  alertLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  alertTime: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  settingsSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingsButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  settingsButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default AlertsScreen;