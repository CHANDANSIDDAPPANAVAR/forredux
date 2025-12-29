import React, { useState } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Header = () => {
  const navigation = useNavigation();

  const goToNotify = () => {
    navigation.getParent()?.getParent()?.navigate('NotifyStack');
  };

  const goToProfile = () => {
    navigation.getParent()?.getParent()?.navigate('ProfileStack');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.header}>
      <Image
        source={require('../../assets/logo/TTyouconnectry.png')}
        style={styles.logo}
      />

      <View style={styles.actions}>
        <TouchableOpacity onPress={goToNotify} style={styles.iconWrapper}>
          <Image
            source={require('../../assets/icons/notification.png')}
            style={styles.icon}
          />
          <Text style={styles.badge}>1</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToProfile} style={styles.iconWrapper}>
          <Image
            source={require('../../assets/icons/user.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    minHeight: 56, // ✅ flexible
    paddingVertical: 8, // ✅ allows safe area growth
    paddingHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  logo: {
    width: 150,
    height: 40,
    resizeMode: 'contain',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconWrapper: {
    backgroundColor: '#f2f2f2',
    borderRadius: 30,
    marginHorizontal: 5,
    padding: 8,
    minWidth: 36,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: '#333',
  },

  badge: {
    position: 'absolute',
    right: 2,
    top: 2,
    backgroundColor: 'red',
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: 8,
    minWidth: 16,
    paddingHorizontal: 3,
  },
});
