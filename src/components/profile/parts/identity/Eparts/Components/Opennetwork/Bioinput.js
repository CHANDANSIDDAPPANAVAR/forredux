import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

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
};

/* =====================================================
   COMPONENT (PROPS UNCHANGED)
===================================================== */
export default function BioInput({
  bio,
  setBio,
  type = 'person', // person | professional | business | service
}) {
  const config = BIO_CONFIG[type] || BIO_CONFIG.person;
  const remaining = config.maxLength - (bio?.length || 0);

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
        onChangeText={setBio}
      />

      <Text style={styles.charCount}>{remaining} characters left</Text>
    </View>
  );
}

/* =====================================================
   STYLES
===================================================== */
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
