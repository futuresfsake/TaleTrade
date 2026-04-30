//! the traffic controller 

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LaunchScreen from '../screens/LaunchScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingScreen from '../screens/SettingScreen';

import PickAGenreScreen from '../screens/PickAGenreScreen'; // Import the new screen
import auth from '@react-native-firebase/auth'; // Summoning the SDK "brains"

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Launch" component={LaunchScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      {/* <Stack.Screen name="PickAGenre" component={PickAGenreScreen} /> */}
      {/* <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name="Profile" component={ProfileScreen}/>
      <Stack.Screen name="Settings" component={SettingScreen}/> */}
    </Stack.Navigator>
  );
};