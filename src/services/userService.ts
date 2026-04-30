import firestore from '@react-native-firebase/firestore';

export const getUsername = async (uid: string) => {
  const doc = await firestore().collection('users').doc(uid).get();
  return doc.exists() ? doc.data()?.username : null;
};