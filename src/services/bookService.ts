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


// Helper function to extract and clean only the metadata our app actually cares about
const cleanBookData = (items: any[]) => {
  if (!items) return [];
  
  return items.map((item: any) => {
    const volumeInfo = item.volumeInfo || {};
    
    // Safely parse out ISBN-13 or ISBN-10 for future database linking
    const identifiers = volumeInfo.industryIdentifiers || [];
    const isbnObj = identifiers.find((id: any) => id.type === 'ISBN_13') || 
                    identifiers.find((id: any) => id.type === 'ISBN_10');

    return {
      id: item.id, // Permanent Google reference ID
      title: volumeInfo.title || 'Untitled Book',
      authors: volumeInfo.authors || ['Unknown Author'],
      publisher: volumeInfo.publisher || 'Unknown Publisher',
      description: volumeInfo.description || 'No description available.',
      // Force HTTPS for thumbnails so images load securely inside the Android APK build
      thumbnail: volumeInfo.imageLinks?.thumbnail ? volumeInfo.imageLinks.thumbnail.replace('http://', 'https://') : undefined,
      isbn: isbnObj ? isbnObj.identifier : undefined,
    };
  });
};
export const searchBooks = async (query: string, maxResults = 20) => {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${GOOGLE_BOOKS_API_KEY}`
    );
    const data = await response.json();
    if (!data.items) return [];

    // This strips out volumeInfo and returns a clean, flat list of properties
    return data.items.map((item: any) => {
      const volumeInfo = item.volumeInfo || {};
      const identifiers = volumeInfo.industryIdentifiers || [];
      const isbnObj = identifiers.find((id: any) => id.type === 'ISBN_13') || 
                      identifiers.find((id: any) => id.type === 'ISBN_10');

      return {
        id: item.id,
        title: volumeInfo.title || 'Untitled Book',
        authors: volumeInfo.authors || ['Unknown Author'],
        publisher: volumeInfo.publisher || 'Unknown Publisher',
        description: volumeInfo.description || 'No description available.',
        thumbnail: volumeInfo.imageLinks?.thumbnail ? volumeInfo.imageLinks.thumbnail.replace('http://', 'https://') : undefined,
        isbn: isbnObj ? isbnObj.identifier : undefined,
      };
    });
  } catch (error) {
    console.error("Search Service API Error:", error);
    return [];
  }
};