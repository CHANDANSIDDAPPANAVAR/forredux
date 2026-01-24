import React, { memo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// Replace with your actual icon paths
const calendarIcon = require('../../../../../assets/events/calendar.png'); // better if it's a real calendar icon
const clockIcon = require('../../../../../assets/events/clock.png'); // better if it's a real clock icon

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────
const formatDate = isoString => {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = isoString => {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // 1:52 AM style — most users prefer this
  });
};

const getDuration = (start, end) => {
  if (!start || !end) return '';
  const ms = new Date(end) - new Date(start);
  if (ms <= 0) return '';

  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (hours === 0 && minutes === 0) return 'less than 1 min';
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
};

const isSameDay = (a, b) => {
  if (!a || !b) return false;
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
};

// ────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────
const EventDateTimeCard = ({ startDate, endDate, style }) => {
  if (!startDate) return null;

  const sameDay = endDate && isSameDay(startDate, endDate);
  const duration = endDate ? getDuration(startDate, endDate) : '';

  return (
    <View style={[styles.card, style]}>
      {/* Header row – main date or start date */}
      <View style={styles.row}>
        <Image source={calendarIcon} style={styles.icon} />
        <Text style={styles.mainDate}>{formatDate(startDate)}</Text>
      </View>

      {/* Same day → compact time + duration */}
      {sameDay && endDate && (
        <>
          <View style={styles.row}>
            <Image source={clockIcon} style={styles.icon} />
            <Text style={styles.timeRange}>
              {formatTime(startDate)} – {formatTime(endDate)}
            </Text>
          </View>
        </>
      )}

      {/* Multi-day → show both start + end clearly */}
      {!sameDay && endDate && (
        <View style={styles.multiDayContainer}>
          <View style={styles.multiRow}>
            <Text style={styles.label}>Start</Text>
            <Text style={styles.multiTime}>
              {formatTime(startDate)} • {formatDate(startDate)}
            </Text>
          </View>

          <View style={styles.multiRow}>
            <Text style={styles.label}>End</Text>
            <Text style={styles.multiTime}>
              {formatTime(endDate)} • {formatDate(endDate)}
            </Text>
          </View>
        </View>
      )}

      {/* Only start date provided */}
      {!endDate && (
        <View style={styles.row}>
          <Image source={clockIcon} style={styles.icon} />
          <Text style={styles.timeRange}>{formatTime(startDate)}</Text>
        </View>
      )}
    </View>
  );
};

export default memo(EventDateTimeCard);

// ────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    marginVertical: 12,

    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f0f0f0',

    // Shadow – subtle modern look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  icon: {
    width: 20,
    height: 20,
    marginRight: 12,
    tintColor: '#2563eb', // nice blue – or use your brand color
  },

  mainDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: -0.2,
  },

  timeRange: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },

  // Multi-day layout
  multiDayContainer: {
    marginTop: 4,
  },
  multiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    width: 50,
  },
  multiTime: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },

  // Duration badge
  durationBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  durationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },
});
