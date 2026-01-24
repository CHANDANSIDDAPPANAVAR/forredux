import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EventTypeChips = ({ types = [] }) => {
  if (!Array.isArray(types) || types.length === 0) return null;

  return (
    <View style={styles.container}>
      {types.map((item, index) => (
        <View key={`${item}-${index}`} style={styles.chip}>
          <Text style={styles.text}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

export default memo(EventTypeChips);

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6', // neutral chip
  },
  text: {
    fontSize: 12,
    color: '#374151',
    fontFamily: 'Poppins-Regular',
  },
});
