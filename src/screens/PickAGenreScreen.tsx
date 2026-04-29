import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  ActivityIndicator, 
  Alert
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { saveUserGenres } from '../services/genreService';

const GENRES = [
  "Contemporary", "Memoir", "Dystopian", "Self-Help", 
  "Paranormal", "Young Adult", "Classics", "Graphic Novel", 
  "Thriller & Suspense", "Fantasy", "Mystery", "Historical Fiction"
];

export default function PickAGenreScreen({ navigation }: any) {
  // These were the missing names you were looking for!
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleGenre = (genre: string) => {
    setSelected(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre) 
        : [...prev, genre]
    );
  };

  const handleNext = async () => {
  if (selected.length < 3) return;
  
  // Use the native SDK call
  const user = auth().currentUser; 

  if (!user) {
    Alert.alert("Error", "Please log in first!");
    return;
  }

  setLoading(true);
  try {
    await saveUserGenres(user.uid, selected);
    navigation.navigate('Home'); 
  } catch (error) {
    Alert.alert("Error", "Failed to save preferences.");
  } finally {
    setLoading(false);
  }
};
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.skipText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Tell us your favorite</Text>
        <View style={styles.underlineContainer}>
           <Text style={styles.titleText}>genre/s</Text>
           <View style={styles.underline} />
        </View>
        <Text style={styles.subtitle}>Choose 3 or more</Text>
      </View>

      <ScrollView contentContainerStyle={styles.genreCloud}>
        {GENRES.map((genre) => {
          const isSelected = selected.includes(genre);
          return (
            <TouchableOpacity
              key={genre}
              onPress={() => toggleGenre(genre)}
              style={[
                styles.genreItem,
                isSelected && styles.genreItemSelected
              ]}
            >
              <Text style={[
                styles.genreText,
                isSelected && styles.genreTextSelected
              ]}>
                {genre}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          onPress={handleNext}
          disabled={selected.length < 3 || loading}
          style={[
            styles.nextButton,
            (selected.length < 3 || loading) && styles.buttonDisabled
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.nextButtonText}>Next</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFCF0' }, // Off-white/cream background
  header: { padding: 20 },
  skipText: { color: '#6B7280', fontSize: 16 },
  titleContainer: { alignItems: 'center', marginTop: 10, marginBottom: 30 },
  titleText: { fontSize: 26, fontWeight: 'bold', color: '#1F2937' },
  underlineContainer: { alignItems: 'center' },
  underline: { height: 4, width: '100%', backgroundColor: '#8B5CF6', marginTop: -2 },
  subtitle: { marginTop: 12, color: '#6B7280', fontSize: 16 },
  genreCloud: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    paddingHorizontal: 15 
  },
  genreItem: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFF',
    margin: 6,
  },
  genreItemSelected: { 
    backgroundColor: '#8B5CF6', 
    borderColor: '#8B5CF6' 
  },
  genreText: { color: '#374151', fontSize: 15, fontWeight: '500' },
  genreTextSelected: { color: '#FFF' },
  footer: { padding: 25 },
  nextButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: { backgroundColor: '#C4B5FD', elevation: 0 },
  nextButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});