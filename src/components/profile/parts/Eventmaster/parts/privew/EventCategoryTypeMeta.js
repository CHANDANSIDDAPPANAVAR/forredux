import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Dot = () => <Text style={styles.dot}> • </Text>;

const EventCategoryTypeMeta = ({ category = [], types = [], mode }) => {
  const cat = category?.[0];
  const safeTypes = Array.isArray(types) ? types : [];

  if (!cat && safeTypes.length === 0 && !mode) return null;

  return (
    <View style={styles.container}>
      {cat && <Text style={styles.category}>{cat}</Text>}

      {cat && safeTypes.length > 0 && <Dot />}

      {safeTypes.map((t, i) => (
        <React.Fragment key={t}>
          <Text style={styles.type}>{t}</Text>
          {i < safeTypes.length - 1 && <Dot />}
        </React.Fragment>
      ))}

      {(cat || safeTypes.length > 0) && mode && <Dot />}

      {mode && <Text style={styles.mode}>{mode}</Text>}
    </View>
  );
};

export default memo(EventCategoryTypeMeta);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 6,
  },

  dot: {
    color: '#9ca3af',
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
  },

  category: {
    fontSize: 13,
    color: '#111827',
    fontFamily: 'Poppins-SemiBold',
  },

  type: {
    fontSize: 13,
    color: '#4b5563',
    fontFamily: 'Poppins-Medium',
  },

  mode: {
    fontSize: 13,
    color: '#2563eb', // subtle highlight
    fontFamily: 'Poppins-Medium',
  },
});
