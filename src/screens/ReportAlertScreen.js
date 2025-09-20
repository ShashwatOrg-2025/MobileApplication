// ReportAlertScreen.js - Form to report new alerts/incidents
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const ReportAlertScreen = ({ navigation }) => {
  const [reportData, setReportData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    severity: '',
  });
  const [loading, setLoading] = useState(false);

  // Alert categories
  const categories = [
    'Traffic Accident',
    'Weather Emergency',
    'Security Incident',
    'Medical Emergency',
    'Fire Emergency',
    'Infrastructure Issue',
    'Other',
  ];

  // Severity levels
  const severityLevels = [
    { label: 'Low', value: 'low', color: '#4CAF50' },
    { label: 'Medium', value: 'medium', color: '#FFA500' },
    { label: 'High', value: 'high', color: '#FF6B6B' },
    { label: 'Critical', value: 'critical', color: '#D32F2F' },
  ];

  // Update form field values
  const updateField = (field, value) => {
    setReportData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate form data
  const validateForm = () => {
    const { title, description, location, category, severity } = reportData;

    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your report');
      return false;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description of the incident');
      return false;
    }

    if (!location.trim()) {
      Alert.alert('Error', 'Please specify the location');
      return false;
    }

    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return false;
    }

    if (!severity) {
      Alert.alert('Error', 'Please select a severity level');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmitReport = () => {
    if (!validateForm()) return;

    setLoading(true);
    // TODO: Implement API call to submit report
    console.log('Submitting report:', reportData);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        'Your report has been submitted successfully. Thank you for helping keep the community safe!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form and navigate back
              setReportData({
                title: '',
                description: '',
                location: '',
                category: '',
                severity: '',
              });
              navigation.goBack();
            },
          },
        ]
      );
    }, 1500);
  };

  // Render category selection buttons
  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        reportData.category === category && styles.categoryButtonSelected
      ]}
      onPress={() => updateField('category', category)}
    >
      <Text style={[
        styles.categoryButtonText,
        reportData.category === category && styles.categoryButtonTextSelected
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  // Render severity selection buttons
  const renderSeverityButton = (severity) => (
    <TouchableOpacity
      key={severity.value}
      style={[
        styles.severityButton,
        reportData.severity === severity.value && { backgroundColor: severity.color }
      ]}
      onPress={() => updateField('severity', severity.value)}
    >
      <Text style={[
        styles.severityButtonText,
        reportData.severity === severity.value && styles.severityButtonTextSelected
      ]}>
        {severity.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Report Alert</Text>
        <Text style={styles.subtitle}>Help keep your community safe</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          {/* Title Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={reportData.title}
              onChangeText={(value) => updateField('title', value)}
              placeholder="Brief title of the incident"
              maxLength={100}
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={reportData.description}
              onChangeText={(value) => updateField('description', value)}
              placeholder="Detailed description of what happened"
              multiline
              numberOfLines={4}
              maxLength={500}
            />
          </View>

          {/* Location Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              value={reportData.location}
              onChangeText={(value) => updateField('location', value)}
              placeholder="Street address or landmark"
            />
            <TouchableOpacity style={styles.locationButton}>
              <Text style={styles.locationButtonText}>📍 Use Current Location</Text>
            </TouchableOpacity>
          </View>

          {/* Category Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.categoryContainer}>
              {categories.map(renderCategoryButton)}
            </View>
          </View>

          {/* Severity Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Severity Level *</Text>
            <View style={styles.severityContainer}>
              {severityLevels.map(renderSeverityButton)}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmitReport}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Submitting Report...' : 'Submit Report'}
            </Text>
          </TouchableOpacity>

          {/* Emergency Notice */}
          <View style={styles.emergencyNotice}>
            <Text style={styles.emergencyTitle}>⚠️ Emergency?</Text>
            <Text style={styles.emergencyText}>
              For immediate life-threatening emergencies, call 911 directly instead of using this form.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF6B6B',
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
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  locationButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  locationButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  categoryButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#333',
  },
  categoryButtonTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 0.22,
    alignItems: 'center',
  },
  severityButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  severityButtonTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  emergencyNotice: {
    backgroundColor: '#FFF3CD',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFEAA7',
    marginTop: 20,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 5,
  },
  emergencyText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});

export default ReportAlertScreen;