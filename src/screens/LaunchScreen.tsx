import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const LaunchScreen = ({ navigation }: any) => {
  return (
    <Pressable 
      style={styles.container} 
      onPress={() => navigation.navigate('Login')} // The Transfer Logic
    >
      <View>
        <Text style={styles.logo}>Tale Trade</Text>
        <Text style={styles.tapText}>Tap anywhere to start</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#000' 
  },
  logo: { 
    fontSize: 40, 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  tapText: { 
    color: '#aaa', 
    marginTop: 20 
  },
});

export default LaunchScreen;