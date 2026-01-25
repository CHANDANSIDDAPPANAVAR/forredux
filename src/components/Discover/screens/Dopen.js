import React from 'react';
import OpenSearch from './dgenral/screen/OpenSearch';
import { View } from 'react-native';
import SectionHeading from '../../Connects/components/util/heading';

const Dopen = () => {
  return (
    <View style={{ flex: 1 }}>
      <SectionHeading title={'Open Network'} />
      <OpenSearch />
    </View>
  );
};
export default Dopen;
