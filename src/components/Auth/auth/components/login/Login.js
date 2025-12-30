import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import { useNavigation } from '@react-navigation/native';

import countries from '../utlits/countries';
import CountryPickerModal from '../utlits/countrypicker';
import api from '../../../../../services/api';
import { loginThunk } from '../../../../../store/auth/authThunks';

const { width } = Dimensions.get('window');

export default function TLoginScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const isEmail = text => /\S+@\S+\.\S+/.test(text);

  const getDeviceInfo = async () => {
    const deviceType = DeviceInfo.getDeviceType();
    const brand = DeviceInfo.getBrand();
    const model = DeviceInfo.getModel();
    return `${deviceType} - ${brand} ${model}`;
  };

  const handleLogin = async () => {
    setErrorMessage('');

    try {
      const deviceInfo = await getDeviceInfo();
      let finalIdentifier = identifier.trim();

      if (!isEmail(finalIdentifier)) {
        finalIdentifier = selectedCountry.code + finalIdentifier;
      }

      const res = await api.post('/api/login', {
        identifier: finalIdentifier,
        password,
        deviceInfo,
      });

      const {
        accessToken,
        refreshToken,
        sessionId,
        user: { accountType, subscription, id, showinnearby, country },
      } = res.data;

      dispatch(
        loginThunk({
          accessToken,
          refreshToken,
          sessionId,
          userAccountType: accountType,
          userSubscription: subscription,
          userId: id,
          userShownearby: showinnearby,
          userCountry: country,
        }),
      );
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        'Login failed. Please check your credentials.';
      setErrorMessage(msg);
    }
  };

  const handleCountrySelect = country => {
    setSelectedCountry(country);
    setCountryModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* ================= HEADER ================= */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Login</Text>
              <Text style={styles.headerSubtitle}>
                Welcome back to One Connectry
              </Text>
            </View>

            {/* ================= FORM ================= */}
            <View style={styles.form}>
              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}

              {/* EMAIL / PHONE */}
              <View style={styles.identifierContainer}>
                {!isEmail(identifier) && (
                  <TouchableOpacity
                    style={styles.countryPickerButton}
                    onPress={() => setCountryModalVisible(true)}
                  >
                    <Image
                      source={selectedCountry.image}
                      style={styles.flagIcon}
                    />
                  </TouchableOpacity>
                )}

                <TextInput
                  placeholder="Email or Phone"
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  style={styles.identifierInput}
                  placeholderTextColor="#98A2B3"
                />
              </View>

              {/* PASSWORD */}
              <View style={styles.passwordWrapper}>
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                  style={styles.input}
                  placeholderTextColor="#98A2B3"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                >
                  <Image
                    source={
                      passwordVisible
                        ? require('../../assets/pview.png')
                        : require('../../assets/phide.png')
                    }
                    style={styles.eyeIconImage}
                  />
                </TouchableOpacity>
              </View>

              {/* LOGIN BUTTON */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>

              {/* LINKS */}
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.link}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Registerscreen')}
              >
                <Text style={styles.link}>
                  Don&apos;t have an account? Register
                </Text>
              </TouchableOpacity>
            </View>

            <CountryPickerModal
              visible={countryModalVisible}
              onClose={() => setCountryModalVisible(false)}
              onSelect={handleCountrySelect}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* HEADER */
  header: {
    alignItems: 'center',

    paddingBottom: 30,
  },

  headerTitle: {
    fontSize: width * 0.065,
    fontFamily: 'Poppins-SemiBold',
    color: '#101828',
  },

  headerSubtitle: {
    fontSize: width * 0.038,
    fontFamily: 'Poppins-Regular',
    color: '#667085',
    marginTop: 6,
  },

  /* FORM */
  form: {
    width: '85%',
    alignSelf: 'center',
    paddingBottom: 40,
  },

  identifierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 18,
    paddingHorizontal: 12,
  },

  countryPickerButton: {
    marginRight: 8,
  },

  flagIcon: {
    width: 28,
    height: 18,
    resizeMode: 'contain',
  },

  identifierInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#101828',
    paddingVertical: 14,
  },

  passwordWrapper: {
    position: 'relative',
  },

  input: {
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    color: '#101828',
  },

  eyeIcon: {
    position: 'absolute',
    top: 14,
    right: 14,
  },

  eyeIconImage: {
    width: 22,
    height: 22,
    tintColor: '#667085',
  },

  loginButton: {
    backgroundColor: '#2F80ED',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginBottom: 14,
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontFamily: 'Poppins-SemiBold',
  },

  link: {
    marginTop: 6,
    color: '#2F80ED',
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },

  errorText: {
    color: '#D92D20',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});
