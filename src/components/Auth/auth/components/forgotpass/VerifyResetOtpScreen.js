import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  loading,
} from 'react-native';
import api from '../../../../../services/api';

const VerifyResetOtpScreen = ({ route, navigation }) => {
  const { identifier } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);
  const [timer, setTimer] = useState(180);
  const [canResend, setCanResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];

    if (text.length > 1) {
      text.split('').forEach((char, i) => {
        if (index + i < 6) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      if (index + text.length - 1 < 6) {
        inputs.current[index + text.length - 1].focus();
      }
    } else {
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < 5) {
        inputs.current[index + 1].focus();
      } else if (!text && index > 0) {
        inputs.current[index - 1].focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    setErrorMessage('');
    const enteredOtp = otp.join('').trim();
    if (enteredOtp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP');
      return;
    }

    try {
      const res = await api.post('/api/verify-reset-otp', {
        identifier,
        otp: enteredOtp,
      });

      if (res.data.success) {
        navigation.replace('SetNewPasswordScreen', {
          identifier,
          token: res.data.token,
        });
      } else {
        setErrorMessage(res.data.message || 'OTP verification failed');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Server error');
    }
  };

  const handleResendOtp = async () => {
    setErrorMessage('');
    try {
      const res = await api.post('/api/send-reset-otp', {
        identifier,
      });

      if (res.data.success) {
        setOtp(['', '', '', '', '', '']);
        setTimer(180);
        setCanResend(false);
        inputs.current[0]?.focus();
      } else {
        setErrorMessage(res.data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify OTP</Text>

        <Text style={styles.subtitle}>Enter the 6-digit code sent to</Text>
        <Text style={styles.identifierText}>{identifier}</Text>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

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

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleVerifyOtp}
        >
          <Text style={styles.primaryButtonText}>Verify OTP</Text>
        </TouchableOpacity>

        {canResend ? (
          <TouchableOpacity
            onPress={handleResendOtp}
            style={styles.resendContainer}
          >
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.timerText}>
            Resend OTP in <Text style={styles.timerBold}>{timer}s</Text>
          </Text>
        )}
      </View>
    </View>
  );
};

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
    marginBottom: 6,
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
    marginTop: 4,
    marginBottom: 28,
  },

  errorText: {
    color: '#D92D20',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
    textAlign: 'center',
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
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

  primaryButton: {
    backgroundColor: '#2F80ED',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 4,
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

export default VerifyResetOtpScreen;
