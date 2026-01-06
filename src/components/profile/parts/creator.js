import React from 'react';
import { Text, View } from 'react-native';
import CreateCreatorScreen from '../../navigation/parts/createcreator/CreateCreatorScreen';
import QRScanner from '../../Home/parts/qr-scan/QRScanner';

const Creator = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text>creator</Text>
      <QRScanner />
    </View>
  );
};
export default Creator;
