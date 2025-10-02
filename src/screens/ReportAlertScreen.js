import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

const ReportAlertScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hazardType, setHazardType] = useState('Fire');
  const [hazardDescription, setHazardDescription] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [location, setLocation] = useState(null);
  const [landmark, setLandmark] = useState('');
  const [photo, setPhoto] = useState(null);

  // 📍 Get Current Location + Reverse Geocoding
  const handleGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required.');
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    // reverse geocoding for landmark
    let geocode = await Location.reverseGeocodeAsync(loc.coords);
    if (geocode.length > 0) {
      let place = geocode[0];
      setLandmark(`${place.name || ''}, ${place.street || ''}, ${place.city || ''}`);
    }
  };

  // 📸 Take Photo from Camera
  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]); // save the photo object
    }
  };

  // 🚨 Submit
  const handleSubmit = () => {
    if (!title || !description || !hazardDescription || !location || !photo) {
      Alert.alert('Missing Data', 'Please fill in all fields and attach a photo.');
      return;
    }

    console.log({
      title,
      description,
      nearestLandmark: landmark,
      hazardType,
      hazardDescription,
      severity,
      latitude: location.latitude,
      longitude: location.longitude,
      photo,
    });

    Alert.alert('✅ Success', 'Alert Submitted Successfully!');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🚨 Report Emergency Alert</Text>

      {/* Title Input */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Alert Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter a title for the alert"
        />
      </View>

      {/* Description Input */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>General Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the emergency situation"
          multiline
        />
      </View>

      {/* Hazard Type */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Type of Hazard</Text>
        <View style={styles.rowWrap}>
          {['Fire', 'Flood', 'Accident', 'Earthquake', 'Other'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.optionButton,
                hazardType === type && styles.selectedOption,
              ]}
              onPress={() => setHazardType(type)}
            >
              <Text
                style={[
                  styles.optionText,
                  hazardType === type && styles.selectedOptionText,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Hazard Description */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description of Hazard</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={hazardDescription}
          onChangeText={setHazardDescription}
          placeholder="Provide details about the hazard"
          multiline
        />
      </View>

      {/* Severity */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Severity Level</Text>
        <View style={styles.rowWrap}>
          {['Low', 'Medium', 'High', 'Critical'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.optionButton,
                severity === level && styles.selectedOption,
              ]}
              onPress={() => setSeverity(level)}
            >
              <Text
                style={[
                  styles.optionText,
                  severity === level && styles.selectedOptionText,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Location */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Location</Text>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleGetLocation}
        >
          <Text style={styles.locationButtonText}>
            {location ? '📍 Update Location' : '📍 Get Current Location'}
          </Text>
        </TouchableOpacity>
        {location && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.locationText}>
              Lat: {location.latitude.toFixed(6)}, Long: {location.longitude.toFixed(6)}
            </Text>
            {landmark ? (
              <Text style={styles.locationText}>Nearest Landmark: {landmark}</Text>
            ) : null}
          </View>
        )}
      </View>

      {/* Photo */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Photo Evidence</Text>
        <TouchableOpacity
          style={styles.photoButton}
          onPress={handleTakePhoto}
        >
          <Text style={styles.photoButtonText}>
            {photo ? '📷 Change Image' : '📷 Upload Image'}
          </Text>
        </TouchableOpacity>

        {photo && (
          <View style={styles.photoPreviewContainer}>
            <Image
              source={{ uri: photo.uri }}
              style={styles.photoPreview}
            />
          </View>
        )}
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>🚀 Submit Alert</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#d32f2f',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 4,
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: '#d32f2f',
    borderColor: '#d32f2f',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fff',
  },
  locationButton: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  locationButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  locationText: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  photoButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  photoButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  photoPreviewContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  submitButton: {
    backgroundColor: '#d32f2f',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ReportAlertScreen;
