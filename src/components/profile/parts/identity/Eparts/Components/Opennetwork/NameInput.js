import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function NameInput({ name, setName }) {
  return (
    <View style={styles.inputSection}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        returnKeyType="done"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputSection: {
    marginBottom: 12, // slightly increased for better breathing room
  },
  label: {
    fontSize: 13, // slightly smaller, more elegant for labels
    color: '#555',
    marginBottom: 4,
    marginLeft: 5,
    fontFamily: 'Poppins-SemiBold', // SemiBold is smoother for labels
  },
  input: {
    backgroundColor: '#f5f5f59a',
    paddingVertical: 12, // slightly taller input for touch comfort
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 15,
    color: '#222',
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#ddd', // subtle border for better definition
  },
});
