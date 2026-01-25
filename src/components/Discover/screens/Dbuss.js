import React from 'react';
import BussSearch from './dbuss/screeens/BussSearch';
import { View } from 'react-native';
import SectionHeading from '../../Connects/components/util/heading';

const Dbuss = () => {
  return (
    <View style={{ flex: 1 }}>
      <SectionHeading title={'Businesses'} />
      <BussSearch />
    </View>
  );
};
export default Dbuss;
