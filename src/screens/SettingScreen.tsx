import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  SafeAreaView, Alert, ScrollView, KeyboardAvoidingView, 
  Platform, StatusBar as RNStatusBar 
} from 'react-native';
import { ChevronLeft, User, Lock, Trash2, Save } from 'lucide-react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { updateUserInDb } from '../services/userService';

const COLORS = {
  primaryBlue: '#4A68BE',
  softPurple: '#7E6FB0',
  creamBg: '#F5E9CF',
  white: '#FFFFFF',
  danger: '#FF6B6B',
  inputBg: '#F9F7F2'
};

const SettingScreen = ({ navigation }: any) => {
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdateProfile = async () => {
    const user = auth().currentUser;
    if (!user) return;

    const trimmedName = newName.trim();
    if (trimmedName.length < 3) {
      Alert.alert("Too Short", "Username must be at least 3 characters long! ✨");
      return;
    }
    const nameRegex = /^[a-zA-Z0-9 ]+$/;
    if (!nameRegex.test(trimmedName)) {
      Alert.alert("Invalid Characters", "Use letters and numbers only! 🛡️");
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

    Alert.alert(
      "Wait! 🥺",
      "Delete everything? Your tales will be lost forever.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete Account", 
          style: "destructive", 
          onPress: async () => {
            try {
              const uid = user.uid;
              
              // 1. Delete Firestore data FIRST while user is still authenticated
              await firestore().collection('Users').doc(uid).delete();
              
              // 2. Delete the Auth account
              await user.delete();

              // 3. Success Alert (Show this BEFORE signing out/navigating)
              Alert.alert("Account Deleted", "Your account has been permanently removed. 👋");
              
              // 4. Explicitly sign out to clean up local cache
              await auth().signOut();
              
            } catch (error: any) {
              // Check if the error happened BECAUSE the user was already deleted 
              // (which means it actually succeeded)
              if (!auth().currentUser) {
                Alert.alert("Account Deleted", "Your account has been removed. 👋");
                return;
              }

              if (error.code === 'auth/requires-recent-login') {
                Alert.alert("Security Check", "Please log out and back in to verify your identity before deleting.");
              } else {
                Alert.alert("Error", "Could not complete deletion. Please try again.");
              }
            }
          } 
        }
      ]
    );
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
});

export default SettingScreen;