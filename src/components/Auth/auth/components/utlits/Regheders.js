import React from 'react';
import {Image, View} from 'react-native';

const Regheader = () => {
  return (
    <View style={styles.Header}>
      <Image
        source={require('../assets/logo-ucblack.png')}
        style={styles.Logo}
      />
    </View>
  );
};

export default Regheader;

import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  Header: {
    backgroundColor: '#f5f5f5',
    height: 'auto',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Logo: {
    width: 150,
    height: 40,
    resizeMode: 'contain',
  },
});
