import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const PickAGenreScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick Your Favorite Genre</Text>
      <Text style={styles.subtitle}>Tailor your TaleTrade experience.</Text>
      
      {/* Placeholder for genre selection logic */}
      <Button title="Continue to Home" onPress={() => console.log('Genre Selected')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 }
});

export default PickAGenreScreen;