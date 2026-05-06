import firestore from '@react-native-firebase/firestore';

/**
 * Fetches the full user document from Firestore.
 */
export const getUserProfile = async (uid: string) => {
  try {
    const doc = await firestore().collection('Users').doc(uid).get();
    // In some versions of RN Firebase, doc.exists is a property, in others a function.
    // doc.exists() is used here based on your provided snippet.
    return doc.exists() ? doc.data() : null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

/**
 * Updates the user's Bio/About Me section in the cloud.
 */
export const updateUserBio = async (uid: string, bio: string) => {
  try {
    return await firestore()
      .collection('Users')
      .doc(uid)
      .set({
        bio: bio,
        lastUpdated: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
  } catch (error) {
    console.error("Error updating bio:", error);
    throw error;
  }
};

/**
 * NEW: Updates the username in the database.
 * This fixes the "no exported member" error in SettingScreen.
 */
export const updateUserInDb = async (uid: string, username: string) => {
  try {
    return await firestore()
      .collection('Users')
      .doc(uid)
      .set({
        username: username,
        lastUpdated: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
  } catch (error) {
    console.error("Error updating username:", error);
    throw error;
  }
};

/**
 * Fetches just the username (for legacy support).
 */
export const getUsername = async (uid: string) => {
  try {
    const doc = await firestore().collection('Users').doc(uid).get();
    return doc.exists() ? doc.data()?.username : null;
  } catch (error) {
    return null;
  }
};