import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { resolveMediaUrl } from '../../../../../../services/mediaUrl';

/* ----------------------------------
   Constants
----------------------------------- */
const FALLBACK_IMAGE = require('../../../../../assets/choseaccount/assets/noprofile.png');

/* ----------------------------------
   Utils
----------------------------------- */
const isValidRemoteImage = src =>
  typeof src === 'string' &&
  src.trim() !== '' &&
  src !== 'null' &&
  src !== 'undefined';

const calculateAge = birthYear => {
  const year = Number(birthYear);
  const current = new Date().getFullYear();
  if (!year || year < 1900 || year > current) return null;
  return current - year;
};

/* ----------------------------------
   Skeleton Loader
----------------------------------- */
const Skeleton = () => {
  const opacity = useMemo(() => new Animated.Value(0.4), []);

  Animated.loop(
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0.4,
        duration: 700,
        useNativeDriver: true,
      }),
    ]),
  ).start();

  return <Animated.View style={[styles.skeleton, { opacity }]} />;
};

/* ----------------------------------
   Component
----------------------------------- */
const ProfileImageWithInfo = ({ profileSrc, gender, birthYear }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const age = calculateAge(birthYear);

  const imageUri = useMemo(() => {
    if (!isValidRemoteImage(profileSrc)) return null;
    return resolveMediaUrl(profileSrc);
  }, [profileSrc]);

  const showRemoteImage = imageUri && !failed;

  const onLoad = useCallback(() => setLoaded(true), []);
  const onError = useCallback(() => {
    setFailed(true);
    setLoaded(true);
  }, []);

  return (
    <>
      <View style={styles.container}>
        {/* PROFILE IMAGE */}
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={!showRemoteImage}
          onPress={() => setPreviewVisible(true)}
        >
          <View style={styles.imageWrapper}>
            {!loaded && <Skeleton />}

            <Image
              source={showRemoteImage ? { uri: imageUri } : FALLBACK_IMAGE}
              style={styles.profileImage}
              resizeMode="cover"
              onLoad={onLoad}
              onError={onError}
            />
          </View>
        </TouchableOpacity>

        {/* INFO BADGES */}
        <View style={styles.infoRow}>
          {gender ? (
            <View style={[styles.badge, styles.genderBadge]}>
              <Text style={styles.badgeText}>{gender}</Text>
            </View>
          ) : (
            <View style={styles.badgeSpacer} />
          )}

          {age !== null ? (
            <View style={[styles.badge, styles.ageBadge]}>
              <Text style={styles.badgeText}>{age} Y</Text>
            </View>
          ) : (
            <View style={styles.badgeSpacer} />
          )}
        </View>
      </View>

      {/* FULL IMAGE PREVIEW */}
      {showRemoteImage && (
        <Modal
          visible={previewVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setPreviewVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setPreviewVisible(false)}
          >
            <Image
              source={{ uri: imageUri }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </Pressable>
        </Modal>
      )}
    </>
  );
};

/* ----------------------------------
   Styles
----------------------------------- */
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: -80,
  },

  imageWrapper: {
    width: 190,
    height: 190,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    borderWidth: 3,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },

  profileImage: {
    width: '100%',
    height: '100%',
  },

  skeleton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E5E7EB',
  },

  infoRow: {
    position: 'absolute',
    top: 95,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },

  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },

  genderBadge: {
    backgroundColor: '#EEF2FF',
  },

  ageBadge: {
    backgroundColor: '#ECFEFF',
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
  },

  badgeSpacer: {
    width: 50,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullImage: {
    width: '90%',
    height: '80%',
    borderRadius: 12,
  },
});

export default React.memo(ProfileImageWithInfo);
