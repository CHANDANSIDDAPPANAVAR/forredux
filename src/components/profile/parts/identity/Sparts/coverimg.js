import React, { useMemo, useState, useCallback, useEffect, memo } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import { resolveMediaUrl } from '../../../../../services/mediaUrl';

/* ----------------------------------
   CONSTANTS
----------------------------------- */
const FALLBACK_IMAGE = require('../../../../assets/util/no-img.png');

/* ----------------------------------
   UTILS
----------------------------------- */
const isValidRemoteImage = source =>
  typeof source === 'string' &&
  source.trim() !== '' &&
  source !== 'null' &&
  source !== 'undefined';

/* ----------------------------------
   SKELETON SHIMMER
----------------------------------- */
const Skeleton = memo(() => {
  const opacity = useMemo(() => new Animated.Value(0.4), []);

  useEffect(() => {
    const animation = Animated.loop(
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

    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return <Animated.View style={[styles.skeleton, { opacity }]} />;
});

/* ----------------------------------
   COVER IMAGE
----------------------------------- */
const CoverImage = ({ source, style }) => {
  console.log('cover', source);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  /* Resolve remote image only once */
  const resolvedUri = useMemo(() => {
    if (!isValidRemoteImage(source)) return null;
    return resolveMediaUrl(source);
  }, [source]);

  const showRemoteImage = !!resolvedUri && !failed;

  /* Handlers */
  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setFailed(true);
    setLoaded(true); // stop skeleton
  }, []);

  const openPreview = useCallback(() => {
    if (showRemoteImage) setPreviewVisible(true);
  }, [showRemoteImage]);

  const closePreview = useCallback(() => {
    setPreviewVisible(false);
  }, []);

  return (
    <>
      {/* COVER IMAGE */}
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={!showRemoteImage}
        onPress={openPreview}
      >
        <View style={[styles.wrapper, style]}>
          {/* Skeleton while loading */}
          {!loaded && <Skeleton />}

          <Image
            source={showRemoteImage ? { uri: resolvedUri } : FALLBACK_IMAGE}
            style={[
              styles.coverImage,
              !showRemoteImage && styles.fallbackImage,
            ]}
            resizeMode="cover"
            onLoad={handleLoad}
            onError={handleError}
            accessibilityRole="image"
            accessibilityLabel="Profile cover image"
          />
        </View>
      </TouchableOpacity>

      {/* FULLSCREEN PREVIEW */}
      {showRemoteImage && (
        <Modal
          visible={previewVisible}
          transparent
          animationType="fade"
          onRequestClose={closePreview}
        >
          <Pressable style={styles.modalBackground} onPress={closePreview}>
            <Image
              source={{ uri: resolvedUri }}
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
   STYLES
----------------------------------- */
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 250,
    backgroundColor: '#f3f4f6',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  fallbackImage: {
    opacity: 0.9,
  },
  skeleton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#e5e7eb',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '95%',
    height: '80%',
    borderRadius: 10,
  },
});

export default memo(CoverImage);
