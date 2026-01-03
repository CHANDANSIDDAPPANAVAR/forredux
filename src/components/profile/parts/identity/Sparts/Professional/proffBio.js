import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProffBio = ({ bio }) => {
  if (!bio) return null;

  return (
    <View style={styles.bioCard}>
      <Text style={styles.bioText}>{bio}</Text>
    </View>
  );
};

export default React.memo(ProffBio);

const styles = StyleSheet.create({
  bioCard: {
    backgroundColor: '#ffffffff',
    borderRadius: 14,
    padding: 14,
    marginVertical: 15,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  bioText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#374151',
    lineHeight: 21,
    textAlign: 'center',
  },
});
