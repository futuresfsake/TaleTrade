import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; //

const BookCard = ({ book }: { book: any }) => {
  // Access the navigation context
  const navigation = useNavigation<any>();

  // Extracting metadata safely to prevent crashes
  const imageUrl = book.volumeInfo?.imageLinks?.thumbnail;
  const title = book.volumeInfo?.title || "Unknown Title";

  const handlePress = () => {
    /**
     * MOBDEV LOGIC: 
     * If the card is in HomeScreen (nested in Tabs), we use getParent().
     * If the card is in GenreDetail (root stack), getParent() is null, so we use local navigation.
     *
     */
    const navigator = navigation.getParent() || navigation;

    navigator.navigate('BookDetail', { 
      bookId: book.id, 
      bookData: book // Passing full data for instant loading
    });
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Visual Layer with Placeholder fallback */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, styles.placeholder]}>
            <Text style={styles.placeholderText}>No Cover</Text>
          </View>
        )}
      </View>

      {/* Info Layer: Professional alignment */}
      <Text numberOfLines={2} style={styles.title}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { 
    width: 120, 
    marginHorizontal: 10, 
    marginBottom: 15,
    alignItems: 'flex-start'
  },
  imageContainer: {
    // Professional Purple Handshake (Shadow/Elevation)
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5, // Android
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cover: { 
    width: 120, 
    height: 180, 
    borderRadius: 10 
  },
  placeholder: { 
    backgroundColor: '#e1e1e1', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  placeholderText: {
    fontSize: 12,
    color: '#888'
  },
  title: { 
    marginTop: 8, 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#333',
    lineHeight: 18
  }
});

export default BookCard;