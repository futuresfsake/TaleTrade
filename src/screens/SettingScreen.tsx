import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  SafeAreaView, Alert, ScrollView, KeyboardAvoidingView, 
  Platform, StatusBar as RNStatusBar, Image,
  Linking, PermissionsAndroid 
} from 'react-native';
import { ChevronLeft, User, Lock, Trash2, Save, Camera, CheckCircle } from 'lucide-react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { updateUserInDb } from '../services/userService';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  primaryBlue: '#4A68BE',
  softPurple: '#7E6FB0',
  creamBg: '#F5E9CF',
  white: '#FFFFFF',
  danger: '#FF6B6B',
  inputBg: '#F9F7F2',
  success: '#4CAF50'
};

const SettingScreen = ({ navigation }: any) => {
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null); // To store un-saved selection

  useEffect(() => {
    loadStoredImage();
  }, []);

  const loadStoredImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('user_profile_image');
      if (savedImage) {
        setProfileImage(savedImage);
        setTempImage(savedImage);
      }
    } catch (e) {
      console.error("Failed to load image", e);
    }
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'ios') return true;
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        return false;
      }
    }
    return false;
  };

  const handlePickImage = async () => {
    const hasPermission = await requestGalleryPermission();

    if (!hasPermission) {
      Alert.alert(
        "Permission Denied",
        "Enable gallery access in settings to change your photo.",
        [{ text: "Cancel", style: "cancel" }, { text: "Open Settings", onPress: () => Linking.openSettings() }]
      );
      return;
    }

    try {
      launchImageLibrary({ 
        mediaType: 'photo', 
        quality: 0.7,
        selectionLimit: 1 
      }, async (response) => {
        if (response.didCancel) return;
        if (response.assets && response.assets[0].uri) {
          setTempImage(response.assets[0].uri); // Preview the image first
        }
      });
    } catch (error) {
      Alert.alert("App Error", "Image Picker module not found.");
    }
  };

  // NEW: Save Image Function
  const handleSavePhoto = async () => {
    try {
      if (tempImage) {
        await AsyncStorage.setItem('user_profile_image', tempImage);
        setProfileImage(tempImage);
        Alert.alert("Success! ✨", "Your profile picture has been updated.");
      }
    } catch (error) {
      Alert.alert("Error ❌", "Failed to save your profile picture. Please try again.");
    }
  };

  const handleUpdateProfile = async () => {
    const user = auth().currentUser;
    if (!user) return;
    const trimmedName = newName.trim();
    if (trimmedName.length < 3) {
      Alert.alert("Too Short", "Username must be at least 3 characters long! ✨");
      return;
    }
    try {
      await user.updateProfile({ displayName: trimmedName });
      await updateUserInDb(user.uid, trimmedName);
      Alert.alert("Success!", "Profile updated successfully ✨", [
        { text: "OK", onPress: () => navigation.navigate('ProfileMain') }
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleChangePassword = async () => {
    const user = auth().currentUser;
    if (!user || newPassword.length < 6) {
      Alert.alert("Oops", "Password must be at least 6 characters! 🔑");
      return;
    }
    try {
      await user.updatePassword(newPassword);
      Alert.alert("Success", "Password updated safely!", [
        { text: "OK", onPress: () => navigation.navigate('ProfileMain') }
      ]);
      setNewPassword('');
    } catch (error: any) {
      Alert.alert("Security Check", "Please re-login to update your password.");
    }
  };

  const handleDeleteAccount = () => {
    const user = auth().currentUser;
    if (!user) return;
    Alert.alert("Wait! 🥺", "Delete everything?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete Account", style: "destructive", onPress: async () => {
        try {
          await firestore().collection('Users').doc(user.uid).delete();
          await AsyncStorage.removeItem('user_profile_image');
          await user.delete();
          await auth().signOut();
        } catch (e) { Alert.alert("Error", "Could not delete"); }
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backCircle}>
          <ChevronLeft color={COLORS.primaryBlue} size={28} strokeWidth={3} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 45 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* PHOTO SECTION */}
          <View style={styles.sectionCard}>
             <View style={styles.sectionHeader}>
                <View style={styles.iconWrapper}><Camera color={COLORS.softPurple} size={20} /></View>
                <Text style={styles.sectionTitle}>Profile Picture</Text>
             </View>
             <View style={styles.imagePickerContainer}>
                <View style={styles.imageWrapper}>
                  {tempImage ? (
                    <Image source={{ uri: tempImage }} style={styles.previewImage} />
                  ) : (
                    <View style={[styles.previewImage, styles.placeholderImage]}>
                        <User color={COLORS.softPurple} size={40} />
                    </View>
                  )}
                </View>
                
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.imagePickerBtn} onPress={handlePickImage}>
                     <Text style={styles.imagePickerBtnText}>Change Photo</Text>
                  </TouchableOpacity>

                  {/* Show Save button only if the preview image differs from the saved image */}
                  {tempImage !== profileImage && (
                    <TouchableOpacity style={styles.savePhotoBtn} onPress={handleSavePhoto}>
                       <CheckCircle color={COLORS.white} size={16} />
                       <Text style={styles.savePhotoBtnText}>Save</Text>
                    </TouchableOpacity>
                  )}
                </View>
             </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconWrapper}><User color={COLORS.softPurple} size={20} /></View>
              <Text style={styles.sectionTitle}>Profile Details</Text>
            </View>
            <Text style={styles.label}>New Username</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter new username"
              placeholderTextColor="#AAA"
              maxLength={20}
            />
            <TouchableOpacity style={styles.primaryBtn} onPress={handleUpdateProfile}>
              <Save color={COLORS.white} size={18} />
              <Text style={styles.btnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconWrapper}><Lock color={COLORS.softPurple} size={20} /></View>
              <Text style={styles.sectionTitle}>Security</Text>
            </View>
            <Text style={styles.label}>Update Password</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="••••••••"
              secureTextEntry
              placeholderTextColor="#AAA"
            />
            <TouchableOpacity 
              style={[styles.primaryBtn, { backgroundColor: COLORS.softPurple }]} 
              onPress={handleChangePassword}
            >
              <Text style={styles.btnText}>Update Password</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
            <Trash2 color={COLORS.danger} size={18} />
            <Text style={styles.deleteBtnText}>Delete Account</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.creamBg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 0) + 15 : 10, paddingBottom: 15 },
  backCircle: { backgroundColor: COLORS.white, width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: COLORS.primaryBlue },
  scrollContent: { padding: 25, paddingBottom: 100 },
  sectionCard: { backgroundColor: COLORS.white, borderRadius: 30, padding: 20, marginBottom: 25, elevation: 4 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconWrapper: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#F3F1FB', justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.primaryBlue, marginLeft: 12 },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.softPurple, marginBottom: 8 },
  input: { backgroundColor: COLORS.inputBg, padding: 15, borderRadius: 18, fontSize: 16, color: '#444', marginBottom: 15 },
  primaryBtn: { flexDirection: 'row', backgroundColor: COLORS.primaryBlue, padding: 16, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnText: { color: COLORS.white, fontWeight: '800', fontSize: 16 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, borderRadius: 25, borderWidth: 2, borderColor: COLORS.danger, borderStyle: 'dashed', gap: 10, marginTop: 10, opacity: 0.8 },
  deleteBtnText: { color: COLORS.danger, fontWeight: '800', fontSize: 16 },
  imagePickerContainer: { alignItems: 'center' },
  imageWrapper: { width: 110, height: 110, borderRadius: 55, overflow: 'hidden', backgroundColor: COLORS.inputBg, marginBottom: 15, borderWidth: 3, borderColor: '#F3F1FB' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholderImage: { justifyContent: 'center', alignItems: 'center' },
  buttonRow: { flexDirection: 'row', gap: 10 },
  imagePickerBtn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12, backgroundColor: '#F3F1FB' },
  imagePickerBtnText: { color: COLORS.primaryBlue, fontWeight: '700', fontSize: 14 },
  savePhotoBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12, backgroundColor: COLORS.success },
  savePhotoBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 14 }
});

export default SettingScreen;