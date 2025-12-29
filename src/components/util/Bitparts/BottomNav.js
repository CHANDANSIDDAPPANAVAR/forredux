import React from 'react';
import { Image, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ICONS = {
  DiscoverTab: require('../../assets/icons/people-search.png'),
  BlinkTab: require('../../assets/icons/Blink.png'),
  HomeTab: require('../../assets/icons/qr-scan.png'),
  ConnectsTab: require('../../assets/icons/connects.png'),
  ChatTab: require('../../assets/icons/chat.png'),
};

const LABELS = {
  DiscoverTab: 'Discover',
  BlinkTab: 'Blink',
  HomeTab: 'Home',
  ConnectsTab: 'Connects',
  ChatTab: 'Chat',
};

const BottomNav = ({ state, navigation }) => {
  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <View style={styles.nav}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const icon = ICONS[route.name];
          const label = LABELS[route.name];

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              onPress={() => navigation.navigate(route.name)}
            >
              <Image
                source={icon}
                style={[
                  styles.icon,
                  { tintColor: isFocused ? '#000' : '#999' },
                ]}
              />
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? '#1e1c1c' : '#555' },
                ]}
              >
                {label}
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
  container: {
    backgroundColor: '#f5f5f5',
  },
  nav: {
    flexDirection: 'row',
    height: 56,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 3,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
});
