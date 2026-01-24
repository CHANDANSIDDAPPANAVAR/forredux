import React, { memo, useEffect, useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import { resolveMediaUrl } from '../../../../../../services/mediaUrl';

/* ----------------------------------
   CONSTANTS
----------------------------------- */
const FALLBACK_IMAGE = require('../../../../../assets/util/no-img.png');

/* ----------------------------------
   UTILS
----------------------------------- */
const isValidRemoteImage = src =>
  typeof src === 'string' &&
  src.trim() !== '' &&
  src !== 'null' &&
  src !== 'undefined';

/* ----------------------------------
   SKELETON
----------------------------------- */
const Skeleton = memo(() => {
  const opacity = useMemo(() => new Animated.Value(0.4), []);

  useEffect(() => {
    const loop = Animated.loop(
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
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return <Animated.View style={[styles.skeleton, { opacity }]} />;
});

/* ----------------------------------
   EVENT IMAGE
----------------------------------- */
const EventImage = ({ source }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const resolvedUri = useMemo(() => {
    if (!isValidRemoteImage(source)) return null;
    return resolveMediaUrl(source);
  }, [source]);

  // ✅ NO IMAGE AT ALL → NO UI
  if (!resolvedUri) {
    return null;
  }

  const showImage = !failed;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setPreviewVisible(true)}
      >
        <View style={styles.avatarWrapper}>
          {!loaded && <Skeleton />}

          <Image
            source={{ uri: resolvedUri }}
            style={styles.avatar}
            resizeMode="cover"
            onLoad={() => setLoaded(true)}
            onError={() => {
              setFailed(true);
              setLoaded(true);
            }}
          />
        </View>
      </TouchableOpacity>

      {showImage && (
        <Modal
          visible={previewVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setPreviewVisible(false)}
        >
          <Pressable
            style={styles.modalBg}
            onPress={() => setPreviewVisible(false)}
          >
            <Image
              source={{ uri: resolvedUri }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

export default memo(EventImage);

/* ----------------------------------
   STYLES
----------------------------------- */
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: -80,
    zIndex: 5,
  },
  avatarWrapper: {
    width: 240,
    height: 180,
    borderRadius: 15,
    backgroundColor: '#f3f4f6',
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#fff',

    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },

  skeleton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#e5e7eb',
  },

  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullImage: {
    width: '90%',
    height: '80%',
    borderRadius: 12,
  },
});
