import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { Settings, BookOpen, Clock, LogOut, ChevronRight } from 'lucide-react-native';

const COLORS = {
  primaryBlue: '#4A68BE',
  softPurple: '#7E6FB0',
  creamBg: '#F5E9CF',
  white: '#FFFFFF',
};

const { width } = Dimensions.get('window');

// --- HELPER COMPONENTS ---

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const MenuItem = ({ icon: Icon, label, onPress, isLast = false }: any) => (
  <TouchableOpacity
    style={[styles.menuItem, isLast && styles.menuItemLast]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuItemLeft}>
      <View style={styles.iconBackground}>
        <Icon color={COLORS.softPurple} size={18} />
      </View>
      <Text style={styles.menuItemLabel}>{label}</Text>
    </View>
    <ChevronRight color="#CCCCCC" size={18} />
  </TouchableOpacity>
);

// --- MAIN SCREEN ---

const ProfileScreen = ({ navigation, route }: any) => {
  // 1. Local State for User Info (This makes it "Changeable")
  const [userName, setUserName] = useState('Jane Doe');
  const [initials, setInitials] = useState('JD');

  // 2. Listen for changes coming back from the Settings Screen
  useEffect(() => {
    if (route.params?.updatedName) {
      setUserName(route.params.updatedName);
      
      // Automatically update initials based on new name
      const nameParts = route.params.updatedName.split(' ');
      const newInitials = nameParts.length > 1 
        ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
        : nameParts[0][0].toUpperCase();
      setInitials(newInitials);
    }
  }, [route.params?.updatedName]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainWrapper}>
          
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Settings', { currentName: userName })}
              style={styles.settingsButton}
              activeOpacity={0.7}
            >
              <Settings color={COLORS.primaryBlue} size={24} />
            </TouchableOpacity>
          </View>

          {/* Avatar Section - Now using State Variables */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userJoined}>Joined: Jan 2024</Text>
          </View>

          <View style={styles.statsContainer}>
            <StatItem value="12" label="Tales Read" />
            <View style={{ width: 15 }} />
            <StatItem value="4" label="Tales Traded" />
          </View>

          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Library</Text>
            <MenuItem 
              icon={BookOpen} 
              label="My Saved Tales" 
              onPress={() => console.log('Saved Tales')} 
            />
            <MenuItem 
              icon={Clock} 
              label="Reading History" 
              onPress={() => console.log('History')} 
            />
            <MenuItem 
              icon={LogOut} 
              label="Log Out" 
              onPress={() => console.log('Logout')} 
              isLast={true} 
            />
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.creamBg,
  },
  mainWrapper: {
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'ios' ? 30 : 60, 
  },
  scrollContent: {
    paddingBottom: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.primaryBlue,
    letterSpacing: -0.5,
  },
  settingsButton: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 15,
    shadowColor: COLORS.softPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 35,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.softPurple,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 15,
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.softPurple,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primaryBlue,
  },
  userJoined: {
    fontSize: 14,
    color: COLORS.softPurple,
    opacity: 0.6,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 35,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    borderRadius: 24,
    shadowColor: COLORS.softPurple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.softPurple,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryBlue,
    marginTop: 3,
    opacity: 0.8,
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: COLORS.primaryBlue,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.05,
    shadowRadius: 25,
    elevation: 4,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryBlue,
    marginBottom: 8,
    marginTop: 15,
    paddingHorizontal: 5,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBackground: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F3F1FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444444',
  },
});

export default ProfileScreen;