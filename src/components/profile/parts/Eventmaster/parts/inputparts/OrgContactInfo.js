import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const OrgContactInfo = ({
  phoneNumber,
  setPhoneNumber,
  altPhoneNumber,
  setAltPhoneNumber,
  email,
  setEmail,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Contact Information</Text>
      <Text style={styles.sectionHelper}>
        This information will be visible to attendees for support or queries
      </Text>

      {/* Phone */}
      <Text style={styles.label}>
        Phone Number <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="e.g. +91 98765 43210"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
      />

      {/* Alternate Phone */}
      <Text style={styles.label}>
        Alternate Phone <Text style={styles.optional}>(Optional)</Text>
      </Text>
      <TextInput
        style={styles.input}
        value={altPhoneNumber}
        onChangeText={setAltPhoneNumber}
        placeholder="Secondary contact number"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
      />

      {/* Email */}
      <Text style={styles.label}>
        Email Address <Text style={styles.optional}>(Optional)</Text>
      </Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="e.g. contact@example.com"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
      />
    </View>
  );
};

export default OrgContactInfo;

/* =====================================================
   STYLES
===================================================== */
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#111',
    marginLeft: 4,
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  sectionHelper: {
    fontSize: 12,
    color: '#777',
    marginLeft: 4,
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
  },
  label: {
    fontSize: 13,
    color: '#555',
    marginLeft: 4,
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  required: {
    color: '#EF4444',
  },
  optional: {
    fontSize: 11,
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },
  input: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 15,
    color: '#222',
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
});
