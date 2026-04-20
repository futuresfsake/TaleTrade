import auth from '@react-native-firebase/auth';

// We define what the parameters are (: string) to fix the red lines
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    console.log('User account created & signed in!');
    return userCredential.user;
  } catch (error: any) { // Adding ': any' allows us to read error.code
    // Basic error handling for the transfer
    if (error.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
    }
    if (error.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    }
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