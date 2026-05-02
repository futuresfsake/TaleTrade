// a data sourcing service. the logic transfer. this file's job is only to 
// * fetch data from Google's server. Its just search and retrieve = External
//* u refer to firebaseService or firestore, that is where u crud


// src/services/googleBooksService.ts
// src/services/googleBooksService.ts
import { GOOGLE_BOOKS_API_KEY } from '@env';

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

// src/services/googleBooksService.ts
export const fetchBooksByGenre = async (genre: string, maxResults = 10) => {
  try {
    const response = await fetch(
      `${BASE_URL}?q=subject:${genre}&maxResults=${maxResults}&key=${GOOGLE_BOOKS_API_KEY}`
    );
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};