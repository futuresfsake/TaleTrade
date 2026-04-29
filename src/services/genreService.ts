import firestore from '@react-native-firebase/firestore';

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