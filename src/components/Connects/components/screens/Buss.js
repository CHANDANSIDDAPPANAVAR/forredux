import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BusinessListScreen from './buss/BusinessListScreen';
import SectionHeading from '../util/heading';

const Buss = () => {
  return (
    <View style={styjcl.maincoby}>
      <SectionHeading title="Business" />
      <BusinessListScreen />
    </View>
  );
};
export default Buss;

const styjcl = StyleSheet.create({
  maincoby: {
    backgroundColor: 'white',
    flex: 1,
  },
});
