import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function NameInput({
  name,
  setName,
  label = 'Name', // fallback
  placeholder = 'Enter your name', // fallback
}) {
  return (
    <View style={styles.inputSection}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder={placeholder}
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
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
    marginLeft: 5,
    fontFamily: 'Poppins-SemiBold',
  },
  input: {
    backgroundColor: '#f5f5f59a',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 15,
    color: '#222',
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
