import React, {useState, useMemo, useCallback} from 'react';
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
  Modal,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import countries from '../utlits/countries'; // Assuming same countries file
import ConnectTypesScreen from '../utlits/ConnectTypesScreen';
import api from '../../../../services/api';
import CountryPickerModal from '../utlits/countrypicker';
const {width, height} = Dimensions.get('window');

const ForgotPasswordScreen = () => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default country
  const navigation = useNavigation();

  // Robust email validation regex
  const isEmail = text =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(text);

  const handleSendOtp = async () => {
    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier) {
      setErrorMessage('Please enter an email or phone number');
      return;
    }

    // Check if input resembles an email and validate it
    if (trimmedIdentifier.includes('@')) {
      if (!isEmail(trimmedIdentifier)) {
        setErrorMessage('Please enter a valid email address');
        return;
      }
    }

    setErrorMessage('');
    try {
      setLoading(true);
      let finalIdentifier = trimmedIdentifier;

      // Log the identifier type for debugging
      const identifierType = isEmail(finalIdentifier) ? 'email' : 'phone';
      console.log(`[Identifier]: ${finalIdentifier}, Type: ${identifierType}`);

      if (!isEmail(finalIdentifier)) {
        // Treat as phone number — ensure it starts with a digit
        if (!/^\d/.test(finalIdentifier)) {
          setErrorMessage('Phone number must start with a digit');
          return;
        }
        finalIdentifier = selectedCountry.code + finalIdentifier;
        console.log(`[Normalized Phone]: ${finalIdentifier}`);
      }

      console.log(`[Sending OTP Request]: ${finalIdentifier}`);
      console.log(api);
      const res = await api.post('/api/send-reset-otp', {
        identifier: finalIdentifier,
      });

      console.log('[API Response]:', res.data);

      if (res.data.success) {
        navigation.replace('VerifyResetOtpScreen', {
          identifier: finalIdentifier,
        });
      } else {
        setErrorMessage(res.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('[API Error]:', err.response?.data || err.message);
      setErrorMessage(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleCountrySelect = country => {
    console.log('[Country Selected]:', country.label, country.dialCode);
    setSelectedCountry(country);
    setCountryModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled">
          <View style={{flex: 1}}>
            <View style={styles.header}>
              <View style={styles.headerone}>
                <Text style={styles.logoText}>YOU CONNECTRY</Text>
                <Text style={styles.logosuText}>
                  One Identity. Endless possibilities.
                </Text>
              </View>
              <ConnectTypesScreen />
              <View style={styles.headerone}>
                <Text style={styles.headerTitle}>Forgot Password</Text>
                <Text style={styles.headerSubtitle}>
                  Enter your email or phone to reset your password
                </Text>
              </View>
            </View>

            <View style={styles.form}>
              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}

              <View style={styles.identifierContainer}>
                {!isEmail(identifier) && (
                  <TouchableOpacity
                    style={styles.countryPickerButton}
                    onPress={() => setCountryModalVisible(true)}>
                    <View style={styles.flagcont}>
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
                  onChangeText={text => {
                    setIdentifier(text);
                    if (errorMessage) {
                      setErrorMessage('');
                    }
                  }}
                  autoCapitalize="none"
                  keyboardType="default"
                  style={styles.identifierInput}
                  placeholderTextColor="#888"
                />
              </View>
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendOtp}
                disabled={loading}>
                <Text style={styles.buttonText}>
                  {loading ? 'Sending...' : 'Send OTP'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.replace('Login')}>
                <Text style={styles.link}>Back to Login</Text>
              </TouchableOpacity>
            </View>

            {/* Country Picker Modal */}
            <CountryPickerModal
              visible={countryModalVisible}
              onClose={() => setCountryModalVisible(false)}
              onSelect={handleCountrySelect}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

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
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 10,
    elevation: 6,
  },
  headerone: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoText: {
    color: 'white',
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
    lineHeight: 30,
  },
  logosuText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
    lineHeight: 22,
    textAlign: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 5,
    lineHeight: 32,
  },
  headerSubtitle: {
    color: '#e0dfff',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
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
  },
  flagIcon: {
    width: 24,
    height: 16,
    marginRight: 4,
    resizeMode: 'contain',
  },
  flagcont: {
    backgroundColor: '#f9f9f9',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  dialCodeText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  identifierInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    paddingVertical: 14,
  },
  button: {
    backgroundColor: '#8B46FF',
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#a688d8',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  link: {
    marginTop: 18,
    color: '#6A11CB',
    fontSize: 15,
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.8,
    maxHeight: height * 0.4,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  Contylable: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  countryOption: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  countryPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryFlag: {
    width: 24,
    height: 16,
    marginRight: 10,
    resizeMode: 'contain',
  },
  countryOptionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});

export default ForgotPasswordScreen;
