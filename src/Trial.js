import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HomeMain from './components/Home/HomeMain';

const Trial = () => {
  return (
    <View style={styles.container}>
      <HomeMain />
    </View>
  );
};

export default Trial;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(203, 203, 203, 1)',
  },
});
