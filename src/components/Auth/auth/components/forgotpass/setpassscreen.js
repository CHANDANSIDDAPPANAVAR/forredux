import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import api from '../../../../services/api';
const SetNewPasswordScreen = ({route, navigation}) => {
  const {identifier, token} = route.params;
  const [newPass, setNewPass] = useState('');
  const [reNewPass, setReNewPass] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [showReNewPass, setShowReNewPass] = useState(false);
  const [error, setError] = useState('');

  const validatePassword = pass =>
    /^(?=.*[A-Za-z])(?=.*[0-9!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,14}$/.test(pass);

  const handleSetPassword = async () => {
    if (newPass !== reNewPass) {
      setError('Passwords do not match');
      return;
    }

    if (!validatePassword(newPass)) {
      setError(
        'Password must be 6–14 characters and include alphabet and least one number or special character.',
      );
      return;
    }

    try {
      const res = await api.post('/api/reset-password', {
        identifier,
        token,
        newPassword: newPass,
      });

      if (res.data.success) {
        Alert.alert('Success', 'Password has been reset successfully');
        navigation.replace('Login');
      } else {
        setError(res.data.message || 'Something went wrong. Try again.');
      }
    } catch (err) {
      console.error('Error:', err.message);
      setError('Something went wrong. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>New Password</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.inputPass}
            placeholder="Enter new password"
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
              style={styles.eyeIconImage}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.inputLabel}>Re-enter New Password</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.inputPass}
            placeholder="Re-enter password"
            secureTextEntry={!showReNewPass}
            value={reNewPass}
            onChangeText={setReNewPass}
          />
          <TouchableOpacity onPress={() => setShowReNewPass(!showReNewPass)}>
            <Image
              source={
                showReNewPass
                  ? require('../../assets/pview.png')
                  : require('../../assets/phide.png')
              }
              style={styles.eyeIconImage}
            />
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSetPassword}>
          <Text style={styles.submitButtonText}>Set New Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
  },
  inputLabel: {
    color: '#333',
    fontSize: 14,
    marginBottom: 6,
    paddingLeft: 6,
  },
  inputPass: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  eyeIconImage: {
    width: 24,
    height: 24,
    marginRight: 15,
    tintColor: '#474141',
  },
  submitButton: {
    backgroundColor: '#8B46FF',
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SetNewPasswordScreen;
