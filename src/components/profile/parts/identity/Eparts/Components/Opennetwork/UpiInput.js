import React, { useMemo } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function UpiInput({ upiId, setUpiId }) {
  const isValidUpi = useMemo(() => {
    if (!upiId) return true;
    return /^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upiId);
  }, [upiId]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>UPI ID</Text>

      <TextInput
        style={[styles.input, !isValidUpi && styles.errorInput]}
        placeholder="Enter your UPI ID (e.g. name@bank)"
        placeholderTextColor="#999"
        value={upiId}
        onChangeText={setUpiId}
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="done"
      />

      {!isValidUpi && (
        <Text style={styles.errorText}>Please enter a valid UPI ID</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    width: '100%',
  },
  label: {
    fontSize: 13,
    color: '#555',
    marginLeft: 5,
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  input: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 15,
    color: '#222',
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  errorInput: {
    borderColor: '#ff4d4f',
  },
  errorText: {
    marginTop: 4,
    marginLeft: 6,
    fontSize: 12,
    color: '#ff4d4f',
    fontFamily: 'Poppins-Regular',
  },
});
