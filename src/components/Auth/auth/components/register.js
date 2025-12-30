import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeroOrbit from './HeroOrbit';

const { width } = Dimensions.get('window');

const RegisterTypeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HERO COMPONENT */}
      <HeroOrbit />

      {/* TAGLINE */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.logoSubtitle}>
          One Identity. Infinite Possibilities.
        </Text>
        <View style={styles.dividerLine} />
      </View>

      {/* ACTIONS */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Registerscreen')}
        >
          <Text style={styles.primaryText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryText}>I already have an account</Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <View style={styles.poweredByContainer}>
        <Text style={styles.poweredByText}>Powered by</Text>
        <Text style={styles.companyNameText}>Tantra Track Private Limited</Text>
      </View>
    </View>
  );
};

export default RegisterTypeScreen;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    marginVertical: 24,
    paddingHorizontal: 28,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E4E7EC',
  },

  logoSubtitle: {
    marginHorizontal: 10,
    fontSize: width * 0.038,
    color: '#667085',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },

  bottomContainer: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 24,
  },

  primaryBtn: {
    backgroundColor: '#2F80ED',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginBottom: 14,
  },

  primaryText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontFamily: 'Poppins-SemiBold',
  },

  secondaryBtn: {
    backgroundColor: '#F2F4F7',
    paddingVertical: 15,
    borderRadius: 28,
    alignItems: 'center',
  },

  secondaryText: {
    color: '#667085',
    fontSize: width * 0.042,
    fontFamily: 'Poppins-Medium',
  },

  poweredByContainer: {
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
  },

  poweredByText: {
    fontSize: width * 0.03,
    color: '#98A2B3',
    fontFamily: 'Poppins-Regular',
  },

  companyNameText: {
    marginTop: 2,
    fontSize: width * 0.033,
    color: '#667085',
    fontFamily: 'Poppins-Medium',
  },
});
