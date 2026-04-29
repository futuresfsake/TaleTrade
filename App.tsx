import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native'; // Added these
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import TabNavigator from './src/navigation/TabNavigator';
import auth from '@react-native-firebase/auth'; 

const RootStack = createNativeStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((userState) => {
      setUser(userState);
      setInitializing(false); // Set to false directly here
    });

    // Failsafe: If Firebase takes longer than 3 seconds, stop "initializing"
    // so you can at least see the Auth screens.
    const timer = setTimeout(() => {
      if (initializing) setInitializing(false);
    }, 3000);

    return () => {
      subscriber();
      clearTimeout(timer);
    };
  }, []);

  // Instead of returning null (which is a black screen), 
  // return a View with your cream background color!
  if (initializing) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F5E9CF', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4A68BE" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <RootStack.Screen name="AppTabs" component={TabNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;