import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const capitalizeFirst = text => {
  if (!text) {
    return '';
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const CategoryExperienceInfo = ({ categories = [], experience = '' }) => {
  const formattedCategories = categories
    .filter(Boolean)
    .map(capitalizeFirst)
    .join(', ');

  const hasData = !!formattedCategories || !!experience;

  if (!hasData) {
    return null; // Don't render the component if no valid data
  }

  return (
    <View style={styles.container}>
      {!!formattedCategories && (
        <View style={styles.section}>
          <Text style={styles.highlightedValue}>{formattedCategories}</Text>
          <Text style={styles.label}>Expertise Areas</Text>
        </View>
      )}

      {!!experience && (
        <View style={styles.section}>
          <Text style={styles.highlightedValue}>
            {experience} {experience === '1' ? 'year' : 'years'}
          </Text>
          <Text style={styles.label}>Years of Experience</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 6,
    alignItems: 'center',
  },
  section: {
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    color: '#777',
    fontFamily: 'Poppins-Regular',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  highlightedValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#1a73e8',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default CategoryExperienceInfo;
