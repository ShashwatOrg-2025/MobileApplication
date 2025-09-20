// DashboardScreen.js - Main dashboard after login
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  // Quick action cards data
  const quickActions = [
    {
      id: 1,
      title: 'Report Alert',
      description: 'Report a new emergency or incident',
      color: '#FF6B6B',
      onPress: () => navigation.navigate('ReportAlert'),
    },
    {
      id: 2,
      title: 'View Map',
      description: 'See alerts in your area',
      color: '#4ECDC4',
      onPress: () => navigation.navigate('Map'),
    },
    {
      id: 3,
      title: 'My Reports',
      description: 'View your submitted reports',
      color: '#45B7D1',
      onPress: () => navigation.navigate('MyReports'),
    },
    {
      id: 4,
      title: 'Active Alerts',
      description: 'Check current emergency alerts',
      color: '#FFA07A',
      onPress: () => navigation.navigate('Alerts'),
    },
  ];

  // Render quick action card
  const renderQuickAction = (action) => (
    <TouchableOpacity
      key={action.id}
      style={[styles.actionCard, { backgroundColor: action.color }]}
      onPress={action.onPress}
    >
      <Text style={styles.actionTitle}>{action.title}</Text>
      <Text style={styles.actionDescription}>{action.description}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.appTitle}>Alert Reporter</Text>
        <Text style={styles.subtitle}>Stay informed, stay safe</Text>
      </View>

      {/* Quick Actions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          {quickActions.map(renderQuickAction)}
        </View>
      </View>

      {/* Recent Activity Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityText}>No recent activity</Text>
          <Text style={styles.activitySubtext}>
            Your recent reports and alerts will appear here
          </Text>
        </View>
      </View>

      {/* Emergency Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <View style={styles.emergencyCard}>
          <Text style={styles.emergencyTitle}>Emergency Services</Text>
          <Text style={styles.emergencyNumber}>📞 911</Text>
          <Text style={styles.emergencySubtext}>
            For immediate life-threatening emergencies
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 50) / 2,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  actionDescription: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  activityCard: {
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
  activityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  activitySubtext: {
    fontSize: 14,
    color: '#666',
  },
  emergencyCard: {
    backgroundColor: '#FFE5E5',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFB3B3',
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 10,
  },
  emergencyNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 5,
  },
  emergencySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default DashboardScreen;