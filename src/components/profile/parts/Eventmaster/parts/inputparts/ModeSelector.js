import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MODES = [
  {
    key: 'Online',
    label: 'Online',
    description: 'Event will be hosted virtually',
  },
  {
    key: 'Offline',
    label: 'Offline',
    description: 'Event will be held at a physical location',
  },
];

const ModeSelector = ({ selectedMode, setSelectedMode }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Event Mode <Text style={styles.required}>*</Text>
      </Text>
      <Text style={styles.helper}>
        Choose how attendees will join your event
      </Text>

      <View style={styles.buttonRow}>
        {MODES.map(mode => {
          const selected = selectedMode === mode.key;

          return (
            <TouchableOpacity
              key={mode.key}
              activeOpacity={0.85}
              style={[styles.modeButton, selected && styles.modeButtonSelected]}
              onPress={() => setSelectedMode(mode.key)}
            >
              <Text
                style={[styles.modeText, selected && styles.modeTextSelected]}
              >
                {mode.label}
              </Text>
              <Text
                style={[
                  styles.modeDescription,
                  selected && styles.modeDescriptionSelected,
                ]}
              >
                {mode.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default ModeSelector;

/* =====================================================
   STYLES
===================================================== */
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: '#111',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  required: {
    color: '#EF4444',
  },
  helper: {
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  modeButtonSelected: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  modeText: {
    fontSize: 15,
    color: '#111',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  modeTextSelected: {
    color: '#fff',
  },
  modeDescription: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  modeDescriptionSelected: {
    color: '#d1d5db',
  },
});
