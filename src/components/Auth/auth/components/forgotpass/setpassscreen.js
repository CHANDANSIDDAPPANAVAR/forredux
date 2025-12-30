import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import api from '../../../../../services/api';

const SetNewPasswordScreen = ({ route, navigation }) => {
  const { identifier, token } = route.params;

  const [newPass, setNewPass] = useState('');
  const [reNewPass, setReNewPass] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [showReNewPass, setShowReNewPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = pass =>
    /^(?=.*[A-Za-z])(?=.*[0-9!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,14}$/.test(pass);

  const handleSetPassword = async () => {
    if (newPass !== reNewPass) {
      setError('Passwords do not match');
      return;
    }

    if (!validatePassword(newPass)) {
      setError(
        'Password must be 6–14 characters and include letters and at least one number or special character.',
      );
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/reset-password', {
        identifier,
        token,
        newPassword: newPass,
      });

      if (res.data.success) {
        navigation.replace('Login');
      } else {
        setError(res.data.message || 'Something went wrong. Try again.');
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
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
            <Text style={styles.title}>Set New Password</Text>
            <Text style={styles.subtitle}>
              Create a strong password for your account
            </Text>
          </View>

          {/* FORM */}
          <View style={styles.form}>
            {/* NEW PASSWORD */}
            <Text style={styles.inputLabel}>New Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor="#98A2B3"
                secureTextEntry={!showNewPass}
                value={newPass}
                onChangeText={setNewPass}
              />
              <TouchableOpacity onPress={() => setShowNewPass(!showNewPass)}>
                <Image
                  source={
                    showNewPass
                      ? require('../../assets/pview.png')
                      : require('../../assets/phide.png')
                  }
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>

            {/* CONFIRM PASSWORD */}
            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Re-enter password"
                placeholderTextColor="#98A2B3"
                secureTextEntry={!showReNewPass}
                value={reNewPass}
                onChangeText={setReNewPass}
              />
              <TouchableOpacity
                onPress={() => setShowReNewPass(!showReNewPass)}
              >
                <Image
                  source={
                    showReNewPass
                      ? require('../../assets/pview.png')
                      : require('../../assets/phide.png')
                  }
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>

            {/* ERROR */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* BUTTON */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleSetPassword}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Updating...' : 'Update Password'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SetNewPasswordScreen;

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
    fontSize: 26,
    fontFamily: 'Poppins-SemiBold',
    color: '#101828',
  },

  subtitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#667085',
    textAlign: 'center',
    marginTop: 6,
  },

  form: {
    width: '100%',
  },

  inputLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#344054',
    marginBottom: 6,
    marginLeft: 4,
  },

  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 18,
    paddingHorizontal: 12,
  },

  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#101828',
    paddingVertical: 14,
  },

  eyeIcon: {
    width: 22,
    height: 22,
    tintColor: '#667085',
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
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },

  errorText: {
    color: '#D92D20',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 10,
  },
});
