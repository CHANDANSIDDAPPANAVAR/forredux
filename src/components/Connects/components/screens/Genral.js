import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SectionHeading from '../util/heading';
import OpenListScreen from './Genral/ConnectListScreen';

const Open = () => {
  return (
    <View style={styjcl.maincoby}>
      <SectionHeading title={'Open Network'} />
      <OpenListScreen />
    </View>
  );
};
export default Open;

const styjcl = StyleSheet.create({
  maincoby: {
    backgroundColor: 'white',
    flex: 1,
  },
});
