// ManageProfileScreen.js - User profile management and logout
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { logout, getUserData } from '../services/authService';

const ManageProfileScreen = ({ navigation }) => {
  // User profile state
  const [userProfile, setUserProfile] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    fullName: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...userProfile });
  const [loading, setLoading] = useState(true);

  // Load user data function
  const loadUserData = async () => {
    console.log('👤 Loading user data for profile screen...');
    setLoading(true);
    
    try {
      const userData = await getUserData();
      console.log('📥 Retrieved user data from storage:', userData);
      
      if (userData) {
        const profile = {
          username: userData.username || 'N/A',
          email: userData.email || 'N/A',
          phoneNumber: userData.phoneNumber || 'N/A',
          fullName: userData.fullName || userData.username || 'N/A',
        };
        
        console.log('✅ Processed profile data:', profile);
        setUserProfile(profile);
        setEditedProfile(profile);
      } else {
        console.warn('⚠️ No user data found in storage');
        // Set default empty profile
        const emptyProfile = {
          username: 'Not Available',
          email: 'Not Available',
          phoneNumber: 'Not Available',
          fullName: 'Not Available',
        };
        setUserProfile(emptyProfile);
        setEditedProfile(emptyProfile);
      }
    } catch (error) {
      console.error('❌ Error loading user data:', error);
      Alert.alert('Error', 'Failed to load profile data. Please try logging in again.');
    } finally {
      setLoading(false);
      console.log('🔄 Profile data loading completed');
    }
  };

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Reload data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('🎯 Profile screen focused, reloading user data...');
      loadUserData();
    }, [])
  );

  // Handle profile field updates
  const updateField = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save profile changes
  const handleSaveProfile = () => {
    // TODO: Implement API call to update profile
    setUserProfile(editedProfile);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  // Cancel profile editing
  const handleCancelEdit = () => {
    setEditedProfile({ ...userProfile });
    setIsEditing(false);
  };

  // Handle logout functionality
  const handleLogout = () => {
    console.log('🚪 Logout button pressed');
    
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('❌ Logout cancelled by user'),
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            console.log('✅ User confirmed logout, proceeding...');
            
            try {
              console.log('🔄 Calling logout service...');
              
              // Call logout service to clear stored data and notify server
              await logout();
              console.log('🎉 Logout successful, clearing navigation stack...');
              
              // Always navigate to Login screen even if server call fails
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
              
              console.log('🔄 Navigation reset to Login screen');
            } catch (error) {
              console.error('💥 Logout error occurred:', error);
              console.error('Error details:', error.message, error.stack);
              
              // Still navigate to login screen even if there's an error
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
              
              // Show error message after navigation
              setTimeout(() => {
                Alert.alert('Warning', 'Logged out with some errors. Please login again.');
              }, 500);
            }
          },
        },
      ]
    );
  };

  // Profile menu items
  const menuItems = [
    {
      id: 1,
      title: 'Notification Settings',
      icon: '🔔',
      onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon'),
    },
    {
      id: 2,
      title: 'Privacy Settings',
      icon: '🔒',
      onPress: () => Alert.alert('Coming Soon', 'Privacy settings will be available soon'),
    },
    {
      id: 3,
      title: 'Help & Support',
      icon: '❓',
      onPress: () => Alert.alert('Coming Soon', 'Help & support will be available soon'),
    },
    {
      id: 4,
      title: 'About',
      icon: 'ℹ️',
      onPress: () => Alert.alert('About', 'Alert Reporter App v1.0.0'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Profile</Text>
        <Text style={styles.subtitle}>Update your account information</Text>
      </View>

      {/* Profile Information Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? 'Cancel' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          {/* Full Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedProfile.fullName}
                onChangeText={(value) => updateField('fullName', value)}
                placeholder="Enter your full name"
              />
            ) : (
              <Text style={styles.fieldValue}>{userProfile.fullName}</Text>
            )}
          </View>

          {/* Username */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Username</Text>
            <Text style={styles.fieldValue}>{userProfile.username}</Text>
            {!isEditing && <Text style={styles.fieldNote}>Username cannot be changed</Text>}
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedProfile.email}
                onChangeText={(value) => updateField('email', value)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.fieldValue}>{userProfile.email}</Text>
            )}
          </View>

          {/* Phone Number */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedProfile.phoneNumber}
                onChangeText={(value) => updateField('phoneNumber', value)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                maxLength={10}
              />
            ) : (
              <Text style={styles.fieldValue}>{userProfile.phoneNumber}</Text>
            )}
          </View>

          {/* Save/Cancel Buttons */}
          {isEditing && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Menu Items Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Logout Section */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Logout</Text>
        </TouchableOpacity>
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
    backgroundColor: '#6C5CE7',
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
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  profileCard: {
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
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: '#666',
    paddingVertical: 8,
  },
  fieldNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  menuContainer: {
    backgroundColor: 'white',
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  menuArrow: {
    fontSize: 20,
    color: '#ccc',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ManageProfileScreen;