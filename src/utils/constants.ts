// File: src/utils/constants.ts
import { FirebaseOptions } from 'firebase/app';

// These values are automatically provided by the Canvas environment.
// DO NOT modify these or add API keys here directly.
export const APP_ID: string = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
export const FIREBASE_CONFIG: FirebaseOptions = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
export const INITIAL_AUTH_TOKEN: string | null = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
