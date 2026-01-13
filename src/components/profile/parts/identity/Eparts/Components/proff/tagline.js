import React, { memo, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';

const MAX_LENGTH = 100;

const TaglineInput = ({ tagline = '', setTagline }) => {
  const handleChange = useCallback(
    text => {
      // normalize spaces (production-safe)
      const normalized = text.replace(/\s+/g, ' ');
      setTagline(normalized);
    },
    [setTagline],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tagline</Text>

      <TextInput
        style={styles.input}
        placeholder="Short line that describes you or your work"
        placeholderTextColor="#999"
        multiline
        maxLength={MAX_LENGTH}
        value={tagline}
        onChangeText={handleChange}
        textAlignVertical="top"
        returnKeyType="done"
        blurOnSubmit={true}
        accessibilityLabel="Tagline input"
        accessibilityHint="Enter a short tagline, up to 100 characters"
      />

      <Text style={styles.charCount}>
        {MAX_LENGTH - tagline.length} characters left
      </Text>
    </View>
  );
};

export default memo(TaglineInput);

/* ----------------------------------
   STYLES
----------------------------------- */
const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
    marginLeft: 5,
    fontFamily: 'Poppins-SemiBold',
  },

  input: {
    backgroundColor: '#f5f5f5',
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 15,
    color: '#222',
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 64, // stable height across platforms
  },

  charCount: {
    textAlign: 'right',
    marginTop: 6,
    fontSize: 12,
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },
});
