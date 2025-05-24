// File: src/components/ScanBookModal.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { Book } from '../types'; // Import Book interface

interface ScanBookModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddBook: (book: Book) => void;
}

const ScanBookModal: React.FC<ScanBookModalProps> = ({ isVisible, onClose, onAddBook }) => {
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [isbn, setIsbn] = useState<string>('');

  const handleAddBook = () => {
    if (!title.trim() || !author.trim()) {
      Alert.alert("Missing Info", "Please enter at least a title and author.");
      return;
    }

    // Create a new mock book object
    const newBook: Book = {
      id: String(Date.now()), // Simple unique ID for mock data
      title: title,
      author: author,
      isbn: isbn,
      genre: 'Unknown', // Default genre for manually added books
      cover: `https://placehold.co/300x450/CCCCCC/FFFFFF?text=${encodeURIComponent(title.substring(0, Math.min(title.length, 15)))}`,
      summary: "No summary available for this newly added book.",
      reviews: [],
      prices: {"Manual Entry": "N/A"},
      published: new Date().toISOString().split('T')[0] // Current date
    };
    
    onAddBook(newBook); // Pass the new book object to the parent
    setTitle('');
    setAuthor('');
    setIsbn('');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={scanBookModalStyles.modalOverlay}>
        <View style={scanBookModalStyles.modalContent}>
          <View style={scanBookModalStyles.modalHeader}>
            <Text style={scanBookModalStyles.modalTitle}>Scan or Add Book</Text>
            <TouchableOpacity onPress={onClose} style={scanBookModalStyles.closeButton}>
              <Text style={scanBookModalStyles.closeButtonText}>&times;</Text>
            </TouchableOpacity>
          </View>
          <Text style={scanBookModalStyles.modalSubtitle}>Enter book details manually or simulate scanning.</Text>
          <View style={scanBookModalStyles.inputGroup}>
            <Text style={scanBookModalStyles.inputLabel}>Book Title</Text>
            <TextInput style={scanBookModalStyles.textInput} value={title} onChangeText={setTitle} placeholder="e.g., The Great Gatsby" />
          </View>
          <View style={scanBookModalStyles.inputGroup}>
            <Text style={scanBookModalStyles.inputLabel}>Author</Text>
            <TextInput style={scanBookModalStyles.textInput} value={author} onChangeText={setAuthor} placeholder="e.g., F. Scott Fitzgerald" />
          </View>
          <View style={scanBookModalStyles.inputGroup}>
            <Text style={scanBookModalStyles.inputLabel}>ISBN (Optional)</Text>
            <TextInput style={scanBookModalStyles.textInput} value={isbn} onChangeText={setIsbn} placeholder="e.g., 978-0743273565" keyboardType="numeric" />
          </View>
          <Text style={scanBookModalStyles.orText}>OR</Text>
          <TouchableOpacity style={scanBookModalStyles.secondaryButton}>
            <Text style={scanBookModalStyles.secondaryButtonText}>Upload Book Cover (Simulated)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[scanBookModalStyles.primaryButton, scanBookModalStyles.mt2]} onPress={handleAddBook}>
            <Text style={scanBookModalStyles.primaryButtonText}>Add Book to My Shelf</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const scanBookModalStyles = StyleSheet.create({
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
  modalSubtitle: {
    fontSize: 14,
    color: '#525252',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#404040',
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d4d4d4',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 14,
    color: '#737373',
  },
  secondaryButton: {
    backgroundColor: '#e5e7eb', // neutral-200
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  secondaryButtonText: {
    color: '#404040', // neutral-700
    fontSize: 16,
    fontWeight: '600',
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
  mt2: {
    marginTop: 8,
  },
});

export default ScanBookModal;
