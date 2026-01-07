import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
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

  // Already valid local URIs
  if (uri.startsWith('file://') || uri.startsWith('content://')) {
    return { uri };
  }

  // Android local absolute
  if (uri.startsWith('/storage/') || uri.startsWith('/data/')) {
    return { uri: `file://${uri}` };
  }

  // iOS local absolute (device + simulator)
  if (uri.startsWith('/var/') || uri.startsWith('/Users/')) {
    return { uri: `file://${uri}` };
  }

  // Remote absolute
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return { uri };
  }

  // Backend relative path
  return { uri: resolveMediaUrl(uri) };
};

/* ----------------------------------
   COMPONENT
----------------------------------- */
const ProfileImagePicker = ({ profileImage, setProfileImage }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const pickProfileImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        cropping: true,
        cropperToolbarTitle: 'Crop Profile Photo',
        width: 600,
        height: 600,
        mediaType: 'photo',

        // ❌ no compression – keep full quality
        // compressImageQuality: ❌
        // forceJpg: ❌
      });

      // store only string path
      setProfileImage(image.path);
      setShowDelete(false);
    } catch {
      // cancelled → silent
    }
  };

  const confirmDelete = () => {
    setProfileImage(null);
    setShowDelete(false);
    setConfirmVisible(false);
  };

  const imageSource =
    resolveImageSource(profileImage) ||
    require('../../../../../../assets/choseaccount/assets/noprofile.png');

  return (
    <>
      <View style={styles.profileContainer}>
        <TouchableOpacity
          style={styles.profileImageWrapper}
          activeOpacity={0.9}
          onPress={() => {
            if (isValidImage(profileImage)) {
              setShowDelete(prev => !prev);
            } else {
              pickProfileImage();
            }
          }}
        >
          <Image source={imageSource} style={styles.profileImage} />

          {/* Edit */}
          <TouchableOpacity
            style={styles.editIconTop}
            onPress={pickProfileImage}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../../../../../assets/choseaccount/assets/edit.png')}
              style={styles.icon}
            />
          </TouchableOpacity>

          {/* Delete */}
          {showDelete && isValidImage(profileImage) && (
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
      </View>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        visible={confirmVisible}
        title="Remove Profile Photo"
        message="Are you sure you want to delete this profile photo?"
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
  profileContainer: {
    alignItems: 'center',
    marginTop: -80,
    zIndex: 2,
    elevation: 2,
  },

  profileImageWrapper: {
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

export default ProfileImagePicker;
