import React, { useState } from 'react';
import {
  View,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { mediaUrl } from '../../../../../services/mediaUrl';

const resolveImageUrl = url => {
  if (!url) {
    return null;
  }
  if (url.startsWith('http')) {
    return url.includes('localhost')
      ? url.replace('localhost', '10.0.2.2')
      : url;
  }
  return `${getBaseUrl()}${url}`;
};

const isValidImage = img =>
  img &&
  img !== 'null' &&
  img !== '' &&
  (typeof img === 'string' || (typeof img === 'object' && img.uri));

const CoverImage = ({ source, style }) => {
  const [showModal, setShowModal] = useState(false);

  let imageSource = require('../../assets/no-imge-p.png');
  let previewUri = null;

  if (isValidImage(source)) {
    const uri =
      typeof source === 'string'
        ? resolveImageUrl(source)
        : source.uri?.startsWith('file://')
        ? source.uri
        : resolveImageUrl(source.uri);

    if (uri) {
      imageSource = { uri };
      previewUri = uri;
    }
  }

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => previewUri && setShowModal(true)}
      >
        <Image source={imageSource} style={styles.coverImage} />
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade">
        <Pressable
          style={styles.modalBackground}
          onPress={() => setShowModal(false)}
        >
          <Image
            source={{ uri: previewUri }}
            style={styles.fullImage}
            resizeMode="cover"
          />
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  coverImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#f6f6f6',
    resizeMode: 'cover',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '30%',
    borderRadius: 6,
  },
});

export default CoverImage;
