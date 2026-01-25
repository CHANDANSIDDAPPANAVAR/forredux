import React from 'react';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const navItems = [
  { name: 'DBuss', icon: require('../../Connects/assets/business.png') },
  { name: 'DProff', icon: require('../../Connects/assets/proff.png') },
  { name: 'DGenral', icon: require('../../Connects/assets/conectmain.png') },
  { name: 'DService', icon: require('../../Connects/assets/service.png') },
  { name: 'DEvents', icon: require('../../Connects/assets/events.png') },
];

const DiscoverNavbar = ({ active, onChange }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.navWrapper}>
      {/* ⬅️ Back → HomeTab */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('HomeTab')}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Image
          source={require('../../assets/icons/back-left.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
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
    </View>
  );
};

export default DiscoverNavbar;

const styles = StyleSheet.create({
  navWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8ff',
    paddingHorizontal: 8,
    backgroundColor: '#ffffffff',
  },

  backButton: {
    padding: 6,
  },

  backIcon: {
    width: 22,
    height: 22,
    tintColor: '#1e1c1c',
  },

  tabsWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginRight: 22, // keeps tabs visually centered
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
