import React from 'react';
import { Text, View } from 'react-native';
import CreateCreatorScreen from '../../navigation/parts/createcreator/CreateCreatorScreen';

const Creator = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text>creator</Text>
      <CreateCreatorScreen />
    </View>
  );
};
export default Creator;
