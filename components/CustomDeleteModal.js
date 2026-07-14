import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CustomDeleteModal({ visible, onClose, onWaste, onConsume }) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>Remove Item?</Text>
          <Text style={styles.message}>Was it wasted or eaten?</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#FF3800' }]} 
              onPress={onWaste}
            >
              <Text style={styles.buttonText}>🗑️ Wasted</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: 'rgba(98, 159, 85, 1)' }]} 
              onPress={onConsume}
            >
              <Text style={styles.buttonText}>🍽️ Eaten</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.cancelButton, {backgroundColor: '#EAEAEA'}]} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontFamily: 'NunitoBold',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
     borderRadius: 8,
  },
  cancelButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
});