import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const BookCard = ({ book }: { book: any }) => {
  // Extracting the thumbnail safely
  const imageUrl = book.volumeInfo.imageLinks?.thumbnail;

  return (
    <TouchableOpacity style={styles.card}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.placeholder]}>
          <Text>No Cover</Text>
        </View>
      )}
      <Text numberOfLines={2} style={styles.title}>{book.volumeInfo.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { width: 120, marginHorizontal: 10, marginBottom: 10 },
  cover: { width: 120, height: 180, borderRadius: 10, elevation: 3 },
  placeholder: { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  title: { marginTop: 5, fontSize: 14, fontWeight: '500' }
});

export default BookCard;