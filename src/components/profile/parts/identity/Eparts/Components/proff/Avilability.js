import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';

/* ----------------------------------
   CONSTANTS
----------------------------------- */
const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/* ----------------------------------
   HELPERS
----------------------------------- */
const formatTime24 = (text, isEndTime = false) => {
  let value = text.replace(/[^0-9]/g, '');

  if (value.length > 4) value = value.slice(0, 4);

  if (value.length >= 3) {
    value = `${value.slice(0, 2)}:${value.slice(2)}`;
  }

  const [h, m] = value.split(':');
  const hour = h ? parseInt(h, 10) : null;
  const min = m ? parseInt(m, 10) : null;

  if (hour !== null) {
    if (hour > 24) return '';
    if (hour === 24 && !isEndTime) return '';
  }

  if (min !== null) {
    if (min > 59) return '';
    if (hour === 24 && min !== 0) return '';
  }

  return value;
};

/* ----------------------------------
   COMPONENT
----------------------------------- */
const AvailabilitySelector = ({ availability, setAvailability }) => {
  const isSelected = useCallback(
    day =>
      availability.some(slot => slot.day.toLowerCase() === day.toLowerCase()),
    [availability],
  );

  const toggleDay = useCallback(
    day => {
      if (isSelected(day)) {
        setAvailability(prev =>
          prev.filter(slot => slot.day.toLowerCase() !== day.toLowerCase()),
        );
      } else {
        setAvailability(prev => [...prev, { day, from: '', to: '' }]);
      }
    },
    [isSelected, setAvailability],
  );

  const updateTime = useCallback(
    (day, field, value) => {
      setAvailability(prev =>
        prev.map(slot =>
          slot.day.toLowerCase() === day.toLowerCase()
            ? { ...slot, [field]: value }
            : slot,
        ),
      );
    },
    [setAvailability],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Availability</Text>
      <Text style={styles.subtitle}>
        Select days and set your working hours
      </Text>
      <Text style={styles.helperText}>
        24-hour format (e.g. 09:00 – 18:30, 24:00 allowed as end time)
      </Text>

      {/* DAY CHIPS */}
      <View style={styles.dayRow}>
        {DAYS.map(day => {
          const active = isSelected(day);

          return (
            <TouchableOpacity
              key={day}
              onPress={() => toggleDay(day)}
              activeOpacity={0.8}
              style={[styles.dayChip, active && styles.dayChipActive]}
            >
              <Text style={[styles.dayText, active && styles.dayTextActive]}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* TIME CARDS — ORDERED */}
      {DAYS.map(day => {
        const slot = availability.find(
          s => s.day.toLowerCase() === day.toLowerCase(),
        );

        if (!slot) return null;

        return (
          <View key={day} style={styles.timeCard}>
            <Text style={styles.timeDay}>{day}</Text>

            <View style={styles.timeRow}>
              <TextInput
                style={styles.timeInput}
                placeholder="From (HH:MM)"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                maxLength={5}
                value={slot.from}
                onChangeText={text =>
                  updateTime(day, 'from', formatTime24(text, false))
                }
              />

              <Text style={styles.toText}>→</Text>

              <TextInput
                style={styles.timeInput}
                placeholder="To (HH:MM)"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                maxLength={5}
                value={slot.to}
                onChangeText={
                  text => updateTime(day, 'to', formatTime24(text, true)) // ✅ FIX
                }
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default memo(AvailabilitySelector);

/* ----------------------------------
   STYLES
----------------------------------- */
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  title: {
    fontSize: 14,
    color: '#111',
    marginLeft: 5,
    fontFamily: 'Poppins-SemiBold',
  },

  subtitle: {
    fontSize: 12,
    color: '#777',
    marginLeft: 5,
    fontFamily: 'Poppins-Regular',
  },

  helperText: {
    fontSize: 11,
    color: '#888',
    marginLeft: 5,
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
  },

  dayRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },

  dayChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
  },

  dayChipActive: {
    backgroundColor: '#111',
  },

  dayText: {
    fontSize: 13,
    color: '#444',
    fontFamily: 'Poppins-Medium',
  },

  dayTextActive: {
    color: '#fff',
  },

  timeCard: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },

  timeDay: {
    fontSize: 13,
    marginBottom: 8,
    color: '#222',
    fontFamily: 'Poppins-SemiBold',
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  timeInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 14,
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },

  toText: {
    marginHorizontal: 8,
    color: '#666',
    fontSize: 16,
  },
});
