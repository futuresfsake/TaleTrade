import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/TabNavigator'; 
import { searchBooks } from '../services/bookService'; 
import { Book } from '../types'; 

const COLORS = {
  creamBg: '#F5E9CF',
  white: '#FFFFFF',
  primaryBlue: '#4A68BE',
  softPurple: '#7E6FB0',
  lightGray: '#FFFFFF'
};

type SearchScreenNavProp = NativeStackNavigationProp<RootStackParamList>;

const SearchScreen = () => {
  const navigation = useNavigation<SearchScreenNavProp>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.trim().length > 2) { 
      setLoading(true);
      const books = await searchBooks(text);
      setResults(books);
      setLoading(false);
    } else {
      setResults([]); 
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Books</Text>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by title, author, or ISBN..."
          placeholderTextColor="#94A3B8"
          value={query}
          onChangeText={handleSearch}
          clearButtonMode="while-editing"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.softPurple} style={styles.loader} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.scrollContent}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.bookCard}
              activeOpacity={0.7}
              onPress={() => {
                // Navigate to BookDetail using the root stack router
                navigation.navigate('BookDetail', { bookData: item });
              }}
            >
              {item.thumbnail ? (
                <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              ) : (
                <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
                  <Text style={styles.placeholderText}>No Cover</Text>
                </View>
              )}
              
              <View style={styles.bookDetails}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.author} numberOfLines={1}>{item.authors.join(', ')}</Text>
                
                {item.isbn && (
                  <View style={styles.isbnBadge}>
                    <Text style={styles.isbnText}>ISBN: {item.isbn}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            query.trim().length > 2 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No books found matching "{query}"</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.creamBg },
  header: { paddingHorizontal: 25, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10, paddingBottom: 15 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: COLORS.primaryBlue },
  inputWrapper: { paddingHorizontal: 25, marginBottom: 10 },
  searchBar: { height: 54, borderRadius: 20, paddingHorizontal: 20, fontSize: 16, fontWeight: '600', color: COLORS.primaryBlue, backgroundColor: COLORS.white, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 }, android: { elevation: 4 } }) },
  loader: { marginTop: 40 },
  scrollContent: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 40 },
  bookCard: { flexDirection: 'row', backgroundColor: COLORS.white, padding: 14, borderRadius: 24, marginBottom: 16, alignItems: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 3 } }) },
  thumbnail: { width: 60, height: 90, marginRight: 16, borderRadius: 14, backgroundColor: '#f1f5f9', resizeMode: 'cover' },
  placeholderThumbnail: { justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 10, fontWeight: '700', color: '#94A3B8', textAlign: 'center' },
  bookDetails: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: COLORS.primaryBlue, lineHeight: 20 },
  author: { fontSize: 14, fontWeight: '600', color: '#64748B', marginTop: 4 },
  isbnBadge: { alignSelf: 'flex-start', backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 8 },
  isbnText: { fontSize: 11, fontWeight: '700', color: COLORS.softPurple, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 15, fontWeight: '600', color: '#64748B', textAlign: 'center', fontStyle: 'italic' }
});

export default SearchScreen;