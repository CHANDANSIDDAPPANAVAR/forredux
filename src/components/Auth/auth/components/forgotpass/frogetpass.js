import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
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
import { useNavigation } from '@react-navigation/native';

import countries from '../utlits/countries';
import CountryPickerModal from '../utlits/countrypicker';
import api from '../../../../../services/api';

const { width } = Dimensions.get('window');

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();

  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const isEmail = text =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(text);

  const handleSendOtp = async () => {
    const trimmed = identifier.trim();

    if (!trimmed) {
      setErrorMessage('Please enter your email or phone number');
      return;
    }

    if (trimmed.includes('@') && !isEmail(trimmed)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      let finalIdentifier = trimmed;

      if (!isEmail(finalIdentifier)) {
        if (!/^\d/.test(finalIdentifier)) {
          setErrorMessage('Phone number must contain digits only');
          setLoading(false);
          return;
        }
        finalIdentifier = selectedCountry.code + finalIdentifier;
      }

      const res = await api.post('/api/send-reset-otp', {
        identifier: finalIdentifier,
      });

      if (res.data?.success) {
        navigation.replace('VerifyResetOtpScreen', {
          identifier: finalIdentifier,
        });
      } else {
        setErrorMessage(res.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email or phone number to reset your password
            </Text>
          </View>

          {/* FORM */}
          <View style={styles.form}>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <View style={styles.identifierContainer}>
              {!isEmail(identifier) && (
                <TouchableOpacity
                  style={styles.countryPickerButton}
                  onPress={() => setCountryModalVisible(true)}
                  activeOpacity={0.7}
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
                keyboardType="default"
                style={styles.identifierInput}
                placeholderTextColor="#98A2B3"
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleSendOtp}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.replace('Login')}>
              <Text style={styles.link}>Back to Login</Text>
            </TouchableOpacity>
          </View>

          <CountryPickerModal
            visible={countryModalVisible}
            onClose={() => setCountryModalVisible(false)}
            onSelect={setSelectedCountry}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
  },

  title: {
    fontSize: width * 0.065,
    fontFamily: 'Poppins-SemiBold',
    color: '#101828',
  },

  subtitle: {
    fontSize: width * 0.038,
    fontFamily: 'Poppins-Regular',
    color: '#667085',
    textAlign: 'center',
    marginTop: 6,
  },

  form: {
    width: '100%',
  },

  identifierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 10,
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

  primaryButton: {
    backgroundColor: '#2F80ED',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 8,
  },

  disabledButton: {
    backgroundColor: '#9DBCF2',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontFamily: 'Poppins-SemiBold',
  },

  link: {
    marginTop: 16,
    color: '#2F80ED',
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },

  errorText: {
    color: '#D92D20',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});
