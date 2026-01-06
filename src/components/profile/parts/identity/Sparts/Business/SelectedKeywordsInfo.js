import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

/* ----------------------------------
   UTILS
----------------------------------- */
const capitalizeFirst = text => {
  if (typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const safeArray = value => (Array.isArray(value) ? value : []);

/* ----------------------------------
   COMPONENT
----------------------------------- */
const SelectedKeywordsInfo = ({ keywords }) => {
  const formattedKeywords = useMemo(() => {
    return safeArray(keywords)
      .filter(k => typeof k === 'string' && k.trim())
      .map(k => capitalizeFirst(k.trim()));
  }, [keywords]);

  /* ❌ Render nothing if no valid keywords */
  if (formattedKeywords.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Keywords people use to find you</Text>

      <View style={styles.pillContainer}>
        {formattedKeywords.map((keyword, index) => (
          <View key={`${keyword}-${index}`} style={styles.pill}>
            <Text style={styles.pillText}>{keyword}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default memo(SelectedKeywordsInfo);

/* ----------------------------------
   STYLES
----------------------------------- */
const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    marginBottom: 48,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
  },

  heading: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 14,
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
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: 'center',

    // Android shadow
    elevation: 2,

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  pillText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#1E3A8A',
  },
});
