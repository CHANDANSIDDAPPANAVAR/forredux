import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ServiceListScreen from './sevr/ServiceListScreen';
import SectionHeading from '../util/heading';

const Service = () => {
  return (
    <View style={styjcl.maincoby}>
      <SectionHeading title={'Service Hub'} />
      <ServiceListScreen />
    </View>
  );
};
export default Service;

const styjcl = StyleSheet.create({
  maincoby: {
    backgroundColor: 'white',
    flex: 1,
  },
});
