import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import countries from '../utlits/countries';
import CountryPickerModal from '../utlits/countrypicker';
import api from '../../../../../services/api';
const MPRegistrationScreen = () => {
  const navigation = useNavigation();
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const isEmail = input => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

  const validateIdentifier = input => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return emailRegex.test(input) || phoneRegex.test(input);
  };

  const validateName = str => /^[a-zA-Z\s]{4,30}$/.test(str);
  const validatePassword = pass =>
    /^(?=.*[A-Za-z])(?=.*[0-9!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,14}$/.test(pass);

  const handleRegister = async () => {
    if (!name || !identifier || !password || !confirmPassword) {
      return setError('Please fill in all fields');
    }

    if (!validateName(name)) {
      return setError(
        'Name must be 4–20 letters. No numbers or special characters.',
      );
    }
    console.log(identifier);
    let finalIdentifier = identifier.trim();
    if (!isEmail(finalIdentifier)) {
      // If not email, treat as phone — add country code
      finalIdentifier = selectedCountry.code + finalIdentifier;
    }
    console.log(finalIdentifier);
    if (!validateIdentifier(finalIdentifier)) {
      return setError('Invalid email or phone number');
    }

    if (!validatePassword(password)) {
      return setError(
        'Password must be 6–14 characters and include alphabet and least one number or special character.',
      );
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (!isAgreed) {
      return setError('You must agree to the Terms and Conditions');
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/send-otp', {
        identifier: finalIdentifier,
      });

      if (res.data?.success) {
        navigation.replace('GOtp', {
          identifier: finalIdentifier,
          country: selectedCountry.label,
          name: name.trim(),
          password: password.trim(),
          termsAccepted: isAgreed,
        });
      } else {
        setError(res.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      if (err.response?.status === 400) {
        const message =
          err.response.data.message || 'Something went wrong. Try again.';
        if (message.includes('already registered')) {
          setError(
            <View>
              <Text style={styles.errorText}>
                This {isEmail(finalIdentifier) ? 'email' : 'phone number'} is
                already registered. Please log in.
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Login</Text>
              </TouchableOpacity>
            </View>,
          );
        } else {
          setError(message);
        }
      } else {
        console.error('Error:', err.message);
        setError('Something went wrong. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleCheckbox = () => {
    setIsAgreed(prev => !prev);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keybavdmain}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.form}>
              {/* Country Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Select Country</Text>
                <TouchableOpacity
                  style={styles.countryButton}
                  onPress={() => setModalVisible(true)}
                >
                  <View style={styles.countryPicker}>
                    <View style={styles.countryFlagCont}>
                      <Image
                        source={selectedCountry.image}
                        style={styles.countryFlag}
                      />
                    </View>
                    <Text style={styles.countryText}>
                      {selectedCountry.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor="#999"
                  value={name}
                  autoCorrect={false}
                  onChangeText={text => {
                    setName(text);
                    if (validateName(text)) {
                      setError('');
                    }
                  }}
                />
              </View>

              {/* Identifier Input (Email or Phone) */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email or Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter email or phone"
                  value={identifier}
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={text => {
                    setIdentifier(text);
                    if (validateIdentifier(text)) {
                      setError('');
                    }
                  }}
                />
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.inputPass}
                    placeholder="Enter password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={text => {
                      setPassword(text);
                      if (validatePassword(text)) {
                        setError('');
                      }
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Image
                      source={
                        showPassword
                          ? require('../../assets/pview.png')
                          : require('../../assets/phide.png')
                      }
                      style={styles.eyeIconImage}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Re-enter Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.inputPass}
                    placeholder="Re-enter password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={text => {
                      setConfirmPassword(text);
                      if (text === password) {
                        setError('');
                      }
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Image
                      source={
                        showConfirmPassword
                          ? require('../../assets/pview.png')
                          : require('../../assets/phide.png')
                      }
                      style={styles.eyeIconImage}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Terms and Conditions Checkbox */}
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={toggleCheckbox}
                activeOpacity={0.8}
              >
                <Image
                  source={
                    isAgreed
                      ? require('../../assets/checkboxtik.png')
                      : require('../../assets/uncheckedtik.png')
                  }
                  style={styles.checkboxImage}
                />
                <Text style={styles.checkboxText}>
                  I agree to the{' '}
                  <Text
                    style={styles.linkText}
                    onPress={() => navigation.navigate('TermsAndConditions')}
                  >
                    Terms and Conditions
                  </Text>
                </Text>
              </TouchableOpacity>

              {/* Error Message */}
              {error ? (
                <Text style={styles.errorContainer}>{error}</Text>
              ) : null}

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  loading && styles.submitButtonDisabled,
                ]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Please wait...' : 'Continue'}
                </Text>
              </TouchableOpacity>
            </View>

            <CountryPickerModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onSelect={item => setSelectedCountry(item)}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  keybavdmain: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
  },

  /* FORM */
  form: {
    width: '100%',
  },

  inputGroup: {
    marginBottom: 18,
  },

  inputLabel: {
    color: '#101828',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginBottom: 6,
  },

  input: {
    borderColor: '#E4E7EC',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    backgroundColor: '#FFFFFF',
    color: '#101828',
  },

  /* COUNTRY PICKER */
  countryButton: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E7EC',
  },

  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  countryFlagCont: {
    marginRight: 12,
  },

  countryFlag: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
  },

  countryText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#101828',
  },

  /* PASSWORD */
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },

  inputPass: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#101828',
  },

  eyeIconImage: {
    width: 22,
    height: 22,
    marginRight: 16,
    tintColor: '#667085',
  },

  /* TERMS */
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  checkboxImage: {
    width: 22,
    height: 22,
    marginRight: 10,
    tintColor: '#2F80ED',
  },

  checkboxText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#344054',
    flex: 1,
  },

  linkText: {
    color: '#2F80ED',
    fontFamily: 'Poppins-Medium',
  },

  /* ERROR */
  errorContainer: {
    marginTop: 10,
  },

  errorText: {
    color: '#D92D20',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },

  /* BUTTON */
  submitButton: {
    backgroundColor: '#2F80ED',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 20,
  },

  submitButtonDisabled: {
    backgroundColor: '#A4BCFD',
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default MPRegistrationScreen;
