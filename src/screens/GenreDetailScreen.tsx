import React, { useEffect, useState } from 'react';
import { 
  FlatList, 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { fetchBooksByGenre } from '../services/bookService';
import BookCard from '../component/BookCard';

// Using your app's global color palette for uniformity
const COLORS = {
  primaryBlue: '#4A68BE',
  softPurple: '#7E6FB0',
  creamBg: '#F5E9CF',
  white: '#FFFFFF',
};

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail: string;
    };
  };
}

const GenreDetailScreen = ({ route }: any) => {
  const { genreName } = route.params; 
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        let queryGenre = genreName;

        // Logic Branching to match HomeScreen's API Mapping
        if (genreName === "Sci-Fi" || genreName === "SciFi") {
          queryGenre = "Fiction / Science Fiction"; 
        } 
        else if (genreName === "Recommended" || genreName === "Recommended for you") {
          queryGenre = "Fiction"; 
        }
        else if (genreName === "Memoir") {
          queryGenre = "Biography & Autobiography";
        }
        else if (genreName === "Graphic Novel") {
          queryGenre = "Comics & Graphic Novels";
        }

        const results = await fetchBooksByGenre(queryGenre, 40); 
        setBooks(results);
      } catch (error) {
        console.error("MOBDEV Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, [genreName]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.softPurple} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header aligned with HomeScreen style */}
      <View style={styles.header}>
        <Text style={styles.title}>{genreName}</Text>
        <Text style={styles.subtitle}>Explore the best in {genreName}</Text>
      </View>

      <FlatList
        data={books}
        numColumns={3}
        // FIX: Same unique key logic as HomeScreen to prevent Duplicate Key Errors
        keyExtractor={(item, index) => `${genreName}-${item.id || index}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <BookCard book={item} />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.creamBg 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.creamBg
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#1a1a1a',
    textDecorationLine: 'underline' // Matching your "Good Day" underline style
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 30
  },
  cardWrapper: {
    flex: 1,
    margin: 5, // Equal spacing in the grid
    alignItems: 'center',
    // We don't set a hard width here so the grid handles the 3-column layout
  }
});

export default GenreDetailScreen;