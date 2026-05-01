import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { Settings, BookOpen, Clock, LogOut, ChevronRight } from 'lucide-react-native';
import auth from '@react-native-firebase/auth';
import { getUsername } from '../services/userService';

const COLORS = {
  primaryBlue: '#4A68BE',
  softPurple: '#7E6FB0',
  creamBg: '#F5E9CF',
  white: '#FFFFFF',
};

const ProfileScreen = ({ navigation }: any) => {
  const [userName, setUserName] = useState('...');
  const [initials, setInitials] = useState('??');

  const fetchAndSetUserData = useCallback(async () => {
    const user = auth().currentUser;
    if (user) {
      // 1. Get name from Firestore 'Users' collection
      const dbUsername = await getUsername(user.uid);
      
      // 2. Priority: Firestore > Auth DisplayName > Fallback
      const finalName = dbUsername || user.displayName || 'Explorer';
      
      setUserName(finalName);

      // Generate Initials logic
      const nameParts = finalName.trim().split(' ');
      let newInitials = '';
      if (nameParts.length > 1) {
        newInitials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
      } else if (nameParts[0]) {
        newInitials = nameParts[0][0].toUpperCase();
      } else {
        newInitials = '??';
      }
      setInitials(newInitials);
    }
  }, []);

  useEffect(() => {
    fetchAndSetUserData();

    // Refresh when user navigates back to this screen
    const unsubscribeFocus = navigation.addListener('focus', () => {
      fetchAndSetUserData();
    });

    return unsubscribeFocus;
  }, [navigation, fetchAndSetUserData]);

  const handleLogout = () => {
    Alert.alert("Logging Out", "Are you sure? 🥺", [
      { text: "Stay", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: () => auth().signOut() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Settings')} 
          style={styles.settingsButton}
        >
          <Settings color={COLORS.primaryBlue} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainWrapper}>
          
          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userJoined}>Joined: Jan 2024</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Tales Read</Text>
            </View>
            <View style={{ width: 15 }} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Tales Traded</Text>
            </View>
          </View>

          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Library</Text>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.iconBackground}><BookOpen color={COLORS.softPurple} size={18} /></View>
                <Text style={styles.menuItemLabel}>My Saved Tales</Text>
              </View>
              <ChevronRight color="#CCCCCC" size={18} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={styles.menuItemLeft}>
                <View style={styles.iconBackground}><LogOut color={COLORS.softPurple} size={18} /></View>
                <Text style={styles.menuItemLabel}>Log Out</Text>
              </View>
              <ChevronRight color="#CCCCCC" size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.creamBg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: '900', color: COLORS.primaryBlue },
  settingsButton: { backgroundColor: COLORS.white, padding: 10, borderRadius: 15, elevation: 3 },
  mainWrapper: { paddingHorizontal: 25 },
  scrollContent: { paddingTop: 10, paddingBottom: 140 },
  avatarSection: { alignItems: 'center', marginBottom: 35 },
  avatarCircle: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center', elevation: 8, marginBottom: 15,
  },
  avatarInitials: { fontSize: 36, fontWeight: '800', color: COLORS.softPurple },
  userName: { fontSize: 24, fontWeight: '700', color: COLORS.primaryBlue },
  userJoined: { fontSize: 14, color: COLORS.softPurple, opacity: 0.6 },
  statsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 35 },
  statItem: { flex: 1, alignItems: 'center', backgroundColor: COLORS.white, paddingVertical: 20, borderRadius: 24 },
  statValue: { fontSize: 26, fontWeight: '900', color: COLORS.softPurple },
  statLabel: { fontSize: 12, fontWeight: '600', color: COLORS.primaryBlue, marginTop: 3 },
  menuContainer: { backgroundColor: COLORS.white, borderRadius: 30, paddingHorizontal: 20, paddingVertical: 10 },
  menuTitle: { fontSize: 18, fontWeight: '800', color: COLORS.primaryBlue, marginBottom: 8, marginTop: 15 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBackground: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#F3F1FB', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuItemLabel: { fontSize: 16, fontWeight: '600', color: '#444' },
});

export default ProfileScreen;