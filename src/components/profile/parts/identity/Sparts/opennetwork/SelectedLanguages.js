import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const capitalizeFirst = text =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : '';

const SelectedLanguagesInfo = ({ languages }) => {
  const safeLanguages = Array.isArray(languages) ? languages : [];

  const formattedLanguages = safeLanguages.filter(Boolean).map(capitalizeFirst);

  if (formattedLanguages.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Languages</Text>

      <View style={styles.pillContainer}>
        {formattedLanguages.map((lang, index) => (
          <View key={index} style={styles.pill}>
            <Text style={styles.pillText}>{lang}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default React.memo(SelectedLanguagesInfo);
const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    padding: 6,
  },

  title: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },

  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },

  pill: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },

  pillText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#3730A3',
    letterSpacing: 0.2,
  },
});
