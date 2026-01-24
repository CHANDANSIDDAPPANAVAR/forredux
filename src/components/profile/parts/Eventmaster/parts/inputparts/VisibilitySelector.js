import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const VISIBILITY_OPTIONS = [
  {
    key: 'public',
    title: 'Public',
    description: 'Visible to everyone',
  },
  {
    key: 'private',
    title: 'Private',
    description: 'Only invited people can view',
  },
];

const VisibilitySelector = ({ visibility, setVisibility }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Event Visibility <Text style={styles.required}>*</Text>
      </Text>
      <Text style={styles.helper}>Control who can see this event</Text>

      <View style={styles.optionsColumn}>
        {VISIBILITY_OPTIONS.map(option => {
          const selected = visibility === option.key;

          return (
            <TouchableOpacity
              key={option.key}
              activeOpacity={0.85}
              style={[styles.option, selected && styles.selectedOption]}
              onPress={() => setVisibility(option.key)}
            >
              <Text
                style={[styles.optionTitle, selected && styles.selectedTitle]}
              >
                {option.title}
              </Text>
              <Text
                style={[
                  styles.optionDescription,
                  selected && styles.selectedDescription,
                ]}
              >
                {option.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default VisibilitySelector;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#111',
    marginLeft: 4,
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  required: {
    color: '#EF4444',
  },
  helper: {
    fontSize: 12,
    color: '#777',
    marginLeft: 4,
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
  },
  optionsColumn: {
    gap: 10,
  },
  option: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedOption: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  optionTitle: {
    fontSize: 15,
    color: '#111',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  selectedTitle: {
    color: '#fff',
  },
  optionDescription: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  selectedDescription: {
    color: '#d1d5db',
  },
});
