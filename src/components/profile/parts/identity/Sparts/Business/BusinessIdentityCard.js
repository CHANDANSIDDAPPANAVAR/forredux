import React, { memo, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { resolveMediaUrl } from '../../../../../../services/mediaUrl';

const FALLBACK_LOGO = require('../../../../../assets/util/no-img.png');

const getImageSource = uri =>
  uri && typeof uri === 'string' ? { uri } : FALLBACK_LOGO;

const BusinessIdentityCard = ({
  logo,
  businessName,
  tagline,
  category,
  city,
  startYear, // e.g. 2002
}) => {
  const [previewUri, setPreviewUri] = useState(null);

  const resolvedLogo = logo ? resolveMediaUrl(logo) : null;

  const openPreview = useCallback(uri => {
    if (uri) setPreviewUri(uri);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewUri(null);
  }, []);

  /* Experience calculation */
  const experienceText = useMemo(() => {
    if (!startYear) return null;
    const currentYear = new Date().getFullYear();
    const years = Math.max(currentYear - startYear, 0);
    return `${years}+ Years Experience`;
  }, [startYear]);

  return (
    <View style={styles.container}>
      {/* LOGO */}
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() => openPreview(resolvedLogo)}
        style={styles.logoWrapper}
      >
        <Image
          source={getImageSource(resolvedLogo)}
          style={styles.logo}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* BUSINESS NAME */}
      {!!businessName && <Text style={styles.name}>{businessName}</Text>}

      {/* TAGLINE */}
      {!!tagline && (
        <Text style={styles.tagline} numberOfLines={3}>
          {tagline}
        </Text>
      )}

      {/* CATEGORY + CITY */}
      {(category || city) && (
        <View style={styles.metaContainer}>
          {!!category && (
            <View style={styles.metaChipPrimary}>
              <Text style={styles.metaTextPrimary}>{category}</Text>
            </View>
          )}

          {!!city && <Text style={styles.cityText}>📍 {city}</Text>}
        </View>
      )}

      {/* EXPERIENCE */}
      {!!startYear && (
        <View style={styles.experienceCard}>
          <Text style={styles.sinceText}>Since {startYear}</Text>
          {!!experienceText && (
            <Text style={styles.experienceText}>{experienceText}</Text>
          )}
        </View>
      )}

      {/* IMAGE PREVIEW */}
      <Modal
        visible={!!previewUri}
        transparent
        animationType="fade"
        onRequestClose={closePreview}
      >
        <Pressable style={styles.previewBackdrop} onPress={closePreview}>
          <Image
            source={{ uri: previewUri }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>
    </View>
  );
};

export default memo(BusinessIdentityCard);

/* =======================
   STYLES
======================= */

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },

  /* Logo */
  logoWrapper: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -90,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  logo: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },

  /* Name */
  name: {
    marginTop: 10,
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#0f172a',
    textAlign: 'center',
  },

  /* Tagline */
  tagline: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 36,
    lineHeight: 19,
  },

  /* Meta */
  metaContainer: {
    marginTop: 14,
    alignItems: 'center',
  },

  metaChipPrimary: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },

  metaTextPrimary: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: '#4338ca',
  },

  cityText: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6b7280',
    opacity: 0.9,
  },

  /* Experience */
  experienceCard: {
    marginTop: 18,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 14,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },

  sinceText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
  },

  experienceText: {
    marginTop: 2,
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#6b7280',
  },

  /* Preview */
  previewBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  previewImage: {
    width: '100%',
    height: '100%',
  },
});
