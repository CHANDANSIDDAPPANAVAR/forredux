import React from 'react';

import { View } from 'react-native';
import SectionHeading from '../../Connects/components/util/heading';
import ServiceSearch from './dserve/screens/ServiceSearch';

const Dserve = () => {
  return (
    <View style={{ flex: 1 }}>
      <SectionHeading title={'Businesses'} />
      <ServiceSearch />
    </View>
  );
};
export default Dserve;
