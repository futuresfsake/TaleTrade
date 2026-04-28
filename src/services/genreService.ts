// src/services/genreService.ts
import { db } from '../api/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

/**
 * Saves selected genres to the user's specific Firestore document.
 * Uses setDoc with merge:true to ensure we don't overwrite existing 
 * data like 'birthday' or 'username'.
 */
export const saveUserGenres = async (userId: string, genres: string[]) => {
  const userRef = doc(db, 'users', userId);
  
  await setDoc(userRef, {
    favoriteGenres: genres,
    hasSelectedGenres: true
  }, { merge: true });
};

/**
 * Fetches books from Google Books based on user preferences.
 * Note: You can keep this here for the next sprint!
 */
export const fetchBooksByGenres = async (genres: string[]) => {
  const query = genres.map(g => `subject:${g}`).join('|');
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10`
  );
  const data = await response.json();
  return data.items || [];
};