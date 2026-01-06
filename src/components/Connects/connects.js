// Connects/ConnectsHome.js
import React, { useState, useEffect } from 'react';
import { View, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Buss from './components/screens/Buss';
import Proff from './components/screens/Proff';
import Service from './components/screens/Serveice';
import Event from './components/screens/Event';
import Open from './components/screens/Genral';
import ConnectsNavbar from './navigation/navbarconnects';

const ConnectsHome = () => {
  const navigation = useNavigation();
  const [active, setActive] = useState('Genral');

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.getParent()?.navigate('HomeTab');
      return true;
    });
    return () => sub.remove();
  }, [navigation]);

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
