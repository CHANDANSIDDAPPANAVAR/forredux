import React, { memo, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

/* ----------------------------------
   COMPONENT
----------------------------------- */
const CompanyBusinessInfo = ({ companyName, setCompanyName }) => {
  const handleChange = useCallback(
    text => {
      setCompanyName(text);
    },
    [setCompanyName],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Company, Business, or Institute Name</Text>

      <TextInput
        style={styles.input}
        value={companyName}
        onChangeText={handleChange}
        placeholder="e.g. MedCare Hospital, LegalHub LLP..."
        placeholderTextColor="#999"
        returnKeyType="done"
      />
    </View>
  );
};

export default memo(CompanyBusinessInfo);

/* ----------------------------------
   STYLES
----------------------------------- */
const styles = StyleSheet.create({
  container: {
    marginBottom: 6,
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
});
