import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const VenueInput = ({ venueName, setVenueName }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Venue Name <Text style={styles.required}>*</Text>
      </Text>
      <Text style={styles.helper}>
        Enter the place where the event will be held
      </Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Royal Palace Hall"
        placeholderTextColor="#999"
        value={venueName}
        onChangeText={setVenueName}
        returnKeyType="done"
        autoCorrect={false}
        accessibilityLabel="Event venue name"
      />
    </View>
  );
};

export default VenueInput;

/* =====================================================
   STYLES
===================================================== */
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#111',
    marginBottom: 4,
    marginLeft: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  required: {
    color: '#EF4444',
  },
  helper: {
    fontSize: 12,
    color: '#777',
    marginBottom: 8,
    marginLeft: 4,
    fontFamily: 'Poppins-Regular',
  },
  input: {
    backgroundColor: '#f5f5f5',
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
