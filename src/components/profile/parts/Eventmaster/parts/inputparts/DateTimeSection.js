import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

/* =====================================================
   HELPERS
===================================================== */
const formatDate = date => (date ? date.toLocaleDateString() : 'Select date');

const formatTime = date =>
  date
    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Select time';

/* =====================================================
   COMPONENT
===================================================== */
const DateTimeSection = ({
  startDateTime,
  endDateTime,
  setStartDateTime,
  setEndDateTime,
}) => {
  const [picker, setPicker] = useState(null);
  // picker = 'startDate' | 'startTime' | 'endDate' | 'endTime'

  const closePicker = () => setPicker(null);

  const handleStartDate = (_, date) => {
    closePicker();
    if (!date) return;

    const base = startDateTime || new Date();
    const newStart = new Date(base);
    newStart.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    setStartDateTime(newStart);

    if (!endDateTime || endDateTime <= newStart) {
      setEndDateTime(new Date(newStart.getTime() + 60 * 60 * 1000));
    }
  };

  const handleStartTime = (_, time) => {
    closePicker();
    if (!time) return;

    const base = startDateTime || new Date();
    const newStart = new Date(base);
    newStart.setHours(time.getHours(), time.getMinutes());
    setStartDateTime(newStart);

    setEndDateTime(new Date(newStart.getTime() + 60 * 60 * 1000));
  };

  const handleEndDate = (_, date) => {
    closePicker();
    if (!date || !startDateTime) return;

    const newEnd = new Date(endDateTime || startDateTime);
    newEnd.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());

    if (newEnd >= startDateTime) {
      setEndDateTime(newEnd);
    }
  };

  const handleEndTime = (_, time) => {
    closePicker();
    if (!time || !startDateTime) return;

    const newEnd = new Date(endDateTime || startDateTime);
    newEnd.setHours(time.getHours(), time.getMinutes());

    if (newEnd >= startDateTime) {
      setEndDateTime(newEnd);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Event Date & Time <Text style={styles.required}>*</Text>
      </Text>
      <Text style={styles.helper}>Choose when your event starts and ends</Text>

      {/* START */}
      <Text style={styles.subLabel}>Start</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.box}
          onPress={() => setPicker('startDate')}
        >
          <Text style={styles.boxText}>{formatDate(startDateTime)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.box}
          onPress={() => setPicker('startTime')}
        >
          <Text style={styles.boxText}>{formatTime(startDateTime)}</Text>
        </TouchableOpacity>
      </View>

      {/* END */}
      <Text style={[styles.subLabel, { marginTop: 16 }]}>End</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.box}
          onPress={() => setPicker('endDate')}
        >
          <Text style={styles.boxText}>{formatDate(endDateTime)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.box}
          onPress={() => setPicker('endTime')}
        >
          <Text style={styles.boxText}>{formatTime(endDateTime)}</Text>
        </TouchableOpacity>
      </View>

      {/* PICKER */}
      {picker && (
        <DateTimePicker
          value={
            picker.startsWith('end')
              ? endDateTime || startDateTime || new Date()
              : startDateTime || new Date()
          }
          mode={picker.includes('Date') ? 'date' : 'time'}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={
            picker.startsWith('end') && startDateTime
              ? startDateTime
              : undefined
          }
          onChange={
            picker === 'startDate'
              ? handleStartDate
              : picker === 'startTime'
              ? handleStartTime
              : picker === 'endDate'
              ? handleEndDate
              : handleEndTime
          }
        />
      )}
    </View>
  );
};

export default DateTimeSection;

/* =====================================================
   STYLES
===================================================== */
const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  label: {
    fontSize: 13,
    color: '#111',
    fontFamily: 'Poppins-SemiBold',
  },
  required: {
    color: '#EF4444',
  },
  helper: {
    fontSize: 12,
    color: '#777',
    marginBottom: 12,
    fontFamily: 'Poppins-Regular',
  },
  subLabel: {
    fontSize: 12,
    color: '#555',
    marginBottom: 6,
    fontFamily: 'Poppins-SemiBold',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  box: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  boxText: {
    fontSize: 14,
    color: '#222',
    fontFamily: 'Poppins-Regular',
  },
});
