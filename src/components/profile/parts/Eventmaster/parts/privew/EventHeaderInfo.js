import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

/* ----------------------------------
   HELPERS
----------------------------------- */
const formatDateTime = (start, end) => {
  if (!start) return '';
  const s = new Date(start).toLocaleString();
  const e = end ? new Date(end).toLocaleTimeString() : '';
  return e ? `${s} – ${e}` : s;
};

/* ----------------------------------
   COMPONENT
----------------------------------- */
const EventHeaderInfo = ({ event }) => {
  const dateText = useMemo(
    () => formatDateTime(event.start_datetime, event.end_datetime),
    [event.start_datetime, event.end_datetime],
  );

  return (
    <View style={styles.container}>
      {/* TITLE */}
      <Text style={styles.title}>{event.name}</Text>

      {/* TAGLINE */}
      {!!event.tagline && <Text style={styles.tagline}>{event.tagline}</Text>}

      {/* META */}
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{dateText}</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.meta}>{event.mode}</Text>
      </View>

      {/* VENUE */}
      {event.mode === 'Offline' && !!event.venue_name && (
        <Text style={styles.venue}>{event.venue_name}</Text>
      )}

      {/* TAGS */}
      <View style={styles.tags}>
        {event.category?.map(tag => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}

        {event.type?.map(tag => (
          <View key={tag} style={styles.typeTag}>
            <Text style={styles.typeText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default memo(EventHeaderInfo);

/* ----------------------------------
   STYLES
----------------------------------- */
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
  },

  tagline: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  meta: {
    fontSize: 13,
    color: '#444',
  },

  dot: {
    marginHorizontal: 6,
    color: '#999',
  },

  venue: {
    marginTop: 4,
    fontSize: 13,
    color: '#555',
  },

  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },

  tag: {
    backgroundColor: '#111',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },

  tagText: {
    color: '#fff',
    fontSize: 12,
  },

  typeTag: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },

  typeText: {
    color: '#333',
    fontSize: 12,
  },
});
