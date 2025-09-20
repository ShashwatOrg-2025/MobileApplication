// MyReportsScreen.js - Display user's submitted reports
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const MyReportsScreen = () => {
  // Sample reports data (will be replaced with API data)
  const sampleReports = [
    {
      id: 1,
      title: 'Road Accident',
      location: 'Main Street & 5th Ave',
      date: '2024-01-15',
      status: 'Under Review',
      type: 'Traffic',
    },
    {
      id: 2,
      title: 'Suspicious Activity',
      location: 'Central Park',
      date: '2024-01-14',
      status: 'Resolved',
      type: 'Security',
    },
  ];

  // Get status color based on report status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Under Review':
        return '#FFA500';
      case 'Resolved':
        return '#4CAF50';
      case 'Pending':
        return '#FF6B6B';
      default:
        return '#666';
    }
  };

  // Render individual report card
  const renderReportCard = (report) => (
    <TouchableOpacity key={report.id} style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportTitle}>{report.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
          <Text style={styles.statusText}>{report.status}</Text>
        </View>
      </View>
      
      <Text style={styles.reportLocation}>📍 {report.location}</Text>
      <Text style={styles.reportDate}>📅 {report.date}</Text>
      <Text style={styles.reportType}>🏷️ {report.type}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Reports</Text>
        <Text style={styles.subtitle}>Track your submitted alerts</Text>
      </View>

      <ScrollView style={styles.content}>
        {sampleReports.length > 0 ? (
          <View style={styles.reportsContainer}>
            {sampleReports.map(renderReportCard)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Reports Yet</Text>
            <Text style={styles.emptySubtext}>
              Your submitted reports will appear here
            </Text>
          </View>
        )}

        {/* Add New Report Button */}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Report New Alert</Text>
        </TouchableOpacity>
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
    backgroundColor: '#45B7D1',
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
  reportsContainer: {
    marginBottom: 20,
  },
  reportCard: {
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
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  reportLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  reportDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  reportType: {
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
  },
  addButton: {
    backgroundColor: '#45B7D1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default MyReportsScreen;