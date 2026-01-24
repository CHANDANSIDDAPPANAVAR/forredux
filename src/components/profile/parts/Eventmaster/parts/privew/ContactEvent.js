import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Image,
  Platform,
  ToastAndroid,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

/* ---------------- VALIDATION ---------------- */
const isValidPhone = v => /^\+?[0-9]{6,15}$/.test(v);
const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/* ---------------- HELPERS ---------------- */
const showCopied = text => {
  Clipboard.setString(text);
  if (Platform.OS === 'android') {
    ToastAndroid.show('Copied', ToastAndroid.SHORT);
  }
};

/* ---------------- ROW ---------------- */
const ContactRow = memo(({ icon, value, type }) => {
  if (!value) return null;
  if (type === 'phone' && !isValidPhone(value)) return null;
  if (type === 'email' && !isValidEmail(value)) return null;

  const onPressMain = () => {
    if (type === 'phone') Linking.openURL(`tel:${value}`);
    if (type === 'email') Linking.openURL(`mailto:${value}`);
  };

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.mainTouch}
        onPress={onPressMain}
        activeOpacity={0.8}
      >
        <View style={styles.iconBox}>
          <Image source={icon} style={styles.icon} />
        </View>

        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => showCopied(value)}
        hitSlop={10}
        style={styles.copyBtn}
      >
        <Image
          source={require('../../../../../assets/util/copyicon.png')}
          style={styles.copyIcon}
        />
      </TouchableOpacity>
    </View>
  );
});

/* ---------------- MAIN ---------------- */
const ContactEvent = ({
  phoneNumber,
  alternateNumber,
  email,
  contactPerson,
}) => {
  if (!phoneNumber && !alternateNumber && !email && !contactPerson) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Contact</Text>

      {contactPerson && (
        <View style={styles.personCard}>
          <Image
            source={require('../../../../../assets/events/contact.png')}
            style={styles.personIcon}
          />
          <Text style={styles.personText}>{contactPerson}</Text>
        </View>
      )}

      <ContactRow
        type="phone"
        value={phoneNumber}
        icon={require('../../../../../assets/util/phone.png')}
      />

      <ContactRow
        type="phone"
        value={alternateNumber}
        icon={require('../../../../../assets/util/phone.png')}
      />

      <ContactRow
        type="email"
        value={email}
        icon={require('../../../../../assets/util/mail.png')}
      />
    </View>
  );
};

export default memo(ContactEvent);

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },

  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#111',
    marginBottom: 12,
  },

  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef4ff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  personIcon: {
    width: 22,
    height: 22,
    tintColor: '#2563eb',
    marginRight: 10,
  },

  personText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#1e3a8a',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  mainTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  icon: {
    width: 20,
    height: 20,
    tintColor: '#2563eb',
  },

  value: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#111',
    flexShrink: 1,
  },

  copyBtn: {
    paddingLeft: 12,
  },

  copyIcon: {
    width: 18,
    height: 18,
    tintColor: '#6b7280',
  },
});
