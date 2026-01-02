import React, { useState, memo } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from 'react-native';
import { resolveMediaUrl } from '../../../../../../services/mediaUrl';

/* ----------------------------------
   CONSTANTS
----------------------------------- */
const { width } = Dimensions.get('window');
const MODAL_IMAGE_SIZE = width * 0.8;

/* ----------------------------------
   UTILS
----------------------------------- */
const isValidImage = img =>
  !!img &&
  img !== 'null' &&
  img !== '' &&
  (typeof img === 'string' || (typeof img === 'object' && img.uri));

const resolveImage = src => {
  if (!src) return null;

  if (typeof src === 'string') {
    if (src.startsWith('http') || src.startsWith('file://')) {
      return src;
    }
    return resolveMediaUrl(src);
  }

  if (typeof src === 'object' && src.uri) {
    if (src.uri.startsWith('file://') || src.uri.startsWith('http')) {
      return src.uri;
    }
    return resolveMediaUrl(src.uri);
  }

  return null;
};

const calculateAgeFromYear = birthYear => {
  const year = parseInt(birthYear, 10);
  const currentYear = new Date().getFullYear();

  if (!birthYear || isNaN(year) || year < 1900 || year > currentYear) {
    return '';
  }
  return currentYear - year;
};

/* ----------------------------------
   COMPONENT
----------------------------------- */
const Profprofile = ({ profileSrc, gender, birthYear }) => {
  const [showModal, setShowModal] = useState(false);

  const age = calculateAgeFromYear(birthYear);
  const resolvedImageUri = isValidImage(profileSrc)
    ? resolveImage(profileSrc)
    : null;

  const imageSource = resolvedImageUri
    ? { uri: resolvedImageUri }
    : require('../../../../../assets/util/no-img.png');

  return (
    <View style={styles.container}>
      {/* PROFILE IMAGE */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => resolvedImageUri && setShowModal(true)}
      >
        <Image
          source={imageSource}
          style={styles.profileImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* GENDER & AGE */}
      <View style={styles.infoRow}>
        <View style={[styles.infoBox, { alignItems: 'flex-start' }]}>
          {gender ? <Text style={styles.value}>{gender}</Text> : null}
        </View>

        <View style={[styles.infoBox, { alignItems: 'flex-end' }]}>
          {age !== '' ? <Text style={styles.value}>{age} Y</Text> : null}
        </View>
      </View>

      {/* FULLSCREEN MODAL */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowModal(false)}
        >
          <Image
            source={{ uri: resolvedImageUri }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>
    </View>
  );
};

export default memo(Profprofile);

/* ----------------------------------
   STYLES
----------------------------------- */
const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: -80,
  },

  profileImage: {
    width: 195,
    height: 195,
    borderRadius: 100,
    borderWidth: 6,
    borderColor: 'rgb(194, 194, 194)',
    backgroundColor: '#eaeaea',
  },

  infoRow: {
    position: 'absolute',
    top: 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },

  infoBox: {
    width: '50%',
    minHeight: 22,
    justifyContent: 'center',
  },

  value: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: 'rgb(63, 62, 62)',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullImage: {
    width: MODAL_IMAGE_SIZE,
    height: MODAL_IMAGE_SIZE,
    borderRadius: MODAL_IMAGE_SIZE / 2,
  },
});
