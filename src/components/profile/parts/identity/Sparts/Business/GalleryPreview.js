import React, { useState, useMemo, useCallback, memo } from 'react';
import {
  View,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { resolveMediaUrl } from '../../../../../../services/mediaUrl';

/* ----------------------------------
   CONSTANTS
----------------------------------- */
const { width, height } = Dimensions.get('window');

const NUM_COLUMNS = 3;
const GAP = 2;

// 👇 Parent already has padding: 20
const AVAILABLE_WIDTH = width - 42;

const IMAGE_SIZE = (AVAILABLE_WIDTH - GAP * (NUM_COLUMNS * 2)) / NUM_COLUMNS;

/* ----------------------------------
   UTILS
----------------------------------- */
const isValidImage = src =>
  typeof src === 'string' &&
  src.trim() !== '' &&
  src !== 'null' &&
  src !== 'undefined';

const resolveImage = raw => {
  if (!raw) return null;
  if (raw.startsWith('file://')) return raw;
  return resolveMediaUrl(raw);
};

/* ----------------------------------
   COMPONENT
----------------------------------- */
const GalleryPreview = ({ galleryImages = [] }) => {
  /* ✅ HOOKS — ALWAYS EXECUTED */
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = useMemo(() => {
    return galleryImages
      .map(item => item?.uri || item?.url || item)
      .filter(isValidImage)
      .map(resolveImage)
      .filter(Boolean);
  }, [galleryImages]);

  const openViewer = useCallback(index => {
    setCurrentIndex(index);
    setVisible(true);
  }, []);

  const closeViewer = useCallback(() => {
    setVisible(false);
  }, []);

  const renderThumb = useCallback(
    ({ item, index }) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => openViewer(index)}
        style={styles.thumbWrap}
      >
        <Image source={{ uri: item }} style={styles.thumb} />
      </TouchableOpacity>
    ),
    [openViewer],
  );

  const renderFullImage = useCallback(
    ({ item }) => (
      <View style={styles.fullWrap}>
        <Image
          source={{ uri: item }}
          style={styles.fullImage}
          resizeMode="contain"
        />
      </View>
    ),
    [],
  );

  /* ❗ NO EARLY RETURN BEFORE HOOKS */
  if (images.length === 0) {
    return <View />;
  }

  return (
    <>
      {/* IMAGE GRID */}
      <FlatList
        data={images}
        numColumns={NUM_COLUMNS}
        renderItem={renderThumb}
        keyExtractor={(_, i) => i.toString()}
        scrollEnabled={false}
        contentContainerStyle={styles.grid}
      />

      {/* FULLSCREEN VIEWER */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={closeViewer}
      >
        <Pressable style={styles.modal} onPress={closeViewer}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            initialScrollIndex={currentIndex}
            renderItem={renderFullImage}
            keyExtractor={(_, i) => i.toString()}
            getItemLayout={(_, i) => ({
              length: width,
              offset: width * i,
              index: i,
            })}
            showsHorizontalScrollIndicator={false}
          />
        </Pressable>
      </Modal>
    </>
  );
};

export default memo(GalleryPreview);

/* ----------------------------------
   STYLES
----------------------------------- */
const styles = StyleSheet.create({
  grid: {
    paddingVertical: 5, // ✅ parent already has padding: 20
  },
  thumbWrap: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: GAP,
  },
  thumb: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  fullWrap: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width,
    height: height * 0.75,
  },
});
