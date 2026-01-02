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

const AddressSection = ({ pickedAddress, pickedLocation }) => {
  if (
    !pickedAddress &&
    !(pickedLocation?.latitude && pickedLocation?.longitude)
  ) {
    return null;
  }

  const handleCopy = useCallback(() => {
    if (!pickedAddress) return;
    Clipboard.setString(pickedAddress);
    showToast('Address copied');
  }, [pickedAddress]);

  const openInMaps = useCallback(async () => {
    if (!pickedLocation?.latitude || !pickedLocation?.longitude) return;

    const { latitude, longitude } = pickedLocation;

    try {
      if (Platform.OS === 'ios') {
        const appleMapsUrl = `maps://?q=${latitude},${longitude}`;
        const googleMapsAppUrl = `comgooglemaps://?q=${latitude},${longitude}`;
        const googleMapsWebUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        if (await Linking.canOpenURL(appleMapsUrl)) {
          await Linking.openURL(appleMapsUrl);
        } else if (await Linking.canOpenURL(googleMapsAppUrl)) {
          await Linking.openURL(googleMapsAppUrl);
        } else {
          await Linking.openURL(googleMapsWebUrl);
        }
      } else {
        await Linking.openURL(
          `https://www.google.com/maps?q=${latitude},${longitude}`,
        );
      }
    } catch {
      showToast('Unable to open maps');
    }
  }, [pickedLocation]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>📍 Location</Text>

          {pickedAddress && (
            <TouchableOpacity
              onPress={handleCopy}
              hitSlop={10}
              style={styles.copyBtn}
              activeOpacity={0.6}
            >
              <Image
                source={require('../../../../../assets/util/copyicon.png')}
                style={styles.copyIcon}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Address */}
        {pickedAddress ? (
          <Text style={styles.addressText}>{pickedAddress}</Text>
        ) : (
          <Text style={styles.placeholder}>Address not available</Text>
        )}

        {/* CTA */}
        {pickedLocation?.latitude && pickedLocation?.longitude && (
          <TouchableOpacity
            style={styles.directionButton}
            onPress={openInMaps}
            activeOpacity={0.85}
          >
            <Text style={styles.directionText}>Get Directions</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default React.memo(AddressSection);

/* ---------------------------
   Styles
---------------------------- */
const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#eef2f7',

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  title: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#0f172a',
    letterSpacing: 0.2,
  },

  copyBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },

  copyIcon: {
    width: 18,
    height: 18,
    tintColor: '#475569',
  },

  addressText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#334155',
    lineHeight: 22,
    marginBottom: 16,
  },

  placeholder: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#94a3b8',
    marginBottom: 16,
  },

  directionButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#1d4ed8',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 999,
  },

  directionText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
});
