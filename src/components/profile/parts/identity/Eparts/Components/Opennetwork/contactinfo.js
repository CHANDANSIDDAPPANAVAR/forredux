import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const Field = ({ label, note, value, onChange, placeholder, keyboardType }) => (
  <View style={styles.field}>
    <Text style={styles.label}>
      {label}
      {note && <Text style={styles.note}> {note}</Text>}
    </Text>

    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#9a9a9a"
      keyboardType={keyboardType}
      autoCapitalize="none"
    />
  </View>
);

export default function BasicContactInfo({
  phoneNumber,
  setPhoneNumber,
  emergencyNumber,
  setEmergencyNumber,
  email,
  setEmail,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Contact Information</Text>

      <Field
        label="Phone Number"
        value={phoneNumber}
        onChange={setPhoneNumber}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
      />

      <Field
        label="Emergency Contact"
        note="(Visible even if your account is private)"
        value={emergencyNumber}
        onChange={setEmergencyNumber}
        placeholder="Emergency contact number"
        keyboardType="phone-pad"
      />

      <Field
        label="Email Address"
        value={email}
        onChange={setEmail}
        placeholder="Enter your email address"
        keyboardType="email-address"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    marginLeft: 4,
    fontFamily: 'Poppins-SemiBold',
  },

  field: {
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    marginLeft: 4,
    fontFamily: 'Poppins-SemiBold',
  },

  note: {
    fontSize: 11,
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },

  input: {
    backgroundColor: '#f6f6f6',
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 15,
    color: '#222',
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
