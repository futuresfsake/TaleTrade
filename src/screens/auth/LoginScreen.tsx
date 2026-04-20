import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { loginUser } from '../../services/authService'; // The Logic Connection

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert('Error', 'Please enter both email and password');
    return;
  }

  try {
    // 1. The Backend Handshake: Verifying credentials with Firebase
    await loginUser(email, password);
    
    // 2. The Logic Transfer: Redirecting to PickAGenre
    // We use .replace so the user can't press 'back' to return to Login
    navigation.replace('PickAGenre'); 
    
  } catch (error: any) {
    let errorMessage = 'An error occurred during login.';
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      errorMessage = 'Invalid email or password.';
    }
    Alert.alert('Login Failed', errorMessage);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TaleTrade Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} color="#2ecc71" />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Don't have an account? Register here.</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, marginBottom: 40, textAlign: 'center', fontWeight: 'bold' },
  input: { borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 25, padding: 10, fontSize: 16 },
  buttonContainer: { marginTop: 10 },
  linkText: { color: '#3498db', marginTop: 25, textAlign: 'center', textDecorationLine: 'underline' }
});

export default LoginScreen;