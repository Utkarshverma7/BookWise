import React, { useState, useEffect, createContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, Firestore } from 'firebase/firestore';
import { Auth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';

// ... rest of your App.tsx code

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Import constants (for Firebase config and app ID)
import { FIREBASE_CONFIG, APP_ID, INITIAL_AUTH_TOKEN } from './src/utils/constants';
import { AppContextType } from './src/types'; // Import AppContextType

// Context for Firebase and User Data
export const AppContext = createContext<AppContextType | null>(null);

export default function App() {
  const [db, setDb] = useState<Firestore | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('Home'); // State for active navigation tab

  useEffect(() => {
    // Initialize Firebase
    if (!FIREBASE_CONFIG || Object.keys(FIREBASE_CONFIG).length === 0) {
      console.error("Firebase config is missing or empty. Please ensure FIREBASE_CONFIG is set in src/utils/constants.ts.");
      return;
    }

    try {
      const app = initializeApp(FIREBASE_CONFIG);
      const firestore = getFirestore(app);
      const firebaseAuth = initializeAuth(app);
      setDb(firestore);
      setAuth(firebaseAuth);

      // Sign in or listen to auth state changes
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
          setIsAuthReady(true);
        } else {
          // If no user, try to sign in anonymously with the provided token
          if (INITIAL_AUTH_TOKEN) {
            try {
              await signInWithCustomToken(firebaseAuth, INITIAL_AUTH_TOKEN);
            } catch (error) {
              console.error("Error signing in with custom token:", error);
              await signInAnonymously(firebaseAuth); // Fallback to anonymous
            }
          } else {
            await signInAnonymously(firebaseAuth); // Sign in anonymously if no token
          }
        }
      });

      return () => unsubscribe(); // Clean up auth listener
    } catch (error) {
      console.error("Firebase initialization failed:", error);
    }
  }, []);

  if (!isAuthReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading BookSpot...</Text>
        <Text style={styles.loadingSubText}>Setting up your reading space.</Text>
      </View>
    );
  }

  // Ensure context value is always an object matching AppContextType
  const appContextValue: AppContextType = {
    db,
    auth,
    userId,
    APP_ID,
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>BookSpot</Text>
          <View style={styles.navBar}>
            {['Home', 'Discover', 'Search', 'Profile'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.navItem, activeTab === tab && styles.navItemActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.navItemText, activeTab === tab && styles.navItemTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Main Content Area */}
        <ScrollView style={styles.contentArea}>
          {activeTab === 'Home' && <HomeScreen />}
          {activeTab === 'Discover' && <DiscoverScreen />}
          {activeTab === 'Search' && <SearchScreen />}
          {activeTab === 'Profile' && <ProfileScreen />}
        </ScrollView>
      </View>
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f4', // neutral-100
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f4',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#262626',
  },
  loadingSubText: {
    fontSize: 16,
    color: '#737373',
    marginTop: 8,
  },
  header: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0284c7', // sky-600
  },
  navBar: {
    flexDirection: 'row',
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  navItemActive: {
    backgroundColor: '#e0f2fe', // sky-100
  },
  navItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#525252', // neutral-600
  },
  navItemTextActive: {
    color: '#0369a1', // sky-700
    fontWeight: '600',
  },
  contentArea: {
    flex: 1,
    paddingVertical: 16,
  },
});
