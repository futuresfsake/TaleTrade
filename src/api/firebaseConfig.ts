import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FIREBASE_KEYS } from './private'; // Import the skeletal object
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const app = initializeApp(FIREBASE_KEYS);

// Initialize Firebase

// Export these so your services can "import { db } from './firebaseConfig'"
export const db = getFirestore(app);
export const auth = getAuth(app);