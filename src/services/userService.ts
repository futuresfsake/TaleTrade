import firestore from '@react-native-firebase/firestore';

/**
 * Fetches the username from the 'Users' collection.
 * Note: Ensure the Document ID is the user's UID.
 */
export const getUsername = async (uid: string) => {
  try {
    const doc = await firestore().collection('Users').doc(uid).get();
    return doc.exists() ? doc.data()?.username : null;
  } catch (error) {
    console.error("Error fetching username:", error);
    return null;
  }
};

/**
 * Updates or creates the user document in the 'Users' collection.
 */
export const updateUserInDb = async (uid: string, username: string) => {
  return await firestore()
    .collection('Users')
    .doc(uid)
    .set({
      username: username,
      lastUpdated: firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
};