import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Pencil, UserCircle2, BarChart2, ChevronRight, CheckCircle2, ChevronDown, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';

const AccountDetails = ({ navigation }) => {
  const { user, updateUserProfile, resetPassword, uploadProfilePicture } = useAuth();
  
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [gender, setGender] = useState(user?.gender || 'Male');
  const [height, setHeight] = useState(user?.height?.toString() || '');
  const [weight, setWeight] = useState(user?.weight?.toString() || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [tempPhotoURL, setTempPhotoURL] = useState(user?.photoURL);

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    console.log('Opening image library...');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      handleProfilePictureUpload(base64Image);
    }
  };

  const handleProfilePictureUpload = async (uri) => {
    if (!user?.uid) return;
    
    setIsUploading(true);
    try {
      const downloadURL = await uploadProfilePicture(user.uid, uri);
      setTempPhotoURL(downloadURL);
      Alert.alert("Success", "Profile picture updated successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to upload profile picture.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;
    try {
      await resetPassword(user.email);
      Alert.alert("Email Sent", "Please check your inbox for instructions to reset your password.");
    } catch (error) {
      Alert.alert("Error", "Could not send password reset email.");
      console.error(error);
    }
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    
    setIsSaving(true);
    try {
      await updateUserProfile(user.uid, {
        displayName: fullName,
        email: email,
        age,
        gender,
        height,
        weight
      });
      Alert.alert("Success", "Account details updated successfully.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarWrapper}>
              <Avatar uri={tempPhotoURL} size={100} />
              <TouchableOpacity 
                style={styles.editAvatarBtn} 
                onPress={pickImage}
                disabled={isUploading}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >

                {isUploading ? (
                   <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Camera size={14} color="#ffffff" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{fullName}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </View>

          {/* Account Settings Section */}
          <View style={styles.sectionHeader}>
            <UserCircle2 size={20} color="#0f172a" />
            <Text style={styles.sectionTitle}>Account Settings</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.inputLabel}>FULL NAME</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input} 
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input} 
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity style={styles.changePasswordBtn} onPress={handleChangePassword}>
              <Text style={styles.changePasswordText}>Change Password</Text>
              <ChevronRight size={16} color="#0284c7" />
            </TouchableOpacity>
          </View>

          {/* Personal Metrics Section */}
          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <BarChart2 size={20} color="#0f172a" />
            <Text style={styles.sectionTitle}>Personal Metrics</Text>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.inputLabel}>AGE</Text>
              <TextInput 
                style={styles.metricInput} 
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.inputLabel}>GENDER</Text>
              <TouchableOpacity style={styles.dropdownContainer} onPress={() => setGenderModalVisible(true)}>
                <Text style={styles.metricInput}>{gender}</Text>
                <ChevronDown size={16} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.inputLabel}>HEIGHT (CM)</Text>
              <TextInput 
                style={styles.metricInput} 
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.inputLabel}>WEIGHT (KG)</Text>
              <TextInput 
                style={styles.metricInput} 
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Save Changes Button */}
          <TouchableOpacity style={[styles.saveBtn, isSaving && { opacity: 0.7 }]} onPress={handleSave} disabled={isSaving}>
            <CheckCircle2 size={20} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.saveBtnText}>{isSaving ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>

          <Text style={styles.lastUpdatedText}>Last updated today at 09:41 AM</Text>
          
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Gender Selection Modal */}
      <Modal visible={genderModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setGenderModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            {['Male', 'Female', 'Other', 'Prefer not to say'].map((option, index, arr) => (
              <TouchableOpacity 
                key={option} 
                style={[styles.modalOption, index === arr.length - 1 && { borderBottomWidth: 0 }]} 
                onPress={() => { setGender(option); setGenderModalVisible(false); }}
              >
                <Text style={[styles.modalOptionText, gender === option && styles.modalOptionActive]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  headerTitle: {
    ...theme.typography.headlineMd,
    fontSize: 18,
    color: '#0f172a',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#22c55e',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    elevation: 5,
    zIndex: 10,
    shadowColor: '#000',

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userName: {
    ...theme.typography.headlineMd,
    fontSize: 22,
    color: '#0f172a',
    marginBottom: 4,
  },
  userEmail: {
    ...theme.typography.bodyMd,
    color: '#64748b',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...theme.typography.headlineMd,
    fontSize: 18,
    color: '#0f172a',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputLabel: {
    ...theme.typography.labelCaps,
    fontSize: 10,
    color: '#64748b',
    marginBottom: 8,
    letterSpacing: 1,
  },
  inputContainer: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  input: {
    ...theme.typography.bodyMd,
    fontSize: 16,
    color: '#0f172a',
    padding: 0,
  },
  changePasswordBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
  },
  changePasswordText: {
    ...theme.typography.labelBold,
    color: '#0284c7',
    fontSize: 14,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metricInput: {
    ...theme.typography.headlineMd,
    fontSize: 20,
    color: '#0f172a',
    padding: 0,
    marginTop: 4,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtn: {
    backgroundColor: '#22c55e',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 16,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    ...theme.typography.labelBold,
    color: '#ffffff',
    fontSize: 16,
  },
  lastUpdatedText: {
    ...theme.typography.bodySm,
    color: '#94a3b8',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  modalTitle: {
    ...theme.typography.headlineMd,
    fontSize: 18,
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalOptionText: {
    ...theme.typography.bodyMd,
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  modalOptionActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
});

export default AccountDetails;
