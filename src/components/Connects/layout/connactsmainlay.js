// ConMainLayout.js
import React, { useEffect } from 'react';
import { StyleSheet, View, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ConnectsNavbar from '../navigation/navbarconnects';
import Connectsnav from '../navigation/connectsnavgtor';

const ConMainLayout = () => {
  const navigation = useNavigation(); // ← This IS the nested stack navigator ✅

  useEffect(() => {
    const onBackPress = () => {
      const state = navigation.getState();
      const currentScreen = state.routes[state.index]?.state
        ? state.routes[state.index].state.routes[
            state.routes[state.index].state.index
          ].name
        : 'Genral';

      if (currentScreen === 'Genral') {
        const parentNav = navigation.getParent();
        parentNav?.navigate('HomeTab'); // or whatever your home tab is named
        return true;
      }

      navigation.navigate('Genral');
      return true;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Connectsnav style={{ flex: 1 }} />
      {/* Pass the correct navigation down */}
      <ConnectsNavbar navigation={navigation} />
    </View>
  );
};

export default ConMainLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
