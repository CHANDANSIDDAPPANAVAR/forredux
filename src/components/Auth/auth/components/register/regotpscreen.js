import React, {useState, useEffect, useRef} from 'react';
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
import {useNavigation, useRoute} from '@react-navigation/native';
import SuccessModal from '../utlits/SuccessModal';
import DeviceInfo from 'react-native-device-info';
import {useAuth} from '../../../../Authcontex/jailer.js'; // adjust path if needed
import api from '../../../../services/api';
const GOtpScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(180);
  const [resending, setResending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const {identifier, name, country, password, termsAccepted} = route.params;
  const {login} = useAuth();
  const inputs = useRef([]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
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
        inputs.current[index + text.length - 1]?.focus();
      }
    } else {
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < 5) {
        inputs.current[index + 1]?.focus();
      } else if (!text && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('').trim();

    if (!enteredOtp) {
      setError('OTP is required');
      return;
    }

    if (enteredOtp.length !== 6 || isNaN(enteredOtp)) {
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

      if (res.data.success) {
        await autoLoginAfterOtp(identifier, password);
        setShowSuccessModal(true);
      } else {
        setError(res.data.message || 'OTP verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };
  const handleResendOtp = async () => {
    setResending(true);
    try {
      const res = await api.post('/api/send-otp', {
        identifier,
      });

      if (res.data.success) {
        Alert.alert('Success', 'OTP resent successfully');
        setOtp(['', '', '', '', '', '']);
        setTimer(180);
        inputs.current[0]?.focus();
      } else {
        Alert.alert('Error', res.data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Server error');
    } finally {
      setResending(false);
    }
  };

  const getDeviceInfo = async () => {
    const deviceType = DeviceInfo.getDeviceType();
    const brand = DeviceInfo.getBrand();
    const model = DeviceInfo.getModel();
    return `${deviceType} - ${brand} ${model}`;
  };

  const autoLoginAfterOtp = async (identifier, password) => {
    try {
      const deviceInfo = await getDeviceInfo();
      const res = await api.post('/api/login', {
        identifier: identifier.trim(),
        password,
        deviceInfo,
      });

      const {accessToken, refreshToken, sessionId, accountType} = res.data; // <-- get accountType also

      await login(accessToken, refreshToken, sessionId, accountType); // <-- pass accountType her
    } catch (error) {
      console.log('Auto-login error:', error.response?.data || error.message);
      Alert.alert('Error', 'Auto-login failed. Please login manually.');
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>

      <View style={styles.identifierContainer}>
        <Text style={styles.identifierText}>Phone/Email: {identifier}</Text>
      </View>

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

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleVerifyOtp}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Verfying' : 'Verify OTP'}
        </Text>
      </TouchableOpacity>

      {timer > 0 ? (
        <Text style={styles.timerText}>
          Resend OTP in {Math.floor(timer / 60)}:
          {(timer % 60).toString().padStart(2, '0')}
        </Text>
      ) : (
        <TouchableOpacity
          style={styles.resendContainer}
          onPress={handleResendOtp}
          disabled={resending}>
          {resending ? (
            <ActivityIndicator size="small" color="#6A11CB" />
          ) : (
            <Text style={styles.resendText}>Resend OTP</Text>
          )}
        </TouchableOpacity>
      )}

      {showSuccessModal && (
        <Modal transparent={true} animationType="fade">
          <SuccessModal
            visible={showSuccessModal}
            onClose={() => {
              setShowSuccessModal(false);
            }}
          />
        </Modal>
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 10,
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

export default GOtpScreen;
