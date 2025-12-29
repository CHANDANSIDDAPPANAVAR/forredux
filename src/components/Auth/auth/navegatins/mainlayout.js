// navigation/MainLayout.js
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Regheader from '../components/utlits/Regheders';
import AuthNavigator from './authnav';

const RegisterLayout = ({children}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Regheader />
      <View style={styles.content}>
        <AuthNavigator />
      </View>
    </SafeAreaView>
  );
};

export default RegisterLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
