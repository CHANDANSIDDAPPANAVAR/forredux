import React, { useCallback, useState, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Image,
} from 'react-native';
import { showToast } from '../../../../../util/alerts/toast';

/* ----------------------------------
   CONSTANTS
----------------------------------- */
const LINK_ICON = require('../../../../../assets/icons/link.png');

const MAX_VISIBLE = 5;

/* ----------------------------------
   COLOR VARIANTS
----------------------------------- */
const COLOR_VARIANTS = [
  { bg: '#EFF6FF', accent: '#2563EB' }, // blue
  { bg: '#ECFDF5', accent: '#16A34A' }, // green
  { bg: '#F5F3FF', accent: '#7C3AED' }, // purple
  { bg: '#FFF7ED', accent: '#EA580C' }, // orange
  { bg: '#F0FDFA', accent: '#0D9488' }, // teal
];

/* ----------------------------------
   COMPONENT
----------------------------------- */
const CustomLinksPreview = ({ customLinks }) => {
  const [expanded, setExpanded] = useState(false);

  const handleOpenLink = useCallback(async url => {
    if (!url) return;

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      await Linking.openURL(formattedUrl);
    } catch {
      showToast('Unable to open link');
    }
  }, []);

  const validLinks = (Array.isArray(customLinks) ? customLinks : []).filter(
    link => link?.name?.trim() && link?.url?.trim(),
  );

  if (validLinks.length === 0) return null;

  const visibleLinks = expanded ? validLinks : validLinks.slice(0, MAX_VISIBLE);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Links</Text>

      {visibleLinks.map((link, index) => {
        const color = COLOR_VARIANTS[index % COLOR_VARIANTS.length];

        return (
          <TouchableOpacity
            key={`${link.name}-${index}`}
            onPress={() => handleOpenLink(link.url)}
            activeOpacity={0.85}
            style={[
              styles.linkCard,
              { backgroundColor: color.bg, borderColor: color.accent },
            ]}
          >
            <View style={styles.centerContent}>
              <Image
                source={LINK_ICON}
                style={[styles.icon, { tintColor: color.accent }]}
              />

              <Text
                style={[styles.linkName, { color: color.accent }]}
                numberOfLines={1}
              >
                {link.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* SHOW MORE / LESS */}
      {validLinks.length > MAX_VISIBLE && (
        <TouchableOpacity
          style={styles.toggleBtn}
          onPress={() => setExpanded(prev => !prev)}
          activeOpacity={0.85}
        >
          <Text style={styles.toggleText}>
            {expanded
              ? 'Show less'
              : `Show ${validLinks.length - MAX_VISIBLE} more`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(CustomLinksPreview);

/* ----------------------------------
   STYLES
----------------------------------- */
const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },

  title: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 14,
  },

  linkCard: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,

    borderWidth: 1,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,

    justifyContent: 'center',
  },

  centerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  icon: {
    width: 18,
    height: 18,
  },

  linkName: {
    maxWidth: '75%',
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },

  /* SHOW MORE / LESS */
  toggleBtn: {
    alignSelf: 'center',
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#EEF2FF', // indigo-50
  },

  toggleText: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#4F46E5', // indigo-600
  },
});
