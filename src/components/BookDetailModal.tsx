// File: src/components/BookDetailModal.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { Book } from '../types'; // Import the Book interface

interface BookDetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  book: Book | null; // Allow book to be null initially
  onAddToBookshelf: (book: Book) => Promise<void>;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ isVisible, onClose, book, onAddToBookshelf }) => {
  if (!book) return null; // Render nothing if no book is passed

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={bookDetailModalStyles.modalOverlay}>
        <View style={bookDetailModalStyles.modalContent}>
          <View style={bookDetailModalStyles.modalHeader}>
            <Text style={bookDetailModalStyles.modalTitle}>{book.title}</Text>
            <TouchableOpacity onPress={onClose} style={bookDetailModalStyles.closeButton}>
              <Text style={bookDetailModalStyles.closeButtonText}>&times;</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={bookDetailModalStyles.scrollContent}>
            <View style={bookDetailModalStyles.topSection}>
              <Image
                source={{ uri: book.cover }}
                style={bookDetailModalStyles.cover}
                onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
              />
              <View style={bookDetailModalStyles.info}>
                <Text style={bookDetailModalStyles.author}>By: {book.author}</Text>
                <Text style={bookDetailModalStyles.genre}>Genre: {book.genre}</Text>
                <Text style={bookDetailModalStyles.published}>Published: {book.published}</Text>
              </View>
            </View>
            <Text style={bookDetailModalStyles.sectionTitle}>Summary:</Text>
            <Text style={bookDetailModalStyles.text}>{book.summary}</Text>

            <Text style={bookDetailModalStyles.sectionTitle}>Reviews:</Text>
            {book.reviews && book.reviews.length > 0 ? (
              book.reviews.map((review, index) => (
                <Text key={index} style={bookDetailModalStyles.text}>
                  <Text style={bookDetailModalStyles.reviewUser}>{review.user}:</Text> {review.text} ({review.rating}/5)
                </Text>
              ))
            ) : (
              <Text style={bookDetailModalStyles.text}>No reviews yet.</Text>
            )}

            <Text style={bookDetailModalStyles.sectionTitle}>Where to Buy:</Text>
            {book.prices && Object.keys(book.prices).length > 0 ? (
              Object.entries(book.prices).map(([retailer, price]) => (
                <View key={retailer} style={bookDetailModalStyles.priceRow}>
                  <Text style={bookDetailModalStyles.text}>{retailer}: {price}</Text>
                  <TouchableOpacity
                    style={bookDetailModalStyles.buyNowButton}
                    onPress={() => Alert.alert("Redirecting", `Simulating redirect to ${retailer} to buy ${book.title}`)}
                  >
                    <Text style={bookDetailModalStyles.buyNowButtonText}>Buy Now</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={bookDetailModalStyles.text}>Price information not available.</Text>
            )}

            <View style={bookDetailModalStyles.actionButtons}>
              <TouchableOpacity style={bookDetailModalStyles.primaryButton} onPress={() => onAddToBookshelf(book)}>
                <Text style={bookDetailModalStyles.primaryButtonText}>Add to Bookshelf</Text>
              </TouchableOpacity>
              <TouchableOpacity style={bookDetailModalStyles.secondaryButton}>
                <Text style={bookDetailModalStyles.secondaryButtonText}>Add to Wishlist</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const bookDetailModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 600,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#262626',
    flexShrink: 1,
    paddingRight: 10,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#737373',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  topSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  cover: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 20,
    backgroundColor: '#e2e8f0',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  author: {
    fontSize: 18,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 4,
  },
  genre: {
    fontSize: 14,
    color: '#525252',
    marginBottom: 4,
  },
  published: {
    fontSize: 14,
    color: '#525252',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#262626',
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#404040',
    lineHeight: 20,
    marginBottom: 4,
  },
  reviewUser: {
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  buyNowButton: {
    backgroundColor: '#0ea5e9', // sky-500
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buyNowButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-around',
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
  secondaryButton: {
    backgroundColor: '#e5e7eb', // neutral-200
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#404040', // neutral-700
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookDetailModal;
