import React, { useMemo, useState, useCallback, useEffect, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Animated,
  Modal,
  Pressable,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { resolveMediaUrl } from '../../../../../../services/mediaUrl';
import { showToast } from '../../../../../util/alerts/toast';

/* ----------------------------------
   CONSTANTS
----------------------------------- */
const FALLBACK_AVATAR = require('../../../../../assets/util/no-img.png');
const COPY_ICON = require('../../../../../assets/util/copyicon.png');

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
    const anim = Animated.loop(
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

    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return <Animated.View style={[styles.skeleton, { opacity }]} />;
});

/* ----------------------------------
   COMPONENT
----------------------------------- */
const ProfileIdentityCard = ({
  profileImage,
  name,
  tagline,
  location,
  phoneNumber,
  upiId,
  payeeName = 'User',
  onChatPress,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [showUpiError, setShowUpiError] = useState(false);
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);

  /* Resolve profile image once */
  const resolvedUri = useMemo(() => {
    if (!isValidRemoteImage(profileImage)) return null;
    return resolveMediaUrl(profileImage);
  }, [profileImage]);

  const showRemoteImage = !!resolvedUri && !failed;

  /* Image handlers */
  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setFailed(true);
    setLoaded(true);
  }, []);

  /* Call */
  const callUser = useCallback(() => {
    if (!phoneNumber) return;
    Linking.openURL(`tel:${phoneNumber}`);
  }, [phoneNumber]);

  /* UPI payment */
  const handleUpiPay = useCallback(async () => {
    if (!upiId) {
      setShowUpiError(true);
      return;
    }

    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}`;

    try {
      const supported = await Linking.canOpenURL(upiUrl);
      if (!supported) {
        setShowUpiError(true);
        return;
      }
      await Linking.openURL(upiUrl);
    } catch {
      setShowUpiError(true);
    }
  }, [upiId, payeeName]);

  const handleCopyUpi = useCallback(() => {
    if (!upiId) return;
    Clipboard.setString(upiId);
    showToast('UPI ID copied to clipboard');
    setShowUpiError(false);
  }, [upiId]);

  return (
    <View style={styles.card}>
      {/* FLOATING AVATAR (TAP TO PREVIEW) */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => showRemoteImage && setShowAvatarPreview(true)}
        style={styles.avatarFloating}
      >
        {!loaded && <Skeleton />}
        <Image
          source={showRemoteImage ? { uri: resolvedUri } : FALLBACK_AVATAR}
          style={styles.avatar}
          resizeMode="cover"
          onLoad={handleLoad}
          onError={handleError}
        />
      </TouchableOpacity>

      {!!name && <Text style={styles.name}>{name}</Text>}
      {!!tagline && <Text style={styles.tagline}>{tagline}</Text>}
      {!!location && <Text style={styles.location}>{location}</Text>}

      {/* ACTION ROW */}
      <View style={styles.actionsRow}>
        {!!phoneNumber && (
          <TouchableOpacity style={styles.actionBtn} onPress={callUser}>
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
        )}

        {!!onChatPress && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.chatBtnOverride]}
            onPress={onChatPress}
          >
            <Text style={styles.actionText}>Chat</Text>
          </TouchableOpacity>
        )}

        {!!upiId && (
          <TouchableOpacity style={styles.upiActionBtn} onPress={handleUpiPay}>
            <Text style={styles.upiActionText}>Pay</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* AVATAR FULLSCREEN PREVIEW */}
      <Modal
        visible={showAvatarPreview}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAvatarPreview(false)}
      >
        <Pressable
          style={styles.previewBackdrop}
          onPress={() => setShowAvatarPreview(false)}
        >
          <Image
            source={{ uri: resolvedUri }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>

      {/* UPI FALLBACK MODAL */}
      <Modal
        visible={showUpiError}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUpiError(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Unable to open UPI app</Text>

            <Text style={styles.modalMessage}>
              Please copy the UPI ID below and pay manually from your UPI app.
            </Text>

            <View style={styles.upiBox}>
              <Text selectable style={styles.upiId}>
                {upiId || '—'}
              </Text>

              <Pressable onPress={handleCopyUpi} hitSlop={10}>
                <Image source={COPY_ICON} style={styles.copyImage} />
              </Pressable>
            </View>

            <TouchableOpacity
              style={styles.okButton}
              onPress={() => setShowUpiError(false)}
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default memo(ProfileIdentityCard);

/* ----------------------------------
   STYLES
----------------------------------- */
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 18,
    paddingTop: 70,
    paddingBottom: 22,
    paddingHorizontal: 20,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  avatarFloating: {
    position: 'absolute',
    top: -95,
    width: 190,
    height: 190,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    borderWidth: 6,
    borderColor: 'rgb(188, 186, 186)',

    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  avatar: {
    width: '100%',
    height: '100%',
  },

  skeleton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#e5e7eb',
  },

  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 30,
  },

  tagline: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 18,
  },

  location: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },

  actionsRow: {
    flexDirection: 'row',
    marginTop: 18,
    gap: 12,
  },

  actionBtn: {
    backgroundColor: '#2563EB', // blue-600
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,

    shadowColor: '#2563EB',
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  }, // reuse actionBtn but override color when rendering Chat
  chatBtnOverride: {
    backgroundColor: '#4F46E5', // indigo-600
    shadowColor: '#4F46E5',
  },

  actionText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  upiActionBtn: {
    backgroundColor: '#16A34A', // emerald-600
    paddingVertical: 12, // slightly taller = priority
    paddingHorizontal: 26,
    borderRadius: 14,

    shadowColor: '#16A34A',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },

  previewBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  previewImage: {
    width: '90%',
    height: '80%',
    borderRadius: 12,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '88%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 22,

    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },

  modalMessage: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 18,
    lineHeight: 20,
  },

  upiBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  upiActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  upiId: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#020617',
  },

  copyImage: {
    width: 22,
    height: 22,
    tintColor: '#2563eb',
  },

  okButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 12,
  },

  okButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
