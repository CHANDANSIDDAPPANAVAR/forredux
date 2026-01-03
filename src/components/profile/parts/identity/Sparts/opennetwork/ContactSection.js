import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { showToast } from '../../../../../util/alerts/toast';

/* ---------------------------
   Validators
---------------------------- */
const isValidPhone = value => /^\+?[0-9]{6,15}$/.test(value);
const isValidEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/* ---------------------------
   Row Component (UNCHANGED)
---------------------------- */
const ContactRow = ({ icon, value, onPress, onCopy }) => {
  if (!value) return null;

  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <Image source={icon} style={styles.icon} />
      </View>

      <TouchableOpacity
        style={styles.valueWrap}
        activeOpacity={0.7}
        onPress={onPress}
      >
        <Text style={styles.valueText} numberOfLines={1}>
          {value}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onCopy} hitSlop={10} style={styles.copyWrap}>
        <Image
          source={require('../../../../../assets/util/copyicon.png')}
          style={styles.copyIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

/* ---------------------------
   Main Component
---------------------------- */
const ContactSection = ({ phoneNumber, email, emergencyNumber }) => {
  const handleCopy = useCallback(text => {
    Clipboard.setString(text);
    showToast('Copied to clipboard');
  }, []);

  const handleCall = useCallback(number => {
    if (!isValidPhone(number)) return;

    const url = Platform.OS === 'ios' ? `telprompt:${number}` : `tel:${number}`;

    Linking.openURL(url);
  }, []);

  const handleEmail = useCallback(mail => {
    if (!isValidEmail(mail)) return;
    Linking.openURL(`mailto:${mail}`);
  }, []);

  if (!phoneNumber && !email && !emergencyNumber) return null;

  return (
    <View style={styles.container}>
      {isValidPhone(phoneNumber) && (
        <ContactRow
          icon={require('../../../../../assets/util/phone.png')}
          value={phoneNumber}
          onPress={() => handleCall(phoneNumber)}
          onCopy={() => handleCopy(phoneNumber)}
        />
      )}

      {isValidEmail(email) && (
        <ContactRow
          icon={require('../../../../../assets/util/mail.png')}
          value={email}
          onPress={() => handleEmail(email)}
          onCopy={() => handleCopy(email)}
        />
      )}

      {/* 🔴 Emergency Call (ADDED ONLY) */}
      {isValidPhone(emergencyNumber) && (
        <TouchableOpacity
          style={styles.emergencyButton}
          activeOpacity={0.9}
          onPress={() => handleCall(emergencyNumber)}
        >
          <Text style={styles.emergencyText}> Emergency Call</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(ContactSection);

/* ---------------------------
   Styles (ONLY emergency added)
---------------------------- */
const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    paddingHorizontal: 4,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  icon: {
    width: 20,
    height: 20,
    tintColor: '#2563eb',
  },

  valueWrap: {
    flex: 1,
  },

  valueText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#111827',
  },

  copyWrap: {
    paddingLeft: 12,
  },

  copyIcon: {
    width: 18,
    height: 18,
    tintColor: '#6b7280',
  },

  /* 🔴 Emergency Button */
  emergencyButton: {
    backgroundColor: '#f7f7f7ff',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'red',
  },

  emergencyText: {
    color: 'red',
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },
});
