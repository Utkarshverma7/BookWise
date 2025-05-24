// File: src/utils/constants.ts
import { FirebaseOptions } from 'firebase/app';

// IMPORTANT: For local development, you MUST replace the FIREBASE_CONFIG below
// with your actual Firebase project configuration.
// Get this from your Firebase Console: Project settings (gear icon) -> General -> Your apps -> Firebase SDK snippet -> Config.

export const FIREBASE_CONFIG: FirebaseOptions = {
  apiKey: "AIzaSyDZPrZ5VXwOsy9zUJYIEE-DcL_rSGXlWpI", // <-- REPLACE THIS
  authDomain: "bookwise-948aa.firebaseapp.com", // <-- REPLACE THIS
  projectId: "bookwise-948aa", // <-- REPLACE THIS
  storageBucket: "bookwise-948aa.firebasestorage.app", // <-- REPLACE THIS
  messagingSenderId: "844816014162", // <-- REPLACE THIS
  appId: "1:844816014162:web:2b1329dea5c05a170e788b", // <-- REPLACE THIS (e.g., "1:1234567890:web:abcdef123456")
  // measurementId: "G-XXXXXXXXXX" // Uncomment and replace if you use Google Analytics
};

// For local development, you can set a simple string for APP_ID.
// In the Canvas environment, this would be provided automatically.
export const APP_ID: string = 'your-bookspot-local-app-id';

// For local development, you typically don't need an initial auth token
// unless you have a specific custom authentication flow.
// The app will try to sign in anonymously if this is null.
export const INITIAL_AUTH_TOKEN: string | null = null;
