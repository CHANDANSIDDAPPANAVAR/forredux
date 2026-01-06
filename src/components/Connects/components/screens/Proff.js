import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ExpertListScreen from './proff/expertlistscreen';
import SectionHeading from '../util/heading';

const Proff = () => {
  return (
    <View style={styjcl.maincoby}>
      <SectionHeading title={'Experts'} />
      <ExpertListScreen />
    </View>
  );
};
export default Proff;

const styjcl = StyleSheet.create({
  maincoby: {
    backgroundColor: 'white',
    flex: 1,
  },
});
