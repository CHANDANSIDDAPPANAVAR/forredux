import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.maincont}>
      <Image
        source={require('../../assets/logo/TTyouconnectry.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text>Connect, Explore, Grow!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  maincont: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 80,
  },
});
