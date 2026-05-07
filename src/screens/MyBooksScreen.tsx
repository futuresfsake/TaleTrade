import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator, RefreshControl, Image, Alert
} from 'react-native';
import { getUserInventory, removeBookFromInventory } from '../services/userbookService';
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

export default function MyBooksScreen({ navigation }: any) {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBooks = async () => {
    try {
      const data = await getUserInventory();
      setBooks(data);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBooks();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert('Remove Book', 'Remove this book from your shelf?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: async () => {
          try {
            setBooks(prev => prev.filter(book => book.id !== id));
            await removeBookFromInventory(id);
          } catch (error) {
            console.error("Delete failed:", error);
            fetchBooks();
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
        <Text style={styles.title}>My Books</Text>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4A68BE" />
        }
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
                {item.title || 'Untitled Book'}
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
            <Text style={styles.emptyEmoji}>📖</Text>
            <Text style={styles.emptyText}>You haven't added any books yet.</Text>
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