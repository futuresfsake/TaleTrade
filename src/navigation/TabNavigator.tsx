import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Components & Screens
import TabBar from '../component/TabBar'; 
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingScreen from '../screens/SettingScreen';
import WishlistScreen from '../screens/WishlistScreen';
import MyBooksScreen from '../screens/MyBooksScreen';
import GenreDetailScreen from '../screens/GenreDetailScreen';
import BookDetailScreen from '../screens/BookDetailScreen';

// Our clean blueprint interface type definition
import { Book } from '../types'; 

// 1. Declare the blueprint checklist for all top-level screen paths
export type RootStackParamList = {
  MainTabs: undefined;     // Tab container doesn't require pass-down arguments
  GenreDetail: { genre: string }; 
  BookDetail: { bookData: Book }; // BookDetail EXPECTS a clean book object payload!
};

// 2. Pass the list directly to the Stack Builder function
const MainStack = createNativeStackNavigator<RootStackParamList>();

export const MainNavigator = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      {/* The Tabs (Home, Search, Profile) are treated as one screen here */}
      <MainStack.Screen name="MainTabs" component={TabNavigator} />
      
      {/* GenreDetail is outside the Tabs so it covers the whole screen */}
      <MainStack.Screen 
        name="GenreDetail" 
        component={GenreDetailScreen} 
        options={{ 
          headerShown: true, 
          title: 'Explore Genre',
          headerBackTitle: 'Back' 
        }} 
      />

      <MainStack.Screen 
        name="BookDetail" 
        component={BookDetailScreen} 
        options={{ 
          headerShown: true, 
          title: 'Book Details',
          headerTintColor: '#6C63FF' // Theme matching purple
        }} 
      />
    </MainStack.Navigator>
  );
};

// 3. Keep the Profile Stack sub-navigation clean
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
      <Tab.Screen name="My Books" component={MyBooksScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;