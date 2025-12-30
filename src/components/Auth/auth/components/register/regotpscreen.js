// src/screens/Auth/otp/GOtpScreen.js

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import DeviceInfo from 'react-native-device-info';

import api from '../../../../../services/api';
import { loginThunk } from '../../../../../store/auth/authThunks';
import SuccessModal from '../utlits/SuccessModal';

const OTP_LENGTH = 6;
const RESEND_TIME = 180;

export default function GOtpScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const { identifier, name, country, password, termsAccepted } = route.params;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(RESEND_TIME);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const inputs = useRef([]);

  /* ============================
     TIMER
  ============================ */
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  /* ============================
     OTP INPUT HANDLING
  ============================ */
  const handleChange = (text, index) => {
    const next = [...otp];

    if (text.length > 1) {
      text.split('').forEach((char, i) => {
        if (index + i < OTP_LENGTH) {
          next[index + i] = char;
        }
      });
      setOtp(next);
      const focusIndex = Math.min(index + text.length - 1, OTP_LENGTH - 1);
      inputs.current[focusIndex]?.focus();
      return;
    }

    next[index] = text;
    setOtp(next);

    if (text && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    } else if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  /* ============================
     VERIFY OTP
  ============================ */
  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('').trim();

    if (enteredOtp.length !== OTP_LENGTH) {
      setError('OTP must be a 6-digit number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/verify-otp', {
        identifier,
        otp: enteredOtp,
        name,
        country,
        password,
        termsAccepted,
      });

      if (!res.data?.success) {
        throw new Error(res.data?.message || 'OTP verification failed');
      }

      await autoLoginAfterOtp();
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  /* ============================
     AUTO LOGIN AFTER OTP (REDUX)
  ============================ */
  const autoLoginAfterOtp = async () => {
    const deviceInfo = `${DeviceInfo.getDeviceType()} - ${DeviceInfo.getBrand()} ${DeviceInfo.getModel()}`;

    const res = await api.post('/api/login', {
      identifier: identifier.trim(),
      password,
      deviceInfo,
    });

    const {
      accessToken,
      refreshToken,
      sessionId,
      accountType,
      userSubscription,
      userId,
      userCountry,
      userShownearby,
    } = res.data;

    dispatch(
      loginThunk({
        accessToken,
        refreshToken,
        sessionId,
        userAccountType: accountType,
        userSubscription,
        userId,
        userCountry,
        userShownearby,
      }),
    );
  };

  /* ============================
     RESEND OTP
  ============================ */
  const handleResendOtp = async () => {
    setResending(true);
    try {
      const res = await api.post('/api/send-otp', { identifier });

      if (!res.data?.success) {
        throw new Error(res.data?.message || 'Failed to resend OTP');
      }

      Alert.alert('Success', 'OTP resent successfully');
      setOtp(Array(OTP_LENGTH).fill(''));
      setTimer(RESEND_TIME);
      inputs.current[0]?.focus();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Server error');
    } finally {
      setResending(false);
    }
  };

  /* ============================
     UI
  ============================ */
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify OTP</Text>

        <Text style={styles.subtitle}>Enter the 6-digit code sent to</Text>
        <Text style={styles.identifierText}>{identifier}</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputs.current[index] = ref)}
              style={[styles.otpInput, digit ? styles.otpFilled : null]}
              value={digit}
              onChangeText={text => handleChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              autoFocus={index === 0}
            />
          ))}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleVerifyOtp}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Verify & Continue</Text>
          )}
        </TouchableOpacity>

        {timer > 0 ? (
          <Text style={styles.timerText}>
            Resend OTP in{' '}
            <Text style={styles.timerBold}>
              {Math.floor(timer / 60)}:
              {(timer % 60).toString().padStart(2, '0')}
            </Text>
          </Text>
        ) : (
          <TouchableOpacity
            onPress={handleResendOtp}
            disabled={resending}
            style={styles.resendContainer}
          >
            {resending ? (
              <ActivityIndicator size="small" color="#2F80ED" />
            ) : (
              <Text style={styles.resendText}>Resend OTP</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* SUCCESS MODAL */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <SuccessModal
          visible={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />
      </Modal>
    </View>
  );
}

/* ============================
   STYLES
============================ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  content: {
    alignItems: 'center',
  },

  title: {
    fontSize: 26,
    fontFamily: 'Poppins-SemiBold',
    color: '#101828',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#667085',
  },

  identifierText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#2F80ED',
    marginBottom: 32,
    marginTop: 4,
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },

  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D0D5DD',
    textAlign: 'center',
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#101828',
  },

  otpFilled: {
    borderColor: '#2F80ED',
  },

  errorText: {
    color: '#D92D20',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 12,
    textAlign: 'center',
  },

  primaryButton: {
    backgroundColor: '#2F80ED',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 6,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },

  timerText: {
    marginTop: 20,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#667085',
  },

  timerBold: {
    fontFamily: 'Poppins-Medium',
    color: '#101828',
  },

  resendContainer: {
    marginTop: 20,
  },

  resendText: {
    color: '#2F80ED',
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
  },
});
