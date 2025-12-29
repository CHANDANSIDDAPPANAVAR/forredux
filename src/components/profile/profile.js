import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  BackHandler,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HeadreProf from './parts/util/hederprofile';

const MENU_ITEMS = [
  {
    label: 'My Identity',
    icon: require('../assets/icons/user.png'),
    route: 'Identity',
  },
  {
    label: 'Creator',
    icon: require('../assets/icons/youtuber.png'),
    route: 'Creator',
  },
  {
    label: 'Quick Connect',
    icon: require('../assets/icons/people.png'),
    route: 'Quick',
  },
  {
    label: 'Event Master',
    icon: require('../assets/icons/events.png'),
    route: 'Eventmaster',
  },
  {
    label: 'Connect & Earn',
    icon: require('../assets/icons/rande.png'),
    route: 'Earn',
  },
  {
    label: 'Manage Subscriptions',
    icon: require('../assets/icons/mscrib.png'),
    route: 'Managesub',
  },
  {
    label: 'Settings',
    icon: require('../assets/icons/setting.png'),
    route: 'Settings',
  },
  {
    label: 'Orders & Purchases',
    icon: require('../assets/icons/checkout.png'),
    route: 'Orders',
  },
  {
    label: 'Help & Support',
    icon: require('../assets/icons/support.png'),
    route: 'Support',
  },
];

const ProfileCard = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image source={icon} style={styles.icon} />
      <Text style={styles.cardLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const Profile = () => {
  const navigation = useNavigation();

  /* Android back → HomeStack */
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'AppTabs' }],
        });
        return true; // ⛔ stop Android from closing app
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [navigation]),
  );

  const onLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MLogout' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeadreProf title="Connect Sphere" backScreen="AppTabs" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* PRIMARY SECTION */}
        <View style={styles.section}>
          {MENU_ITEMS.slice(0, 2).map(item => (
            <ProfileCard
              key={item.label}
              icon={item.icon}
              label={item.label}
              onPress={() => navigation.navigate(item.route)}
            />
          ))}
        </View>

        {/* DIVIDER */}
        <View style={styles.divider} />

        {/* SECONDARY SECTION */}
        <View style={styles.section}>
          {MENU_ITEMS.slice(2).map(item => (
            <ProfileCard
              key={item.label}
              icon={item.icon}
              label={item.label}
              onPress={() => navigation.navigate(item.route)}
            />
          ))}
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={onLogout}
          activeOpacity={0.9}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  section: {
    marginBottom: 12,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f7f9',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 14,
    marginBottom: 12,
  },

  icon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    tintColor: '#4A90E2',
    marginRight: 16,
  },

  cardLabel: {
    fontSize: 15,
    color: '#1A1A1A',
    fontFamily: 'Poppins-SemiBold',
  },

  divider: {
    height: 1,
    backgroundColor: '#E3E3E3',
    marginVertical: 18,
  },

  logoutButton: {
    marginTop: 28,
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  logoutText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0.4,
  },
});
