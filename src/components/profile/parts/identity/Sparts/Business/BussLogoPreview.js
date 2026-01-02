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
const FALLBACK_IMAGE = require('../../../../../assets/util/no-img.png');

/* ----------------------------------
   Utils
----------------------------------- */
const isValidImage = src =>
  typeof src === 'string' &&
  src.trim() !== '' &&
  src !== 'null' &&
  src !== 'undefined';

const calculateAge = birthYear => {
  const year = Number(birthYear);
  const currentYear = new Date().getFullYear();
  if (!year || year < 1900 || year > currentYear) return null;
  return currentYear - year;
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
const BussLogoPreview = ({ logoSrc, birthYear }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  console.log(birthYear);
  const age = calculateAge(birthYear);

  const imageUri = useMemo(() => {
    if (!isValidImage(logoSrc)) return null;
    return resolveMediaUrl(logoSrc);
  }, [logoSrc]);

  const showRemoteImage = Boolean(imageUri && !failed);

  const onLoad = useCallback(() => setLoaded(true), []);
  const onError = useCallback(() => {
    setFailed(true);
    setLoaded(true);
  }, []);

  return (
    <>
      <View style={styles.container}>
        {/* LOGO IMAGE */}
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={!showRemoteImage}
          onPress={() => setPreviewVisible(true)}
        >
          <View style={styles.imageWrapper}>
            {!loaded && <Skeleton />}

            <Image
              source={showRemoteImage ? { uri: imageUri } : FALLBACK_IMAGE}
              style={styles.logoImage}
              resizeMode="cover"
              onLoad={onLoad}
              onError={onError}
            />
          </View>
        </TouchableOpacity>

        {/* AGE BADGE */}
        {age !== null && (
          <View style={styles.ageBadge}>
            <Text style={styles.ageText}>{age} Y</Text>
          </View>
        )}
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

export default React.memo(BussLogoPreview);

/* ----------------------------------
   Styles
----------------------------------- */
const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginLeft: 36,
    marginTop: -60,
  },

  imageWrapper: {
    width: 140,
    height: 140,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },

  logoImage: {
    width: '100%',
    height: '100%',
  },

  skeleton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E5E7EB',
  },

  ageBadge: {
    position: 'absolute',
    left: 150,
    top: 69,
    backgroundColor: '#F9FAFB',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  ageText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullImage: {
    width: '85%',
    height: '60%',
    borderRadius: 12,
  },
});
