import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/* ----------------------------------
   Utils
----------------------------------- */
const capitalizeFirst = text => {
  const str = String(text || '');
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/* ----------------------------------
   Component
----------------------------------- */
const BusinessBasicInfo = ({ businessName, tagline, category, city, bio }) => {
  return (
    <View style={styles.wrapper}>
      {/* BUSINESS NAME */}
      {businessName && (
        <Text style={styles.name}>{businessName.toUpperCase()}</Text>
      )}

      {/* TAGLINE */}
      {tagline && <Text style={styles.tagline}>{tagline}</Text>}

      {/* META INFO */}
      {(category || city) && (
        <View style={styles.metaRow}>
          {category && (
            <View style={styles.metaBadge}>
              <Text style={styles.metaText}>{capitalizeFirst(category)}</Text>
            </View>
          )}

          {city && (
            <View style={styles.metaBadgeLight}>
              <Text style={styles.metaTextLight}>{capitalizeFirst(city)}</Text>
            </View>
          )}
        </View>
      )}

      {/* BIO */}
      {bio && (
        <View style={styles.bioCard}>
          <Text style={styles.bioText}>{bio}</Text>
        </View>
      )}
    </View>
  );
};

export default React.memo(BusinessBasicInfo);

/* ----------------------------------
   Styles
----------------------------------- */
const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 8,
  },

  /* Name */
  name: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#1f2937',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 4,
  },

  /* Tagline */
  tagline: {
    fontSize: 14,
    fontFamily: 'Poppins-Italic',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 10,
  },

  /* Meta */
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },

  metaBadge: {
    backgroundColor: '#ecfeff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },

  metaBadgeLight: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },

  metaText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#0f766e',
  },

  metaTextLight: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#374151',
  },

  /* Bio */
  bioCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 14,
    marginBottom: 6,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  bioText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#374151',
    lineHeight: 21,
    textAlign: 'center',
  },
});
