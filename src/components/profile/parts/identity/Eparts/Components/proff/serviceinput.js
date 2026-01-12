import React, { memo, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

/* ----------------------------------
   CONSTANTS
----------------------------------- */
const MAX_CHAR = 300;

/* ----------------------------------
   COMPONENT
----------------------------------- */
const ServicesInput = ({ value, onChange }) => {
  const handleChange = useCallback(
    text => {
      if (text.length <= MAX_CHAR) {
        onChange(text);
      }
    },
    [onChange],
  );

  const remaining = MAX_CHAR - (value?.length || 0);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Services Offered</Text>

      <TextInput
        style={[styles.input, styles.textarea]}
        value={value}
        onChangeText={handleChange}
        placeholder="e.g. Plumbing services, Wedding photography, Legal consulting, Software development..."
        placeholderTextColor="#999"
        multiline
        textAlignVertical="top"
        maxLength={MAX_CHAR}
      />

      <Text style={styles.charCount}>{remaining} characters left</Text>
    </View>
  );
};

export default memo(ServicesInput);

/* ----------------------------------
   STYLES
----------------------------------- */
const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
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

  textarea: {
    height: 100,
  },

  charCount: {
    textAlign: 'right',
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
});
