export interface Book {
  id: string;
  title: string;
  authors: string[];
  publisher: string;
  description: string;
  thumbnail?: string;
  isbn?: string;
}