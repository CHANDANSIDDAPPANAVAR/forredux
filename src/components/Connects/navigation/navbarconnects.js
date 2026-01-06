// ConnectsNavbar.js
import React from 'react';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';

const navItems = [
  { name: 'Buss', icon: require('../assets/business.png') },
  { name: 'Proff', icon: require('../assets/proff.png') },
  { name: 'Genral', icon: require('../assets/conectmain.png') },
  { name: 'Service', icon: require('../assets/service.png') },
  { name: 'Events', icon: require('../assets/events.png') },
];

const ConnectsNavbar = ({ active, onChange }) => {
  return (
    <View style={styles.navWrapper}>
      {navItems.map(({ name, icon }) => {
        const isActive = active === name;
        return (
          <TouchableOpacity
            key={name}
            style={[styles.tabButton, isActive && styles.activeTab]}
            onPress={() => onChange(name)}
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
  );
};

export default ConnectsNavbar;

const styles = StyleSheet.create({
  navWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 6,
    marginVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  tabButton: {
    padding: 6,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#e0e0e0',
  },
  icon: {
    width: 24,
    height: 24,
  },
});
