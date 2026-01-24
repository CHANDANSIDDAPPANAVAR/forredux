import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EventCategoryBadge = ({ category = [] }) => {
  const value = Array.isArray(category) ? category[0] : category;
  if (!value) return null;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
};

export default memo(EventCategoryBadge);

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#eef2ff', // soft premium blue
  },
  text: {
    fontSize: 13,
    color: '#1e3a8a',
    fontFamily: 'Poppins-Medium',
  },
});
