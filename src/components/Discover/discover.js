import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import useAndroidBackHandler from '../navigation/util/useBackToHome';
import Dbuss from './screens/Dbuss';
import Dproff from './screens/Dproff';
import Dserve from './screens/Dserve';
import DEvent from './screens/Devent';
import Dopen from './screens/Dopen';
import DiscoverNavbar from './navigation/navbardiscover';

const DiscoverHome = () => {
  const navigation = useNavigation();
  const [active, setActive] = useState('DBuss');

  // ✅ Reset tab when screen regains focus
  useFocusEffect(
    useCallback(() => {
      setActive('DBuss');
    }, []),
  );

  useAndroidBackHandler(() => {
    navigation.navigate('HomeTab');
  });

  const renderScreen = () => {
    switch (active) {
      case 'DBuss':
        return <Dbuss />;
      case 'DProff':
        return <Dproff />;
      case 'DService':
        return <Dserve />;
      case 'DEvents':
        return <DEvent />;
      case 'DGenral':
        return <Dopen />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <DiscoverNavbar active={active} onChange={setActive} />

      {/* 🔑 KEY FIX */}
      <View style={{ flex: 1 }} key={active}>
        {renderScreen()}
      </View>
    </View>
  );
};

export default DiscoverHome;
