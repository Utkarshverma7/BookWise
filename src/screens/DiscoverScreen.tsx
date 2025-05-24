// File: src/screens/DiscoverScreen.tsx
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { collection, doc, setDoc } from 'firebase/firestore';
import { AppContext } from '../../App';
import { Book } from '../types'; // Import Book interface

import BookCard from '../components/BookCard';
import BookDetailModal from '../components/BookDetailModal';
import { ALL_BOOKS } from '../utils/bookData';

const DiscoverScreen: React.FC = () => {
  const appContext = useContext(AppContext);

  // Check if appContext is null
  if (!appContext) {
    return (
      <View style={discoverScreenStyles.loadingContainer}>
        <Text style={discoverScreenStyles.loadingText}>Loading app context...</Text>
      </View>
    );
  }

  const { db, userId, APP_ID } = appContext;
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(ALL_BOOKS);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  const genres = ['All', ...new Set(ALL_BOOKS.map(book => book.genre))];

  useEffect(() => {
    if (selectedGenre === 'All') {
      setFilteredBooks(ALL_BOOKS);
    } else {
      setFilteredBooks(ALL_BOOKS.filter(book => book.genre === selectedGenre));
    }
  }, [selectedGenre]);

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
    try {
      await setDoc(doc(bookshelfRef, bookToAdd.id), bookToAdd);
      Alert.alert("Success", `${bookToAdd.title} added to your bookshelf!`);
    } catch (error) {
      console.error("Error adding book to bookshelf:", error);
      Alert.alert("Error", "Failed to add book to bookshelf.");
    }
  };

  return (
    <View style={discoverScreenStyles.screenPadding}>
      <Text style={discoverScreenStyles.pageTitle}>Discover New Reads</Text>
      <View style={discoverScreenStyles.genreFilterContainer}>
        <Text style={discoverScreenStyles.genreFilterTitle}>Filter by Genre:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={discoverScreenStyles.genreFilterScroll}>
          {genres.map(genre => (
            <TouchableOpacity
              key={genre}
              style={[discoverScreenStyles.genreButton, selectedGenre === genre && discoverScreenStyles.genreButtonActive]}
              onPress={() => setSelectedGenre(genre)}
            >
              <Text style={[discoverScreenStyles.genreButtonText, selectedGenre === genre && discoverScreenStyles.genreButtonTextActive]}>{genre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={discoverScreenStyles.bookGrid}>
        {filteredBooks.map(book => (
          <BookCard key={book.id} book={book} onPress={showBookDetailModal} />
        ))}
      </View>

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

const discoverScreenStyles = StyleSheet.create({
  screenPadding: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 24,
  },
  genreFilterContainer: {
    marginBottom: 24,
  },
  genreFilterTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#525252',
    marginBottom: 8,
  },
  genreFilterScroll: {
    paddingRight: 10,
  },
  genreButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e5e7eb', // neutral-200
    marginRight: 8,
  },
  genreButtonActive: {
    backgroundColor: '#e0f2fe', // sky-100
  },
  genreButtonText: {
    fontSize: 14,
    color: '#404040', // neutral-700
    fontWeight: '500',
  },
  genreButtonTextActive: {
    color: '#0369a1', // sky-700
    fontWeight: '600',
  },
  bookGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
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

export default DiscoverScreen;
