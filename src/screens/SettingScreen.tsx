import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  SafeAreaView, Alert, ScrollView, KeyboardAvoidingView, 
  Platform, StatusBar as RNStatusBar, Image,
  Linking, PermissionsAndroid 
} from 'react-native';
import { ChevronLeft, User, Trash2, Save, Camera, CheckCircle, AlignLeft, LogOut } from 'lucide-react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { updateUserInDb } from '../services/userService';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  primaryBlue: '#4A68BE',
  softPurple: '#7E6FB0',
  creamBg: '#F5E9CF',
  white: '#FFFFFF',
  danger: '#FF6B6B',
  inputBg: '#F9F7F2',
  success: '#4CAF50',
  divider: '#EEE'
};

const SettingScreen = ({ navigation }: any) => {
  const [newName, setNewName] = useState('');
  const [newBio, setNewBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const user = auth().currentUser;
    if (user) {
      const userData = await getUserProfile(user.uid);
      if (userData) {
        setNewName(userData.username || '');
        setNewBio(userData.bio || '');
      }
    }
    const savedImage = await AsyncStorage.getItem('user_profile_image');
    if (savedImage) {
      setProfileImage(savedImage);
      setTempImage(savedImage);
    }
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'ios') return true;
    if (Platform.OS === 'android') {
      try {
        const permission = Platform.Version >= 33 
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES 
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
        const granted = await PermissionsAndroid.request(permission);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) { return false; }
    }
    return false;
  };

  const handlePickImage = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Enable gallery access in settings.", 
        [{ text: "Cancel" }, { text: "Settings", onPress: () => Linking.openSettings() }]);
      return;
    }
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (response.assets && response.assets[0].uri) {
        setTempImage(response.assets[0].uri);
      }
    });
  };

  const handleSavePhoto = async () => {
    try {
      if (tempImage) {
        await AsyncStorage.setItem('user_profile_image', tempImage);
        setProfileImage(tempImage);
        Alert.alert("Success! ✨", "Profile picture updated.");
      }
    } catch (error) {
      Alert.alert("Error ❌", "Failed to save picture.");
    }
  };

  const handleUpdateProfile = async () => {
    const user = auth().currentUser;
    if (!user || newName.trim().length < 3) return;
    try {
      await user.updateProfile({ displayName: newName.trim() });
      await updateUserInDb(user.uid, newName.trim());
      Alert.alert("Success!", "Name updated ✨");
    } catch (error: any) { Alert.alert("Error", error.message); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backCircle}>
          <ChevronLeft color={COLORS.primaryBlue} size={26} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Settings</Text>
        <View style={{ width: 45 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* COHESIVE TOP SECTION: AVATAR */}
          <View style={styles.avatarSection}>
            <View style={styles.imageWrapper}>
              {tempImage ? (
                <Image source={{ uri: tempImage }} style={styles.previewImage} />
              ) : (
                <View style={styles.placeholderImage}><User color={COLORS.softPurple} size={50} /></View>
              )}
              <TouchableOpacity style={styles.cameraBadge} onPress={handlePickImage}>
                <Camera color={COLORS.white} size={18} />
              </TouchableOpacity>
            </View>
            
            {tempImage !== profileImage && (
              <TouchableOpacity style={styles.saveBadge} onPress={handleSavePhoto}>
                 <CheckCircle color={COLORS.white} size={14} />
                 <Text style={styles.saveBadgeText}>Save Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* MAIN UNIFIED SETTINGS CARD */}
          <View style={styles.unifiedCard}>
            
            {/* Section 1: Name */}
            <View style={styles.rowItem}>
              <View style={styles.rowIcon}><User color={COLORS.softPurple} size={20} /></View>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>Username</Text>
                <TextInput
                  style={styles.rowInput}
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Enter username"
                  placeholderTextColor="#AAA"
                />
              </View>
              <TouchableOpacity onPress={handleUpdateProfile} style={styles.rowAction}>
                <Save color={COLORS.primaryBlue} size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Section 2: Password */}
            <View style={styles.rowItem}>
              <View style={styles.rowIcon}><Lock color={COLORS.softPurple} size={20} /></View>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>New Password</Text>
                <TextInput
                  style={styles.rowInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="••••••••"
                  secureTextEntry
                  placeholderTextColor="#AAA"
                />
              </View>
            </View>

          </View>

          {/* DANGER AREA (Kept separate for visual caution) */}
          <TouchableOpacity style={styles.deleteBtn} onPress={() => {}}>
            <Trash2 color={COLORS.danger} size={18} />
            <Text style={styles.deleteBtnText}>Delete My Account</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.creamBg },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 0) + 10 : 10, 
    paddingBottom: 20 
  },
  backCircle: { backgroundColor: COLORS.white, width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.primaryBlue },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  
  // Cohesive Avatar Style
  avatarSection: { alignItems: 'center', marginTop: 10, marginBottom: 30 },
  imageWrapper: { width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.white, elevation: 5, padding: 4 },
  previewImage: { width: '100%', height: '100%', borderRadius: 60 },
  placeholderImage: { width: '100%', height: '100%', borderRadius: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F0F0' },
  cameraBadge: { 
    position: 'absolute', bottom: 0, right: 0, 
    backgroundColor: COLORS.primaryBlue, width: 38, height: 38, 
    borderRadius: 19, justifyContent: 'center', alignItems: 'center', 
    borderWidth: 3, borderColor: COLORS.white 
  },
  saveBadge: { 
    marginTop: 12, backgroundColor: COLORS.success, 
    flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 6, 
    borderRadius: 20, alignItems: 'center', gap: 5 
  },
  saveBadgeText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },

  // Unified Settings Card
  unifiedCard: { backgroundColor: COLORS.white, borderRadius: 25, paddingVertical: 10, elevation: 3 },
  rowItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  rowIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8F7FF', justifyContent: 'center', alignItems: 'center' },
  rowContent: { flex: 1, marginLeft: 15 },
  rowLabel: { fontSize: 12, fontWeight: '700', color: COLORS.softPurple, textTransform: 'uppercase', marginBottom: 2 },
  rowInput: { fontSize: 16, color: '#333', padding: 0, fontWeight: '600' },
  rowAction: { padding: 5 },
  divider: { height: 1, backgroundColor: COLORS.divider, marginHorizontal: 20 },

  deleteBtn: { 
    marginTop: 30, flexDirection: 'row', alignItems: 'center', 
    justifyContent: 'center', gap: 8, padding: 15 
  },
  deleteBtnText: { color: COLORS.danger, fontWeight: '700', fontSize: 15 },
});

export default SettingScreen;