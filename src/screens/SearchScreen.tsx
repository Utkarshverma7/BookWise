// File: src/screens/SearchScreen.tsx
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { collection, doc, setDoc } from 'firebase/firestore';
import { AppContext } from '../../App';
import { Book } from '../types'; // Import Book interface

import BookCard from '../components';
import BookDetailModal from '../components/BookDetailModal';
import { ALL_BOOKS } from '../utils/bookData';

const SearchScreen: React.FC = () => {
  const appContext = useContext(AppContext);

  // Check if appContext is null
  if (!appContext) {
    return (
      <View style={searchScreenStyles.loadingContainer}>
        <Text style={searchScreenStyles.loadingText}>Loading app context...</Text>
      </View>
    );
  }

  const { db, userId, APP_ID } = appContext;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [noResults, setNoResults] = useState<boolean>(false);

  const performSearch = () => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setNoResults(false);
      return;
    }
    const results = ALL_BOOKS.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
    setNoResults(results.length === 0);
  };

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
    <View style={searchScreenStyles.screenPadding}>
      <Text style={searchScreenStyles.pageTitle}>Search Books</Text>
      <View style={searchScreenStyles.searchBarContainer}>
        <TextInput
          style={searchScreenStyles.searchInput}
          placeholder="Search by title or author..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={performSearch}
        />
        <TouchableOpacity style={searchScreenStyles.searchButton} onPress={performSearch}>
          <Text style={searchScreenStyles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {noResults ? (
        <Text style={searchScreenStyles.emptyMessage}>No books found matching your search.</Text>
      ) : (
        <View style={searchScreenStyles.bookGrid}>
          {searchResults.map(book => (
            <BookCard key={book.id} book={book} onPress={showBookDetailModal} />
          ))}
        </View>
      )}

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

const searchScreenStyles = StyleSheet.create({
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
  searchBarContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#737373',
    textAlign: 'center',
    marginTop: 10,
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

export default SearchScreen;
