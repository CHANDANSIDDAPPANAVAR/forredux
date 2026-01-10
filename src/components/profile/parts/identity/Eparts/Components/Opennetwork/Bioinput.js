import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const MAX_LENGTH = 200;

export default function BioInput({ bio, setBio }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Bio / About Me</Text>

      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Tell us about yourself"
        placeholderTextColor="#999"
        multiline
        numberOfLines={5}
        maxLength={MAX_LENGTH}
        value={bio}
        onChangeText={setBio}
      />

      <Text style={styles.charCount}>
        {MAX_LENGTH - (bio?.length || 0)} characters left
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    marginLeft: 5,
    fontFamily: 'Poppins-SemiBold',
  },

  input: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
    fontSize: 15,
    color: '#222',
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#ddd',
  },

  textarea: {
    height: 120,
    textAlignVertical: 'top',
  },

  charCount: {
    textAlign: 'right',
    marginTop: 6,
    fontSize: 12,
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },
});
