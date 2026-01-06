import React from 'react';
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

const Header = ({ notificationCount = 0 }) => {
  const navigation = useNavigation();

  /* ---------------- NAVIGATION ---------------- */
  const goToNotify = () => {
    navigation.navigate('NotifyStack');
  };

  const goToProfile = () => {
    navigation.navigate('ProfileStack');
  };

  /* ---------------- RENDER ---------------- */
  return (
    <SafeAreaView edges={['top']} style={styles.header}>
      {/* LOGO */}
      <Image
        source={require('../../assets/oneconnetrylogo.png')}
        style={styles.logo}
      />

      {/* ACTIONS */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={goToNotify} style={styles.iconWrapper}>
          <Image
            source={require('../../assets/icons/notification.png')}
            style={styles.icon}
          />

          {notificationCount > 0 && (
            <Text style={styles.badge}>
              {notificationCount > 9 ? '9+' : notificationCount}
            </Text>
          )}
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

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#f5f5f5', // ✅ FIXED
    minHeight: 56,
    paddingVertical: 8,
    paddingHorizontal: 10,
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
    width: 120,
    height: 50,
    resizeMode: 'contain',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconWrapper: {
    backgroundColor: '#f2f2f2',
    borderRadius: 30,
    marginHorizontal: 6,
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
    backgroundColor: '#E53935',
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: 8,
    minWidth: 16,
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
});
