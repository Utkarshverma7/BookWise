// File: src/screens/HomeScreen.tsx
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { AppContext } from '../../App'; // Adjust path as needed
import { Book } from '../types'; // Import Book interface

import BookCard from '../components/BookCard';
import ScanBookModal from '../components/ScanBookModal';
import BookDetailModal from '../components/BookDetailModal';
import { ALL_BOOKS } from '../utils/bookData'; // Import allBooks from bookData.ts

const HomeScreen: React.FC = () => {
  const appContext = useContext(AppContext);

  // Check if appContext is null (which it can be based on createContext(null))
  if (!appContext) {
    // Handle the case where context is not available, e.g., during loading or error
    return (
      <View style={homeScreenStyles.loadingContainer}>
        <Text style={homeScreenStyles.loadingText}>Loading app context...</Text>
      </View>
    );
  }

  const { db, userId, APP_ID } = appContext;
  const [myBookshelf, setMyBookshelf] = useState<Book[]>([]);
  const [suggestions, setSuggestions] = useState<Book[]>([]);
  const [isScanModalVisible, setScanModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!db || !userId) return;

    const bookshelfRef = collection(db, `artifacts/${APP_ID}/users/${userId}/myBookshelf`);
    const unsubscribe = onSnapshot(bookshelfRef, (snapshot) => {
      const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book)); // Type assertion
      setMyBookshelf(books);
      const currentShelfIds = new Set(books.map(b => b.id));
      const suggested = ALL_BOOKS.filter(b => !currentShelfIds.has(b.id)).slice(0, 5);
      setSuggestions(suggested);
    }, (error) => {
      console.error("Error fetching bookshelf:", error);
      Alert.alert("Error", "Failed to load your bookshelf.");
    });

    return () => unsubscribe();
  }, [db, userId, APP_ID]);

  const [isDetailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const showBookDetailModal = (book: Book) => {
    setSelectedBook(book);
    setDetailModalVisible(true);
  };

  const closeBookDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedBook(null);
  };

  const addToBookshelf = async (bookToAdd: Book) => {
    if (!db || !userId) {
      Alert.alert("Error", "User not authenticated or database not ready.");
      return;
    }

    const bookshelfRef = collection(db, `artifacts/${APP_ID}/users/${userId}/myBookshelf`);
    const existingBook = myBookshelf.find(b => b.id === bookToAdd.id);

    if (existingBook) {
      Alert.alert("Already Added", `${bookToAdd.title} is already on your bookshelf.`);
      return;
    }

    try {
      await setDoc(doc(bookshelfRef, bookToAdd.id), bookToAdd);
      Alert.alert("Success", `${bookToAdd.title} added to your bookshelf!`);
    } catch (error) {
      console.error("Error adding book to bookshelf:", error);
      Alert.alert("Error", "Failed to add book to bookshelf.");
    }
  };

  const handleAddBookFromModal = (newBook: Book) => {
    const bookExistsInAll = ALL_BOOKS.find(b => b.title === newBook.title && b.author === newBook.author);
    if (!bookExistsInAll) {
      ALL_BOOKS.push({ ...newBook, id: String(ALL_BOOKS.length + 1) }); // Add to mock master list if truly new
    }
    addToBookshelf(bookExistsInAll || { ...newBook, id: String(ALL_BOOKS.length + 1) });
  };

  return (
    <View style={homeScreenStyles.screenPadding}>
      <View style={homeScreenStyles.heroSection}>
        <Text style={homeScreenStyles.heroTitle}>Welcome to BookSpot!</Text>
        <Text style={homeScreenStyles.heroSubtitle}>Scan a book, get details, compare prices, and find your next favorite read.</Text>
        <TouchableOpacity style={homeScreenStyles.primaryButton} onPress={() => setScanModalVisible(true)}>
          <Text style={homeScreenStyles.primaryButtonText}>Scan/Add Book</Text>
        </TouchableOpacity>
      </View>

      <View style={homeScreenStyles.section}>
        <Text style={homeScreenStyles.sectionTitle}>My Bookshelf</Text>
        {myBookshelf.length === 0 ? (
          <Text style={homeScreenStyles.emptyMessage}>Your bookshelf is empty. Scan a book to add it!</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={homeScreenStyles.horizontalScroll}>
            {myBookshelf.map(book => (
              <BookCard key={book.id} book={book} onPress={showBookDetailModal} />
            ))}
          </ScrollView>
        )}
      </View>

      <View style={homeScreenStyles.section}>
        <Text style={homeScreenStyles.sectionTitle}>Suggested For You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={homeScreenStyles.horizontalScroll}>
          {suggestions.map(book => (
            <BookCard key={book.id} book={book} onPress={showBookDetailModal} />
          ))}
        </ScrollView>
      </View>

      <ScanBookModal
        isVisible={isScanModalVisible}
        onClose={() => setScanModalVisible(false)}
        onAddBook={handleAddBookFromModal}
      />

      {selectedBook && (
        <BookDetailModal
          isVisible={isDetailModalVisible}
          onClose={closeBookDetailModal}
          book={selectedBook}
          onAddToBookshelf={addToBookshelf}
        />
      )}
    </View>
  );
};

const homeScreenStyles = StyleSheet.create({
  screenPadding: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  heroSection: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#262626', // neutral-700
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#525252', // neutral-600
    marginBottom: 16,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#0ea5e9', // sky-500
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#262626', // neutral-700
    marginBottom: 16,
  },
  horizontalScroll: {
    paddingRight: 16,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#737373',
    textAlign: 'center',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#737373',
  },
});

export default HomeScreen;
