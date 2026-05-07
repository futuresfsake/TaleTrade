import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator, Image, Alert
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { ArrowLeft } from 'lucide-react-native';

/**
 * Reconstructs the Google Books API shape from flat Firestore fields.
 * BookDetailScreen expects bookData.volumeInfo.title, etc.
 */
const reconstructBookData = (item: any) => ({
  id: item.bookId || item.id,
  volumeInfo: {
    title: item.title,
    authors: item.author ? item.author.split(', ') : [],
    description: item.description || '',
    publisher: item.publisher || '',
    publishedDate: item.publishedDate || '',
    pageCount: item.pageCount || 0,
    categories: item.categories || [],
    imageLinks: {
      thumbnail: item.thumbnail || null,
    },
    industryIdentifiers: item.isbn
      ? [{ identifier: item.isbn }]
      : [],
  },
});

export default function WishlistScreen({ navigation }: any) {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = auth().currentUser?.uid;
    if (!userId) { setLoading(false); return; }

    const unsubscribe = firestore()
      .collection('users')
      .doc(userId)
      .collection('wishlist')
      .onSnapshot((snapshot) => {
        if (snapshot) {
          setBooks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
        setLoading(false);
      }, (error) => {
        console.error('Wishlist error:', error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const handleDelete = (bookId: string) => {
    Alert.alert('Remove Book', 'Remove this book from your wishlist?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: async () => {
          const userId = auth().currentUser?.uid;
          if (!userId) return;
          try {
            await firestore()
              .collection('users').doc(userId)
              .collection('wishlist').doc(bookId).delete();
          } catch (error) {
            Alert.alert('Error', 'Failed to remove from wishlist');
          }
        }
      }
    ]);
  };

  const handleBookPress = (item: any) => {
    navigation.navigate('BookDetail', {
      bookData: reconstructBookData(item),
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A68BE" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color="#4A68BE" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Wishlist</Text>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleBookPress(item)}
            activeOpacity={0.85}
          >
            {item.thumbnail ? (
              <Image source={{ uri: item.thumbnail }} style={styles.cover} />
            ) : (
              <View style={styles.coverPlaceholder}>
                <Text style={styles.placeholderText}>📚</Text>
              </View>
            )}

            <View style={styles.info}>
              <Text style={styles.bookTitle} numberOfLines={2}>
                {item.title || 'Untitled'}
              </Text>
              {item.author && (
                <Text style={styles.author} numberOfLines={1}>{item.author}</Text>
              )}
              {item.categories?.length > 0 && (
                <Text style={styles.genre} numberOfLines={1}>{item.categories[0]}</Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={styles.removeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.delete}>Remove</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>⭐</Text>
            <Text style={styles.emptyText}>Your wishlist is empty.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5E9CF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5E9CF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, marginBottom: 20 },
  backButton: { backgroundColor: '#FFF', padding: 8, borderRadius: 12, elevation: 3, marginRight: 15 },
  title: { fontSize: 28, fontWeight: '900', color: '#4A68BE', textDecorationLine: 'underline' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 15,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cover: { width: 70, height: 100 },
  coverPlaceholder: {
    width: 70, height: 100,
    backgroundColor: '#e0d5c1',
    justifyContent: 'center', alignItems: 'center',
  },
  placeholderText: { fontSize: 24 },
  info: { flex: 1, paddingHorizontal: 14, paddingVertical: 12 },
  bookTitle: { fontSize: 15, color: '#1a1a1a', fontWeight: 'bold', marginBottom: 4 },
  author: { fontSize: 13, color: '#666', marginBottom: 4 },
  genre: { fontSize: 11, color: '#9b87c8', fontStyle: 'italic' },
  removeBtn: { paddingHorizontal: 14, paddingVertical: 8 },
  delete: { color: '#7E6FB0', fontWeight: 'bold', fontSize: 13 },
  emptyContainer: { marginTop: 100, alignItems: 'center', gap: 10 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { color: '#666', fontSize: 16 },
});