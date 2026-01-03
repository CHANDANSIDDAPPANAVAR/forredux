// util/Bitparts/BottomNav.js
import React from 'react';
import { Image, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TABS = [
  {
    key: 'DiscoverTab',
    label: 'Discover',
    icon: require('../../assets/icons/people-search.png'),
  },
  {
    key: 'BlinkTab',
    label: 'Blink',
    icon: require('../../assets/icons/Blink.png'),
  },
  {
    key: 'HomeTab',
    label: 'Home',
    icon: require('../../assets/icons/qr-scan.png'),
  },
  {
    key: 'ConnectsTab',
    label: 'Connects',
    icon: require('../../assets/icons/connects.png'),
  },
  {
    key: 'ChatTab',
    label: 'Chat',
    icon: require('../../assets/icons/chat.png'),
  },
];

const BottomNav = ({ state, navigation }) => {
  const currentRoute = state.routes[state.index].name;

  // 🚫 Hide tab bar on Blink
  if (currentRoute === 'BlinkTab') return null;

  return (
    <SafeAreaView edges={['bottom']} style={styles.mainbutnav}>
      <View style={styles.subminbutnav}>
        {TABS.map(tab => {
          const index = state.routes.findIndex(r => r.name === tab.key);
          const isActive = state.index === index;

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.discover}
              onPress={() => !isActive && navigation.navigate(tab.key)}
            >
              <Image
                source={tab.icon}
                style={[styles.icon, { tintColor: isActive ? '#000' : '#999' }]}
              />
              <Text
                style={[styles.label, { color: isActive ? '#1e1c1c' : '#555' }]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default BottomNav;

const styles = StyleSheet.create({
  mainbutnav: {
    backgroundColor: '#f5f5f5',
  },
  subminbutnav: {
    flexDirection: 'row',
    height: 55,
  },
  discover: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 26,
    height: 26,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
});
