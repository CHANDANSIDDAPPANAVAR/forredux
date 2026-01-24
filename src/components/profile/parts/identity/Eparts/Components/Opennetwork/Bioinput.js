import React, { memo, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';

/* =====================================================
   CONFIG BY TYPE
===================================================== */
const BIO_CONFIG = {
  person: {
    label: 'Bio / About Me',
    placeholder: 'Tell us about yourself',
    maxLength: 200,
  },

  professional: {
    label: 'Professional Summary',
    placeholder: 'Briefly describe your professional experience',
    maxLength: 300,
  },

  business: {
    label: 'About Business',
    placeholder: 'Describe your business, vision, and offerings',
    maxLength: 400,
  },

  service: {
    label: 'Service Description',
    placeholder: 'Describe the services you provide',
    maxLength: 300,
  },

  /* ⭐ NEW: EVENT SUPPORT */
  event: {
    label: 'Event Description',
    placeholder:
      'Describe the event, what to expect, and any important details',
    maxLength: 500,
  },
};

/* =====================================================
   COMPONENT
===================================================== */
const BioInput = ({
  bio = '',
  setBio,
  type, // person | professional | business | service | event
}) => {
  const config = BIO_CONFIG[type] || BIO_CONFIG.person;
  const remaining = config.maxLength - bio.length;

  const handleChange = useCallback(
    text => {
      // normalize spaces (production-safe)
      const normalized = text.replace(/\s+/g, ' ');
      setBio(normalized);
    },
    [setBio],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{config.label}</Text>

      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder={config.placeholder}
        placeholderTextColor="#999"
        multiline
        numberOfLines={5}
        maxLength={config.maxLength}
        value={bio}
        onChangeText={handleChange}
        textAlignVertical="top"
        returnKeyType="done"
        blurOnSubmit
        accessibilityLabel={`${config.label} input`}
        accessibilityHint={`Enter up to ${config.maxLength} characters`}
      />

      <Text style={styles.charCount}>{remaining} characters left</Text>
    </View>
  );
};

export default memo(BioInput);

/* =====================================================
   STYLES
===================================================== */
const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
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
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 15,
    color: '#222',
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#ddd',
  },

  textarea: {
    minHeight: 120,
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
