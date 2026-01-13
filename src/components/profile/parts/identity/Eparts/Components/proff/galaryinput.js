import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Alert,
  Text,
  Modal,
  Pressable,
  Dimensions,
  StyleSheet,
  Keyboard,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { resolveMediaUrl } from '../../../../../../../services/mediaUrl';

/* ----------------------------------
   CONSTANTS
----------------------------------- */
const { width, height } = Dimensions.get('window');

const MAX_IMAGES = 6;
const NUM_COLUMNS = 3.4;
const GAP = 1;
const PARENT_MARGIN = 10;

const IMAGE_SIZE =
  (width - PARENT_MARGIN * 2 - GAP * (NUM_COLUMNS * 2)) / NUM_COLUMNS;

/* ----------------------------------
   HELPERS (CORE)
----------------------------------- */
const isValidImage = value =>
  typeof value === 'string' && value.trim().length > 0 && value !== 'null';

const isLocalImage = uri =>
  typeof uri === 'string' &&
  (uri.startsWith('file://') || uri.startsWith('content://'));

const isRemoteImage = uri =>
  typeof uri === 'string' &&
  (uri.startsWith('http://') || uri.startsWith('https://'));

const normalizeUri = raw => {
  if (!raw) return null;

  if (raw.startsWith('file://') || raw.startsWith('content://')) {
    return raw;
  }

  if (
    raw.startsWith('/var/') ||
    raw.startsWith('/private/var/') ||
    raw.startsWith('/Users/') ||
    raw.startsWith('/storage/') ||
    raw.startsWith('/data/')
  ) {
    return `file://${raw}`;
  }

  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw;
  }

  return resolveMediaUrl(raw);
};

const getItemUri = item => {
  const raw = item?.uri || item?.url;
  if (!raw) return null;

  // ONLY resolve for UI
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  if (raw.startsWith('file://') || raw.startsWith('content://')) return raw;

  return resolveMediaUrl(raw);
};

/* ----------------------------------
   UPLOAD BUILDER (IMPORTANT)
----------------------------------- */
export const buildGalleryFormData = galleryImages => {
  const formData = new FormData();

  /* Upload ONLY new (local) images */
  const newImages = galleryImages.filter(
    item => item.uri.startsWith('file://') || item.uri.startsWith('content://'),
  );

  newImages.forEach((item, index) => {
    formData.append('images', {
      uri: item.uri,
      type: 'image/jpeg',
      name: `gallery_${Date.now()}_${index}.jpg`,
    });
  });

  /* Send existing images separately */
  const existingImages = galleryImages
    .filter(item => item.uri.startsWith('/uploads'))
    .map(item => item.uri);

  formData.append('existingImages', JSON.stringify(existingImages));

  return formData;
};

/* ----------------------------------
   COMPONENT
----------------------------------- */
const GalleryInput = ({ galleryImages = [], setGalleryImages }) => {
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  console.log(galleryImages);
  /* -------- VALID IMAGES -------- */
  const validImages = useMemo(
    () => galleryImages.filter(item => isValidImage(item?.uri || item?.url)),
    [galleryImages],
  );
  const getRawUri = item => item?.uri || item?.url || null;

  /* -------- PICK IMAGES -------- */
  const pickImages = useCallback(async () => {
    if (validImages.length >= MAX_IMAGES) {
      Alert.alert('Limit reached', `You can add up to ${MAX_IMAGES} images`);
      return;
    }

    try {
      const images = await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
        maxFiles: MAX_IMAGES - validImages.length,
      });

      if (!Array.isArray(images) || images.length === 0) return;

      const selected = images.map(img => ({
        uri: img.path.startsWith('file://') ? img.path : `file://${img.path}`,
      }));

      setGalleryImages(prev => {
        const merged = [...prev, ...selected];

        const uniqueMap = new Map();
        merged.forEach(item => {
          const rawUri = getRawUri(item);
          if (rawUri) uniqueMap.set(rawUri, { uri: rawUri });
        });

        return Array.from(uniqueMap.values()).slice(0, MAX_IMAGES);
      });
    } catch {
      // user cancelled
    }
  }, [validImages.length, setGalleryImages]);

  /* -------- REMOVE IMAGE -------- */
  const removeImage = useCallback(
    uriToRemove => {
      Keyboard.dismiss();

      Alert.alert(
        'Remove Image',
        'Are you sure you want to remove this image?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => {
              setGalleryImages(prev =>
                prev.filter(item => getItemUri(item) !== uriToRemove),
              );
            },
          },
        ],
      );
    },
    [setGalleryImages],
  );

  /* -------- VIEWER -------- */
  const openViewer = useCallback(index => {
    Keyboard.dismiss();
    setViewerIndex(index);
    setViewerVisible(true);
  }, []);

  const viewerImageUri =
    validImages[viewerIndex] && getItemUri(validImages[viewerIndex]);

  /* ---------------------------------- */
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Gallery / Portfolio Images</Text>

      <View style={styles.gridContainer}>
        {validImages.map((item, index) => {
          const uri = getItemUri(item);
          if (!uri) return null;

          return (
            <View key={uri} style={styles.imageContainer}>
              <TouchableOpacity
                onPress={() => openViewer(index)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeImage(uri)}
                activeOpacity={0.8}
              >
                <Text style={styles.removeText}>×</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {validImages.length < MAX_IMAGES && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={pickImages}
            activeOpacity={0.7}
          >
            <Text style={styles.addIcon}>＋</Text>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.countText}>
        {validImages.length}/{MAX_IMAGES} images added
      </Text>

      {/* IMAGE VIEWER */}
      <Modal
        visible={viewerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setViewerVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setViewerVisible(false)}
        >
          {viewerImageUri && (
            <Image
              source={{ uri: viewerImageUri }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </Pressable>
      </Modal>
    </View>
  );
};

export default GalleryInput;

/* ----------------------------------
   STYLES
----------------------------------- */
const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
    marginLeft: 5,
    fontFamily: 'Poppins-SemiBold',
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: PARENT_MARGIN,
  },

  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: GAP,
    position: 'relative',
    backgroundColor: '#f2f2f2',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  removeBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  removeText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'Poppins-SemiBold',
  },

  addBtn: {
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    borderRadius: 8,
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    alignItems: 'center',
    margin: GAP,
  },

  addIcon: {
    fontSize: 24,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },

  addText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },

  countText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 12,
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullImage: {
    width,
    height: height * 0.7,
  },
});
