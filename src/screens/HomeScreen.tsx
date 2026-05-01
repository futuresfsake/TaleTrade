import React, { useState, useEffect } from 'react';
import { 
  ScrollView, View, Text, FlatList, TouchableOpacity, 
  ActivityIndicator, StyleSheet, Dimensions 
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { fetchBooksByGenre } from '../services/bookService';
import { getUserGenres } from '../services/genreService'; 
import { getUsername } from '../services/userService';
import BookCard from '../component/BookCard';
// FIXED: Ensure this import matches your project's icon library
import { Bell } from 'lucide-react-native';

const GENRES = [
  'Recommended', 'Contemporary', 'Memoir', 'Dystopian', 'Self-Help', 
  'Paranormal', 'Classics', 'Graphic Novel', 
  'Thriller & Suspense', 'Fantasy', 'Mystery', 'Historical Fiction'
];

const COLORS = {
  primaryBlue: '#4A68BE',
  softPurple: '#7E6FB0',
  creamBg: '#F5E9CF',
  white: '#FFFFFF',
};

const HomeScreen = ({ navigation }: any) => {
  const [sections, setSections] = useState<{[key: string]: any[]}>({});
  const [userName, setUserName] = useState('Reader'); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        const user = auth().currentUser;
        const data: {[key: string]: any[]} = {};

        if (user) {
          const name = await getUsername(user.uid);
          setUserName(name || 'Reader');
        }
        
        const userPrefs = await getUserGenres();
        const recQuery = (userPrefs && userPrefs.length > 0) ? userPrefs[0] : 'fiction';

        await Promise.all(
          GENRES.map(async (genre) => {
            let query = genre === 'Recommended' ? recQuery : genre;
            data[genre] = await fetchBooksByGenre(query);
          })
        );

        setSections(data);
      } catch (error) {
        console.error("MOBDEV Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.softPurple} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      // CRITICAL: This allows the horizontal lists to work inside the vertical ScrollView
      nestedScrollEnabled={true} 
    >
      {/* 1. Header with Bell */}
      <View style={styles.headerContainer}>
        <Text style={styles.greetingText}>Good Day, {userName}</Text>
        
      </View>

     
      {/* 3. The Sections */}
      {GENRES.map((genre) => (
        <View key={genre} style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={styles.genreTitle}>
              {genre === 'Recommended' ? 'Recommended for you' : genre}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('GenreDetail', { genreName: genre })}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            // THE SCROLL FIX: These 3 lines ensure smooth left/right swiping
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            disableIntervalMomentum={true}
            // Ensures cards don't shrink
            data={sections[genre] || []}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <BookCard book={item} />
              </View>
            )}
            keyExtractor={(item, index) => `${genre}-${item.id || index}-${index}`}
            contentContainerStyle={styles.listPadding}
          />
        </View>
      ))}
      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.creamBg, 
  },
  headerContainer: { 
    marginTop: 60, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
  },
  greetingText: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    textDecorationLine: 'underline',
    color: '#1a1a1a' 
  },
  mainSubTitle: {
    fontSize: 16,
    color: '#666',
    marginLeft: 20,
    marginTop: 5,
    marginBottom: 20,
    fontWeight: '500'
  },
  bellWrapper: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 50,
    elevation: 3, // Shadow for Android
  },
  section: { 
    marginBottom: 25, 
    paddingTop: 15
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    marginBottom: 10 
  },
  genreTitle: { fontSize: 18, fontWeight: 'bold' },
  viewAll: { color: COLORS.softPurple, fontWeight: '600' },
  cardWrapper: {
    width: 140, // FIXED WIDTH IS REQUIRED FOR HORIZONTAL SCROLL
    marginRight: 10,
  },
  listPadding: { 
    paddingLeft: 20, 
    paddingRight: 20 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: COLORS.creamBg 
  }
});

export default HomeScreen;