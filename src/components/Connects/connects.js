// Connects/ConnectsHome.js
import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Buss from './components/screens/Buss';
import Proff from './components/screens/Proff';
import Service from './components/screens/Serveice';
import Event from './components/screens/Event';
import Open from './components/screens/Genral';
import ConnectsNavbar from './navigation/navbarconnects';
import useAndroidBackHandler from '../navigation/util/useBackToHome';

const ConnectsHome = () => {
  const navigation = useNavigation();
  const [active, setActive] = useState('Genral');

  useAndroidBackHandler(() => {
    navigation.navigate('HomeTab');
  });

  const renderScreen = () => {
    switch (active) {
      case 'Buss':
        return <Buss />;
      case 'Proff':
        return <Proff />;
      case 'Service':
        return <Service />;
      case 'Events':
        return <Event />;
      default:
        return <Open />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ConnectsNavbar active={active} onChange={setActive} />
      <View style={{ flex: 1 }}>{renderScreen()}</View>
    </View>
  );
};

export default ConnectsHome;
