import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
// 1. Import logic from your service layer
import { 
  getBookOwners, 
  addBookToUserInventory, 
  addToWishlist 
} from '../services/userbookService';

const BookDetailScreen = ({ route }: any) => {
  const { bookData } = route.params; 
  const [owners, setOwners] = useState<any[]>([]);
  const [loadingAction, setLoadingAction] = useState(false);

  // Reusable function to fetch owners
  const fetchOwners = async () => {
    try {
      const data = await getBookOwners(bookData.id);
      setOwners(data);
    } catch (err) {
      console.log("Error fetching owners:", err);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, [bookData.id]);

  // Handle "+ Own This"
  const handleAddBook = async () => {
    setLoadingAction(true);
    try {
      await addBookToUserInventory(bookData);
      Alert.alert("Success", "Book added to your inventory!");
      await fetchOwners(); // Refresh the list to see "You" appear
    } catch (error) {
      Alert.alert("Error", "Could not add book. Please try again.");
    } finally {
      setLoadingAction(false);
    }
  };

  // Handle "Wishlist"
  const handleWishlist = async () => {
    try {
      await addToWishlist(bookData);
      Alert.alert("Wishlist", "Added to your hearts!");
    } catch (error) {
      Alert.alert("Error", "Could not add to wishlist.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 1. Header Section */}
      <View style={styles.header}>
        <Image 
          source={{ uri: bookData.volumeInfo.imageLinks?.thumbnail }} 
          style={styles.mainCover} 
        />
        <Text style={styles.title}>{bookData.volumeInfo.title}</Text>
        <Text style={styles.author}>By {bookData.volumeInfo.authors?.join(', ') || 'Unknown'}</Text>
      </View>

      {/* 2. Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.ownButton, loadingAction && { opacity: 0.7 }]} 
          onPress={handleAddBook}
          disabled={loadingAction}
        >
          {loadingAction ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>+ Own This</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.wishButton} onPress={handleWishlist}>
          <Text style={styles.btnText}>Wishlist</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Description Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About this book</Text>
        <Text style={styles.description}>
          {bookData.volumeInfo.description || "No description available."}
        </Text>
      </View>

      {/* 4. Social Section (Dynamic Owners) */}
      <View style={styles.socialSection}>
        <Text style={styles.sectionTitle}>Users who own this book</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>
          {owners.length > 0 ? (
            owners.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.ownerCard}
                onPress={() => {
                  if (item.isMe) {
                    Alert.alert("Profile", "This is your collection!");
                  } else {
                    Alert.alert("Owner Info", `View ${item.username}'s profile to trade?`);
                  }
                }}
              >
                {/* Profile Container handles the "You" border highlight */}
                <View style={[
                  styles.profileCircleContainer, 
                  item.isMe && { borderColor: '#6178b8', borderWidth: 3 } 
                ]}>
                  <Image source={{ uri: item.photo }} style={styles.profileCircle} />
                </View>
                <Text style={[
                  styles.ownerName, 
                  item.isMe && { fontWeight: 'bold', color: '#6C63FF' }
                ]}>
                  {item.username}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noOwners}>Be the first to own this!</Text>
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5E9CF' },
  header: { alignItems: 'center', padding: 20 },
  mainCover: { 
    width: 200, 
    height: 300, 
    borderRadius: 15, 
    elevation: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.3, 
    shadowRadius: 10 
  },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 15, textAlign: 'center', color: '#333' },
  author: { fontSize: 16, color: '#6C63FF', marginTop: 5 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  ownButton: { backgroundColor: '#6C63FF', padding: 12, borderRadius: 25, width: '45%', alignItems: 'center' },
  wishButton: { backgroundColor: '#b84242', padding: 12, borderRadius: 25, width: '45%', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#222' },
  description: { color: '#666', lineHeight: 22, fontSize: 14 },
  socialSection: { padding: 20, borderTopWidth: 1, borderColor: '#eee', marginBottom: 30 },
  ownerCard: { alignItems: 'center', marginRight: 20 },
  // Added container to allow borders around the profile circle
  profileCircleContainer: {
    borderRadius: 35,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCircle: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    borderWidth: 2, 
    borderColor: '#6C63FF' 
  },
  ownerName: { fontSize: 12, marginTop: 5, color: '#555' },
  noOwners: { fontStyle: 'italic', color: '#999' }
});

export default BookDetailScreen;