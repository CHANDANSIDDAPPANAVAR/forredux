import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import { resolveMediaUrl } from '../../../../../../services/mediaUrl';
import ConfirmModal from '../../../../../util/alerts/ConfirmModal';

/* ----------------------------------
   HELPERS
----------------------------------- */
const isValidImage = img =>
  img &&
  img !== 'null' &&
  img !== '' &&
  (typeof img === 'string' || (typeof img === 'object' && img.uri));

const resolveImageSource = img => {
  if (!isValidImage(img)) return null;

  const uri = typeof img === 'string' ? img : img.uri;
  if (!uri) return null;

  // Local paths (Android + iOS)
  if (
    uri.startsWith('file://') ||
    uri.startsWith('content://') ||
    uri.startsWith('/storage/') ||
    uri.startsWith('/data/') ||
    uri.startsWith('/var/') ||
    uri.startsWith('/private/var/') ||
    uri.startsWith('/Users/')
  ) {
    return { uri: uri.startsWith('file://') ? uri : `file://${uri}` };
  }

  // Remote absolute
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return { uri };
  }

  // Backend relative
  return { uri: resolveMediaUrl(uri) };
};

/* ----------------------------------
   COMPONENT
----------------------------------- */
const EventImagePicker = ({ eventImage, setEventImage }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const pickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,

        // 🎯 Event image aspect
        width: 600,
        height: 500,

        compressImageQuality: 0.9,
        forceJpg: true,
        cropperToolbarTitle: 'Crop Event Image',
      });

      if (!image?.path) return;

      setEventImage({ uri: image.path });
      setShowDelete(false);
    } catch {
      // silent cancel
    }
  };

  const confirmDelete = () => {
    setEventImage(null);
    setShowDelete(false);
    setConfirmVisible(false);
  };

  const imageSource =
    resolveImageSource(eventImage) ||
    require('../../../../../assets/util/no-img.png');

  return (
    <>
      <View style={styles.container}>
        <View style={styles.borderWrapper}>
          <TouchableOpacity
            style={styles.imageWrapper}
            activeOpacity={0.9}
            onPress={() =>
              isValidImage(eventImage)
                ? setShowDelete(prev => !prev)
                : pickImage()
            }
          >
            <Image source={imageSource} style={styles.image} />

            {/* Edit */}
            <TouchableOpacity
              style={styles.editIconWrapper}
              onPress={pickImage}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../../../../assets/choseaccount/assets/edit.png')}
                style={styles.icon}
              />
            </TouchableOpacity>

            {/* Delete */}
            {showDelete && isValidImage(eventImage) && (
              <TouchableOpacity
                style={styles.deleteIconWrapper}
                onPress={() => setConfirmVisible(true)}
                activeOpacity={0.7}
              >
                <Image
                  source={require('../../../../../assets/choseaccount/assets/delete-BOX.png')}
                  style={[styles.icon, { tintColor: '#ef4444' }]}
                />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirm delete */}
      <ConfirmModal
        visible={confirmVisible}
        title="Remove Event Image"
        message="Are you sure you want to delete this event image?"
        confirmText="Delete"
        confirmColor="#ef4444"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default EventImagePicker;

/* ----------------------------------
   STYLES
----------------------------------- */
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: -90,
    zIndex: 2,
    elevation: 2,
  },
  borderWrapper: {
    borderRadius: 14,
    borderWidth: 6,
    borderColor: '#c4c4c4',
    backgroundColor: '#fff',
  },
  imageWrapper: {
    width: 250,
    height: 190,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editIconWrapper: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    padding: 6,
  },
  deleteIconWrapper: {
    position: 'absolute',
    left: 14,
    top: 14,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    padding: 6,
  },
  icon: {
    width: 20,
    height: 20,
  },
});
