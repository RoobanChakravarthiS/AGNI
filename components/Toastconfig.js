import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ToastConfig = {
  success: ({ text1, text2 }) => (
    <View style={[styles.toastContainer, styles.successToast]}>
      <Text style={styles.toastTitle}>{text1}</Text>
      {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View style={[styles.toastContainer, styles.errorToast]}>
      <Text style={styles.toastTitle}>{text1}</Text>
      {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
    </View>
  ),
  info: ({ text1, text2 }) => (
    <View style={[styles.toastContainer, styles.infoToast]}>
      <Text style={styles.toastTitle}>{text1}</Text>
      {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 10,
  },
  successToast: {
    backgroundColor: '#4CAF50', // Green for success
  },
  errorToast: {
    backgroundColor: '#F44336', // Red for error
  },
  infoToast: {
    backgroundColor: '#2196F3', // Blue for info
  },
  toastTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  toastMessage: {
    color: '#f5f5f5',
    fontSize: 14,
    fontWeight: '400',
  },
});

export { ToastConfig };
