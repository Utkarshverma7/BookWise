// File: src/types.ts
// Centralized type definitions for the BookSpot app

import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

/**
 * Interface for a Book object.
 */
export interface Book {
    id: string;
    title: string;
    author: string;
    isbn?: string; // <--- ADD THIS LINE (or make it required if you prefer)
    genre: string;
    cover: string; // URL to the book cover image
    summary: string;
    reviews: { user: string; text: string; rating: number; }[];
    prices: { [retailer: string]: string; }; // e.g., { "Amazon": "$12.99" }
    published: string; // Date string, e.g., "YYYY-MM-DD"
  }

/**
 * Interface for the AppContext values.
 */
export interface AppContextType {
  db: Firestore | null;
  auth: Auth | null;
  userId: string | null;
  APP_ID: string;
}
