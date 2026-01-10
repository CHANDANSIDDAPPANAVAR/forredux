import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

export default function LocationInput({Namelocation, setNameLocation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="City / District / State"
        placeholderTextColor="#999"
        value={Namelocation}
        onChangeText={setNameLocation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12, // more breathing space
  },
  label: {
    fontSize: 13, // refined for cleaner form labels
    color: '#555',
    marginBottom: 4,
    marginLeft: 5,
    fontFamily: 'Poppins-SemiBold', // softer than Bold for labels
  },
  input: {
    backgroundColor: '#f5f5f5', // softer modern background
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 15,
    color: '#222',
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
