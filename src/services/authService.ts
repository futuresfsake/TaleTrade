import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const registerUser = async (email: string, password: string, username: string, birthday: string) => {
  try {
    // 1. Create the user account in Firebase Auth
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const { uid } = userCredential.user;

    // 2. Store the User data in Firestore
    await firestore().collection('Users').doc(uid).set({
      username: username,
      email: email,
      birthday: birthday, 
      // Initialize bio as an empty string or a default welcome message
      bio: "Hello! I'm new here and ready to trade tales. 📚", 
      createdAt: firestore.FieldValue.serverTimestamp(),
      lastUpdated: firestore.FieldValue.serverTimestamp(),
    });

    return userCredential.user;
  } catch (error: any) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error: any) {
    throw error;
  }
};

// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';

// // We define what the parameters are (: string) to fix the red lines
// export const registerUser = async (email: string, password: string, username: string, birthday: string) => {
//   try {
//     // 1. Create the user account in Firebase Auth
//     const userCredential = await auth().createUserWithEmailAndPassword(email, password);
//     const { uid } = userCredential.user;

//     // 2. Store the Username in the Firestore 'Users' collection
//     await firestore().collection('Users').doc(uid).set({
//       username: username,
//       email: email,
//       birthday: birthday, 
//       createdAt: firestore.FieldValue.serverTimestamp(),
//     });

//     return userCredential.user;
//   } catch (error: any) {
//     throw error;
//   }
// };

// export const loginUser = async (email: string, password: string) => {
//   try {
//     const userCredential = await auth().signInWithEmailAndPassword(email, password);
//     return userCredential.user;
//   } catch (error: any) {
//     throw error;
//   }
// };