import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

/**
 * 1. CREATE: Add a book to the user's shelf.
 * Data is stored in the LOWERCASE 'users' collection.
 */
export const addBookToUserInventory = async (bookData: any) => {
  const userId = auth().currentUser?.uid;
  if (!userId) throw new Error("User not authenticated");

  await firestore()
    .collection('users') // Updated to lowercase
    .doc(userId)
    .collection('myBooks')
    .doc(bookData.id)
    .set({
      ...bookData,
      status: 'owned',
      addedAt: firestore.FieldValue.serverTimestamp(),
    });
};

/**
 * 2. READ: Fetch all books owned by the current user.
 * Reads from the LOWERCASE 'users' collection.
 */
export const getUserInventory = async () => {
  const userId = auth().currentUser?.uid;
  if (!userId) return [];

  try {
    const snapshot = await firestore()
      .collection('users') // Changed from 'Users' to 'users'
      .doc(userId)
      .collection('myBooks')
      .get();

    if (snapshot && !snapshot.empty) {
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
};

/**
 * 3. UPDATE: Change book status.
 * Updates in the LOWERCASE 'users' collection.
 */
export const updateBookStatus = async (bookId: string, newStatus: string) => {
  const userId = auth().currentUser?.uid;
  await firestore()
    .collection('users') // Changed from 'Users' to 'users'
    .doc(userId)
    .collection('myBooks')
    .doc(bookId)
    .update({ status: newStatus });
};

/**
 * 4. DELETE: Remove a book from the user's shelf.
 * Deletes from the LOWERCASE 'users' collection.
 */
export const removeBookFromInventory = async (bookId: string) => {
  const userId = auth().currentUser?.uid;
  await firestore()
    .collection('users') // Changed from 'Users' to 'users'
    .doc(userId)
    .collection('myBooks')
    .doc(bookId)
    .delete();
};

/**
 * 5. WISHLIST: Store in a separate sub-collection.
 * Uses the LOWERCASE 'users' collection.
 */
export const addToWishlist = async (bookData: any) => {
  const userId = auth().currentUser?.uid;
  if (!userId) throw new Error("User not authenticated");

  await firestore()
    .collection('users') // Changed from 'Users' to 'users'
    .doc(userId)
    .collection('wishlist')
    .doc(bookData.id)
    .set({
      ...bookData,
      addedAt: firestore.FieldValue.serverTimestamp(),
    });
};

/**
 * 6. READ OWNERS: Dynamic fetch finding real owners.
 * Pulls profile data (username/photo) from the CAPITALIZED 'Users'.
 */
export const getBookOwners = async (bookId: string) => {
  if (!bookId || typeof bookId !== 'string') {
    console.log("getBookOwners blocked: Missing or invalid bookId string path coordinate.");
    return [];
  }
  const currentUserId = auth().currentUser?.uid;

  try {
    const snapshot = await firestore()
      .collectionGroup('myBooks')
      .where('id', '==', bookId)
      .get();

    const uniqueOwnersMap = new Map();

    await Promise.all(
      snapshot.docs.map(async (doc) => {
        const parentUserRef = doc.ref.parent.parent; 
        
        if (parentUserRef && !uniqueOwnersMap.has(parentUserRef.id)) {
          // BRIDGE: Pull profile details only from capitalized 'Users'
          const userDoc = await firestore()
            .collection('Users') 
            .doc(parentUserRef.id)
            .get();
          
          const userData = userDoc.data();
          const isMe = userDoc.id === currentUserId;

          uniqueOwnersMap.set(parentUserRef.id, {
            id: userDoc.id,
            username: isMe 
              ? "You" 
              : (userData?.username || userData?.displayName || 'Anonymous'),
            photo: userData?.profilePic || 'https://via.placeholder.com/150',
            isMe: isMe
          });
        }
      })
    );

    return Array.from(uniqueOwnersMap.values());
  } catch (error) {
    console.error("Error fetching owners:", error);
    return [];
  }
};