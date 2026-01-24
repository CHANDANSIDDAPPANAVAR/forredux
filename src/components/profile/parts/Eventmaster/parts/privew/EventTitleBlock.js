import React, { memo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TAGLINE_LIMIT = 80;

const EventTitleBlock = ({ title = '', tagline = '' }) => {
  const [taglineExpanded, setTaglineExpanded] = useState(false);

  const renderTagline = () => {
    if (!tagline) return null;

    const needsToggle = tagline.length > TAGLINE_LIMIT;
    const displayText = taglineExpanded
      ? tagline
      : tagline.slice(0, TAGLINE_LIMIT);

    return (
      <Text style={styles.tagline}>
        {displayText}
        {!taglineExpanded && needsToggle && '… '}
        {needsToggle && (
          <Text
            style={styles.toggle}
            onPress={() => setTaglineExpanded(p => !p)}
          >
            {taglineExpanded ? ' Show less' : ' Show more'}
          </Text>
        )}
      </Text>
    );
  };

  if (!title && !tagline) return null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.overlayCard}>
        {!!title && (
          <Text style={styles.title} numberOfLines={3}>
            {title}
          </Text>
        )}

        {renderTagline()}
      </View>
    </View>
  );
};

export default memo(EventTitleBlock);
const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },

  overlayCard: {
    marginTop: 12,
    width: '100%',
    maxWidth: 420,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',

    // iOS
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    // Android
    elevation: 6,
  },

  title: {
    fontSize: 20,
    lineHeight: 26,
    textAlign: 'center',
    color: '#111',
    fontFamily: 'Poppins-SemiBold',
  },

  tagline: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: '#555',
    fontFamily: 'Poppins-Regular',
  },

  toggle: {
    fontSize: 12,
    color: '#0a66c2',
    fontFamily: 'Poppins-Medium',
  },
});
