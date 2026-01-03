import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const capitalize = text =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : '';

const BasicInfo = ({ name, bio, location }) => {
  if (!name && !bio && !location) return null;

  return (
    <View style={styles.container}>
      {/* NAME */}
      {name && (
        <Text style={styles.name} numberOfLines={2}>
          {capitalize(name)}
        </Text>
      )}

      {/* LOCATION */}
      {location && (
        <Text style={styles.location} numberOfLines={1}>
          📍 {capitalize(location)}
        </Text>
      )}

      {/* BIO */}
      {bio && (
        <View style={styles.bioContainer}>
          <Text style={styles.bio} numberOfLines={4}>
            {bio}
          </Text>
        </View>
      )}
    </View>
  );
};

export default React.memo(BasicInfo);
const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    alignItems: 'center',
  },

  /* NAME */
  name: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },

  /* LOCATION */
  location: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
    marginBottom: 10,
  },

  /* BIO */
  bioContainer: {
    margin: 6,
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },

  bio: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 22,
  },
});
