import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { registerUser } from '../../services/authService';

const RegisterScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthday, setBirthday] = useState('');



  const handleBirthdayChange = (text: string) => {
  // 1. Remove any non-numeric characters if they somehow get in
  const cleaned = text.replace(/[^0-9]/g, '');
  let formatted = cleaned;

  // 2. Auto-insert dashes for the MM-DD-YYYY format
  if (cleaned.length > 2 && cleaned.length <= 4) {
    formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
  } else if (cleaned.length > 4) {
    formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 8)}`;
  }

  setBirthday(formatted);
};

  const handleRegister = async () => {
    // 1. Basic Validation
    if (!email || !username || !birthday || !password || !confirmPassword ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Split the birthday string to check values: [MM, DD, YYYY]
  const parts = birthday.split('-');
  const month = parseInt(parts[0]);
  const day = parseInt(parts[1]);
  const year = parseInt(parts[2]);

  if (month < 1 || month > 12) {
    Alert.alert('Invalid Date', 'Month must be between 01 and 12');
    return;
  }

  if (day < 1 || day > 31) {
    Alert.alert('Invalid Date', 'Day must be between 01 and 31');
    return;
  }

  if (birthday.length < 10) {
    Alert.alert('Invalid Date', 'Please use the full MM-DD-YYYY format');
    return;
  }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      // 2. Call the "Brains" in your service
      await registerUser(email, password, username, birthday);
      Alert.alert('Success', 'Account created successfully!');
      navigation.replace('PickAGenre');  // Redirect to PickAGenre
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

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
  placeholder="Birthday (MM-DD-YYYY)"
  value={birthday}
  onChangeText={handleBirthdayChange} // Use the custom formatter here
  keyboardType="numeric"
  maxLength={10} // Limits to "01-01-2004"
            // Limits input to 8 digits (MMDDYYYY)
/>

      

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button title="Sign Up" onPress={handleRegister} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Login here.</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  input: { borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 15, padding: 8, fontSize: 16 },
  linkText: { color: 'blue', marginTop: 20, textAlign: 'center', textDecorationLine: 'underline' },
});

export default RegisterScreen;