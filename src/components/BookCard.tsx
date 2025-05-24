// File: src/components/BookCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Book } from '../types'; // Import the Book interface

interface BookCardProps {
  book: Book;
  onPress: (book: Book) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 30; // Roughly two cards per row with padding

const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => {
  return (
    <TouchableOpacity style={bookCardStyles.card} onPress={() => onPress(book)}>
      <Image
        source={{ uri: book.cover }}
        style={bookCardStyles.cover}
        onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
      />
      <Text style={bookCardStyles.title} numberOfLines={1}>{book.title}</Text>
      <Text style={bookCardStyles.author} numberOfLines={1}>{book.author}</Text>
    </TouchableOpacity>
  );
};

const bookCardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: cardWidth,
    marginRight: 12,
    marginBottom: 12,
    alignItems: 'center',
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#e2e8f0',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
    textAlign: 'center',
  },
  author: {
    fontSize: 12,
    color: '#737373',
    textAlign: 'center',
  },
});

export default BookCard;
