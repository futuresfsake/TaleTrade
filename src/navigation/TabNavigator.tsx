import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Components & Screens
import TabBar from '../component/TabBar'; 
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingScreen from '../screens/SettingScreen';

import GenreDetailScreen from '../screens/GenreDetailScreen';


const MainStack = createNativeStackNavigator();

export const MainNavigator = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      {/* 1. The Tabs (Home, Search, Profile) are treated as one screen here */}
      <MainStack.Screen name="MainTabs" component={TabNavigator} />
      
      {/* 2. GenreDetail is outside the Tabs so it covers the whole screen */}
      <MainStack.Screen 
        name="GenreDetail" 
        component={GenreDetailScreen} 
        options={{ 
          headerShown: true, 
          title: 'Explore Genre',
          headerBackTitle: 'Back' 
        }} 
      />
    </MainStack.Navigator>
  );
};
// 1. Create a Stack Navigator specifically for the Profile section
const ProfileStack = createNativeStackNavigator();

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="Settings" component={SettingScreen} />
    </ProfileStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;