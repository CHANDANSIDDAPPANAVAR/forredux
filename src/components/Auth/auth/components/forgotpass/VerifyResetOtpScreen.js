import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  loading,
} from 'react-native';
import api from '../../../../services/api';

const VerifyResetOtpScreen = ({route, navigation}) => {
  const {identifier} = route.params;
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
      <Text style={styles.title}>Enter OTP</Text>
      <View style={styles.identifierContainer}>
        <Text style={styles.identifierText}>{identifier}</Text>
      </View>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => (inputs.current[index] = ref)}
            style={styles.otpInput}
            value={digit}
            onChangeText={text => handleChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
            autoFocus={index === 0}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleVerifyOtp}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Verifying' : 'Verify OTP'}
        </Text>
      </TouchableOpacity>

      {canResend ? (
        <TouchableOpacity
          onPress={handleResendOtp}
          style={styles.resendContainer}>
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.timerText}>Send OTP in {timer}s</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  identifierContainer: {
    alignSelf: 'center',
    backgroundColor: '#eef2f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 30,
  },
  identifierText: {
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 40,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    textAlign: 'center',
    fontSize: 24,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    backgroundColor: '#8B46FF',
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  timerText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 14,
  },
  resendContainer: {
    marginTop: 20,
    alignSelf: 'center',
  },
  resendText: {
    color: '#6A11CB',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default VerifyResetOtpScreen;
