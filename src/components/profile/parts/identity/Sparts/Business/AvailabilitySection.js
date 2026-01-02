import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/* ---------------------------
   Helpers
---------------------------- */
const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const parseTime = timeStr => {
  const [h = 0, m = 0] = String(timeStr).split(':').map(Number);
  return h * 60 + m;
};

const formatTime = minutes => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
};

/* ---------------------------
   Component
---------------------------- */
const AvailabilitySection = ({ availability }) => {
  /** ✅ HOOKS FIRST */
  const [expanded, setExpanded] = useState(false);

  const todayIndex = new Date().getDay();
  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();

  /** ---------- Normalize availability safely ---------- */
  const normalized = useMemo(() => {
    if (!Array.isArray(availability) || availability.length === 0) {
      return [];
    }

    return availability
      .filter(
        item =>
          item &&
          item.day &&
          item.from != null &&
          item.to != null &&
          DAYS.includes(item.day),
      )
      .map(item => {
        const from = parseTime(item.from);
        const to = parseTime(item.to);

        return {
          day: item.day,
          dayIndex: DAYS.indexOf(item.day),
          from,
          to,
          label: `${formatTime(from)} – ${formatTime(to)}`,
        };
      })
      .sort((a, b) => a.dayIndex - b.dayIndex);
  }, [availability]);

  /** ❌ NO DATA → RENDER NOTHING (NO DESIGN) */
  if (normalized.length === 0) {
    return null;
  }

  /** ---------- Today status ---------- */
  const todaySlots = normalized.filter(s => s.dayIndex === todayIndex);

  const isAvailableNow = todaySlots.some(
    s => nowMinutes >= s.from && nowMinutes <= s.to,
  );

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Availability</Text>

        <View
          style={[
            styles.statusBadge,
            isAvailableNow ? styles.available : styles.unavailable,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              isAvailableNow ? styles.availableText : styles.unavailableText,
            ]}
          >
            {isAvailableNow ? 'Available Now' : 'Not Available'}
          </Text>
        </View>
      </View>

      {/* Today slots */}
      {todaySlots.map((slot, index) => (
        <Text key={index} style={styles.todaySlot}>
          Today • {slot.label}
        </Text>
      ))}

      {/* Expand */}
      <TouchableOpacity
        onPress={() => setExpanded(p => !p)}
        activeOpacity={0.7}
        style={styles.expandBtn}
      >
        <Text style={styles.expandText}>
          {expanded ? 'Hide weekly schedule' : 'View weekly schedule'}
        </Text>
      </TouchableOpacity>

      {/* Full schedule */}
      {expanded && (
        <View style={styles.schedule}>
          {normalized.map((slot, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.day}>{slot.day}</Text>
              <Text style={styles.time}>{slot.label}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default React.memo(AvailabilitySection);

/* ---------------------------
   Styles
---------------------------- */
const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#ffffff',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },

  /* Status */
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
  },

  available: {
    backgroundColor: '#dcfce7',
  },

  unavailable: {
    backgroundColor: '#fee2e2',
  },

  availableText: {
    color: '#166534',
  },

  unavailableText: {
    color: '#991b1b',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  /* Today slot */
  todaySlot: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
  },

  /* Expand */
  expandBtn: {
    marginTop: 10,
  },

  expandText: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
  },

  /* Schedule */
  schedule: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },

  day: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },

  time: {
    fontSize: 13,
    color: '#475569',
  },
});
