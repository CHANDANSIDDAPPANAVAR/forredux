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

import ConnectTypesScreen from '../utlits/ConnectTypesScreen';
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

      // ✅ REDUX LOGIN (single source of truth)
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
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flex: 1 }}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerContent}>
                  <Text style={styles.logoText}>YOU CONNECTRY</Text>
                  <Text style={styles.logoSubtitle}>
                    One Identity. Infinite Possibilities.
                  </Text>
                </View>

                <ConnectTypesScreen />

                <View style={styles.headerContent}>
                  <Text style={styles.headerTitle}>Login to Your Account</Text>
                  <Text style={styles.headerSubtitle}>Welcome back!</Text>
                </View>
              </View>

              {/* Form */}
              <View style={styles.form}>
                {errorMessage ? (
                  <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}

                <View style={styles.identifierContainer}>
                  {!isEmail(identifier) && (
                    <TouchableOpacity
                      style={styles.countryPickerButton}
                      onPress={() => setCountryModalVisible(true)}
                    >
                      <View style={styles.flagContainer}>
                        <Image
                          source={selectedCountry.image}
                          style={styles.flagIcon}
                        />
                      </View>
                    </TouchableOpacity>
                  )}

                  <TextInput
                    placeholder="Email or Phone"
                    value={identifier}
                    onChangeText={setIdentifier}
                    autoCapitalize="none"
                    style={styles.identifierInput}
                    placeholderTextColor="#888"
                  />
                </View>

                <View style={styles.passwordWrapper}>
                  <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!passwordVisible}
                    style={styles.input}
                    placeholderTextColor="#888"
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

                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}
                >
                  <Text style={styles.link}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Registerscreen')}
                >
                  <Text style={styles.link}>
                    Don't have an account? Register
                  </Text>
                </TouchableOpacity>
              </View>

              <CountryPickerModal
                visible={countryModalVisible}
                onClose={() => setCountryModalVisible(false)}
                onSelect={handleCountrySelect}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    backgroundColor: '#6A11CB',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 6,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoText: {
    color: 'white',
    fontSize: width * 0.065,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
    lineHeight: 32,
  },
  logoSubtitle: {
    color: 'white',
    fontSize: width * 0.04,
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
    lineHeight: 20,
    textAlign: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: width * 0.07,
    fontFamily: 'Poppins-Bold',
    marginBottom: 5,
    lineHeight: 32,
  },
  headerSubtitle: {
    color: '#e0dfff',
    fontFamily: 'Poppins-Regular',
    fontSize: width * 0.04,
    lineHeight: 22,
    marginBottom: 20,
  },
  form: {
    marginTop: 40,
    width: '85%',
    alignSelf: 'center',
    paddingBottom: 50,
  },
  identifierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 18,
  },
  countryPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  flagContainer: {
    backgroundColor: '#f9f9f9',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  flagIcon: {
    width: 28,
    height: 18,
    resizeMode: 'contain',
  },
  identifierInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    paddingVertical: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: 'white',
    fontFamily: 'Poppins-Regular',
    color: 'rgb(0,0,0)',
  },
  passwordWrapper: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    top: 12,
    right: 15,
  },
  eyeIconImage: {
    width: 24,
    height: 24,
    tintColor: '#302f2f',
  },
  loginButton: {
    backgroundColor: '#8B46FF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: width * 0.045,
    fontFamily: 'Poppins-SemiBold',
  },
  link: {
    marginTop: 5,
    color: '#6A11CB',
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});
