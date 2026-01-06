import React from 'react';
import { StyleSheet, Text } from 'react-native';

const SectionHeading = ({ title, style }) => {
  return <Text style={[styles.heading, style]}>{title}</Text>;
};

export default SectionHeading;

const styles = StyleSheet.create({
  heading: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    backgroundColor: '#f5f5f5',
    marginTop: 5,
    alignSelf: 'center',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
