import React, { memo, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';

/* =====================================================
   CONFIG BY TYPE
===================================================== */
const TAGLINE_CONFIG = {
  professional: {
    label: 'Professional Tagline',
    placeholder: 'Short line describing your profession',
    maxLength: 100,
  },

  business: {
    label: 'Business Tagline',
    placeholder: 'Short line describing your business',
    maxLength: 120,
  },

  default: {
    label: 'Tagline',
    placeholder: 'Short line that describes you or your work',
    maxLength: 100,
  },
};

/* =====================================================
   COMPONENT (PROPS UNCHANGED)
===================================================== */
const TaglineInput = ({
  tagline = '',
  setTagline,
  type = 'professional', // professional | business
}) => {
  const config = TAGLINE_CONFIG[type] || TAGLINE_CONFIG.default;

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
      <Text style={styles.label}>{config.label}</Text>

      <TextInput
        style={styles.input}
        placeholder={config.placeholder}
        placeholderTextColor="#999"
        multiline
        maxLength={config.maxLength}
        value={tagline}
        onChangeText={handleChange}
        textAlignVertical="top"
        returnKeyType="done"
        blurOnSubmit
        accessibilityLabel={`${config.label} input`}
        accessibilityHint={`Enter a short tagline, up to ${config.maxLength} characters`}
      />

      <Text style={styles.charCount}>
        {config.maxLength - tagline.length} characters left
      </Text>
    </View>
  );
};

export default memo(TaglineInput);

/* =====================================================
   STYLES
===================================================== */
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
    minHeight: 64,
  },

  charCount: {
    textAlign: 'right',
    marginTop: 6,
    fontSize: 12,
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },
});
