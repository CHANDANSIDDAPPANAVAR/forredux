// ConnectsNavbar.js
import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useNavigationState } from '@react-navigation/native';

const navItems = [
  { name: 'Buss', icon: require('../assets/business.png') },
  { name: 'Proff', icon: require('../assets/proff.png') },
  { name: 'Genral', icon: require('../assets/conectmain.png') },
  { name: 'Service', icon: require('../assets/service.png') },
  { name: 'Events', icon: require('../assets/events.png') },
];

const ConnectsNavbar = ({ navigation: navProp }) => {
  // Use the passed navigation if available, otherwise fallback (but it will be passed)
  const navigation = navProp;

  const state = useNavigationState(state => state);
  const [activeTab, setActiveTab] = useState('Genral');

  useEffect(() => {
    const routes = state.routes;
    const currentRoute = routes[routes.length - 1];
    const nestedState = currentRoute?.state;

    const currentScreen = nestedState
      ? nestedState.routes[nestedState.index || 0].name
      : 'Genral';

    setActiveTab(currentScreen);
  }, [state]);

  const handlePress = name => {
    if (activeTab !== name) {
      navigation.navigate(name); // ← Now 100% uses the correct nested navigator
      setActiveTab(name);
    }
  };

  return (
    <View style={styles.mainnavc}>
      <View style={styles.navWrapper}>
        {navItems.map(({ name, icon }) => {
          const isActive = activeTab === name;
          return (
            <TouchableOpacity
              key={name}
              style={[styles.tabButton, isActive && styles.activeTab]}
              onPress={() => handlePress(name)}
            >
              <Image
                source={icon}
                style={[
                  styles.icon,
                  { tintColor: isActive ? '#1e1c1c' : '#999' },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default ConnectsNavbar;

const styles = StyleSheet.create({
  mainnavc: { margin: 0 },
  navWrapper: {
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    paddingBottom: 10,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#e0e0e0',
  },
  icon: {
    width: 28,
    height: 28,
  },
});
