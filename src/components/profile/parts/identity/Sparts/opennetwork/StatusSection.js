import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatusSection = ({ status, fillone, filltwo }) => {
  if (!fillone && !filltwo) return null;

  const prefix = status === 'job' ? '💼' : status === 'studying' ? '🎓' : null;

  return (
    <View style={styles.container}>
      {fillone && (
        <Text style={styles.primary}>
          {prefix && <Text>{prefix} </Text>}
          {fillone}
        </Text>
      )}

      {filltwo && <Text style={styles.secondary}>{filltwo}</Text>}
    </View>
  );
};

export default React.memo(StatusSection);
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    alignItems: 'center',
  },

  primary: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#111827',
    textAlign: 'center',
  },

  secondary: {
    marginTop: 2,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
});
