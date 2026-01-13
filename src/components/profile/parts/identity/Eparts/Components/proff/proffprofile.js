import React, { useState, useCallback, useMemo } from 'react';
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

  // Local (Android / iOS)
  if (uri.startsWith('file://') || uri.startsWith('content://')) {
    return { uri };
  }

  // Absolute device paths
  if (
    uri.startsWith('/storage/') ||
    uri.startsWith('/data/') ||
    uri.startsWith('/var/') ||
    uri.startsWith('/private/var/') ||
    uri.startsWith('/Users/')
  ) {
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
const ProfileImageprofinput = ({ profileImage, setProfileImage }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const pickProfileImage = useCallback(async () => {
    try {
      const image = await ImagePicker.openPicker({
        cropping: true,
        cropperToolbarTitle: 'Crop Profile Photo',
        cropperCircleOverlay: true,
        width: 600,
        height: 600,
        mediaType: 'photo',
      });

      // store only string path (clean state)
      setProfileImage(image.path);
      setShowDelete(false);
    } catch {
      // cancelled → do nothing
    }
  }, [setProfileImage]);

  const confirmDelete = useCallback(() => {
    setProfileImage(null);
    setShowDelete(false);
    setConfirmVisible(false);
  }, [setProfileImage]);

  const imageSource = useMemo(
    () =>
      resolveImageSource(profileImage) ||
      require('../../../../../../assets/choseaccount/assets/noprofile.png'),
    [profileImage],
  );

  return (
    <>
      <View style={styles.profileContainer}>
        <View style={styles.borderWrapper}>
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
            <Image
              source={imageSource}
              style={styles.profileImage}
              resizeMode="cover"
            />

            {/* Edit */}
            <TouchableOpacity
              style={styles.editIconMid}
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
      </View>

      {/* Confirm Delete */}
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
   STYLES (unchanged design)
----------------------------------- */
const IMAGE_SIZE = 190;
const BORDER_SIZE = 6;

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    marginTop: -100,
    zIndex: 2,
    elevation: 2,
  },
  borderWrapper: {
    width: IMAGE_SIZE + BORDER_SIZE * 2,
    height: IMAGE_SIZE + BORDER_SIZE * 2,
    borderRadius: (IMAGE_SIZE + BORDER_SIZE * 2) / 2,
    borderWidth: BORDER_SIZE,
    borderColor: 'rgb(188, 186, 186)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#ccc',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  editIconMid: {
    position: 'absolute',
    right: 30,
    bottom: 25,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    zIndex: 2,
  },
  deleteIconTop: {
    position: 'absolute',
    left: 25,
    top: 30,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    zIndex: 2,
  },
  icon: {
    width: 22,
    height: 22,
  },
});

export default ProfileImageprofinput;
