import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'; 

import { AuthNavigator } from './src/navigation/AuthNavigator';
import TabNavigator from './src/navigation/TabNavigator';
import PickAGenreScreen from './src/screens/PickAGenreScreen';

const RootStack = createNativeStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    // Listener 1: Handles Login and Logout
    const authSubscriber = auth().onAuthStateChanged((userState) => {
      setUser(userState);
      if (initializing) setInitializing(false);
    });

    // Listener 2: Handles Profile Updates (Crucial for the Genre -> Home switch)
    const userSubscriber = auth().onUserChanged((userState) => {
      if (userState) {
        setUser(userState);
      }
    });

    return () => {
      authSubscriber();
      userSubscriber();
    };
  }, [initializing]);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A68BE" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // If the user is logged in but has no displayName, they stay in Onboarding
          !user.displayName ? (
            <RootStack.Screen 
              name="Onboarding" 
              component={PickAGenreScreen} 
              key="onboarding-screen"
            />
          ) : (
            // Once displayName is set, they are moved to the main App
            <RootStack.Screen 
              name="AppTabs" 
              component={TabNavigator} 
              key="main-app-tabs"
            />
          )
        ) : (
          <RootStack.Screen 
            name="Auth" 
            component={AuthNavigator} 
            key="auth-stack"
          />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, 
    backgroundColor: '#F5E9CF', 
    justifyContent: 'center', 
    alignItems: 'center'
  }
});

export default App;