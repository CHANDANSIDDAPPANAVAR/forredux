import React, { memo, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

/* ----------------------------------
   UTILS
----------------------------------- */
const sanitizeExperience = value => {
  // allow digits + one decimal point
  return value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
};

/* ----------------------------------
   COMPONENT
----------------------------------- */
const ExperienceInput = ({ value, onChange }) => {
  const handleChange = useCallback(
    text => {
      onChange(sanitizeExperience(text));
    },
    [onChange],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Years of Experience</Text>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleChange}
        placeholder="e.g. 0.4 or 2"
        placeholderTextColor="#999"
        keyboardType="decimal-pad"
        returnKeyType="done"
        maxLength={5}
      />
    </View>
  );
};

export default memo(ExperienceInput);

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
    marginBottom: 4,
    marginLeft: 5,
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
});
