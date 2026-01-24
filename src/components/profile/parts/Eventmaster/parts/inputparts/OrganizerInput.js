import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const OrganizerInput = ({ organizerName, setOrganizerName }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Organizer / Host <Text style={styles.required}>*</Text>
      </Text>
      <Text style={styles.helper}>
        Name of the person, group, or organization hosting this event
      </Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Sharma Family, TechCorp, Event Committee"
        placeholderTextColor="#999"
        value={organizerName}
        onChangeText={setOrganizerName}
        returnKeyType="done"
      />
    </View>
  );
};

export default OrganizerInput;

/* =====================================================
   STYLES
===================================================== */
const styles = StyleSheet.create({
  container: {
    marginTop: 22,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#111',
    marginLeft: 4,
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  required: {
    color: '#EF4444',
  },
  helper: {
    fontSize: 12,
    color: '#777',
    marginLeft: 4,
    marginBottom: 8,
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
  },
});
