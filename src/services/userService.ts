import firestore from '@react-native-firebase/firestore';

/**
 * Fetches the full user profile from the 'Users' collection.
 */
export const getUserProfile = async (uid: string) => {
  try {
    const doc = await firestore().collection('Users').doc(uid).get();
    return doc.exists() ? doc.data() : null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

/**
 * Specifically updates the user's status string.
 */
export const updateUserStatus = async (uid: string, status: string) => {
  try {
    return await firestore()
      .collection('Users')
      .doc(uid)
      .set({
        status: status,
        lastUpdated: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};

/**
 * Updates or creates the user document (existing logic).
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