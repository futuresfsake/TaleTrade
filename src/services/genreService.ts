import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
export const saveUserGenres = async (uid: string, genres: string[]) => {
  try {
    await firestore()
      .collection('users')
      .doc(uid)
      .set(
        {
          genres: genres,
        },
        { merge: true }
      );
  } catch (error) {
    console.error('Error saving genres:', error);
    throw error;
  }
};


export const getUserGenres = async (): Promise<string[]> => {
  try {
    const user = auth().currentUser;
    if (!user) return [];

    const userDoc = await firestore().collection('users').doc(user.uid).get();
    
    // THE FIX: We bypass .exists and check the data directly to stop the Console Error
    const userData = userDoc.data();
    if (userData && userData.genres) {
      return userData.genres;
    }
    return [];
  } catch (error) {
    console.error('MOBDEV Service Error:', error);
    return [];
  }
};