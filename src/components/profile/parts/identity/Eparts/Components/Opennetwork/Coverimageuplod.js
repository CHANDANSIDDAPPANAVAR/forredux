import React, { useState } from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { resolveMediaUrl } from '../../../../../../../services/mediaUrl';
import ConfirmModal from '../../../../../../util/alerts/ConfirmModal';

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

  // Local URIs
  if (uri.startsWith('file://') || uri.startsWith('content://')) {
    return { uri };
  }

  // Android local absolute
  if (uri.startsWith('/storage/') || uri.startsWith('/data/')) {
    return { uri: `file://${uri}` };
  }

  // iOS local absolute
  if (uri.startsWith('/var/') || uri.startsWith('/Users/')) {
    return { uri: `file://${uri}` };
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
const CoverImagePicker = ({ coverImage, setCoverImage }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const pickCoverImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 600,
        height: 400,
        cropping: true,

        cropperToolbarTitle: 'Crop Cover Photo',
        mediaType: 'photo',
      });

      setCoverImage(image.path);
      setShowDelete(false);
    } catch {
      // cancelled
    }
  };

  const confirmDelete = () => {
    setCoverImage(null);
    setShowDelete(false);
    setConfirmVisible(false);
  };

  const imageSource =
    resolveImageSource(coverImage) ||
    require('../../../../../../assets/util/no-img.png');

  return (
    <>
      <TouchableOpacity
        style={styles.coverImageContainer}
        activeOpacity={0.9}
        onPress={() => {
          if (isValidImage(coverImage)) {
            setShowDelete(prev => !prev);
          } else {
            pickCoverImage();
          }
        }}
      >
        <Image source={imageSource} style={styles.coverImage} />

        {/* Edit */}
        <TouchableOpacity
          style={styles.editIconTop}
          onPress={pickCoverImage}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../../../../assets/choseaccount/assets/edit.png')}
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* Delete */}
        {showDelete && isValidImage(coverImage) && (
          <TouchableOpacity
            style={styles.deleteIconTop}
            onPress={() => setConfirmVisible(true)}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../../../../../assets/choseaccount/assets/delete-BOX.png')}
              style={[styles.icon, { tintColor: 'red' }]}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* Confirm Modal */}
      <ConfirmModal
        visible={confirmVisible}
        title="Remove Cover Photo"
        message="Are you sure you want to delete this cover image?"
        confirmText="Delete"
        confirmColor="#EF4444"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

/* ----------------------------------
   STYLES
----------------------------------- */
const styles = StyleSheet.create({
  coverImageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#f3f4f6',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editIconTop: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    backgroundColor: '#e9e9e9ff',
    borderRadius: 10,
    padding: 6,
  },
  deleteIconTop: {
    position: 'absolute',
    left: 14,
    top: 14,
    backgroundColor: '#e9e9e9ff',
    borderRadius: 10,
    padding: 6,
  },
  icon: {
    width: 19,
    height: 19,
  },
});

export default CoverImagePicker;
