import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const STATUS_OPTIONS = [
  { key: 'job', label: 'Job' },
  { key: 'studying', label: 'Studying' },
  { key: 'nothing', label: 'Skip' },
];

const InputField = ({ placeholder, value, onChange }) => (
  <View style={styles.inputWrapper}>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChange}
    />
  </View>
);

export default function JobStudyCont({
  status,
  fillOne,
  fillTwo,
  setStatus,
  setFillOne,
  setFillTwo,
}) {
  const onStatusChange = nextStatus => {
    setStatus(nextStatus);
    setFillOne('');
    setFillTwo('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.mainHeading}>Your Current Status</Text>
      <Text style={styles.subHeading}>Choose your current activity.</Text>

      {/* Status Selector */}
      <View style={styles.statusOptions}>
        {STATUS_OPTIONS.map(option => {
          const selected = status === option.key;

          return (
            <TouchableOpacity
              key={option.key}
              activeOpacity={0.8}
              onPress={() => onStatusChange(option.key)}
              style={[styles.statusBtn, selected && styles.statusBtnSelected]}
            >
              <Text
                style={[
                  styles.statusText,
                  selected && styles.statusTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Job */}
      {status === 'job' && (
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Professional Information</Text>
          <InputField
            placeholder="Designation (e.g. Software Engineer)"
            value={fillOne}
            onChange={setFillOne}
          />
          <InputField
            placeholder="Company (e.g. Google)"
            value={fillTwo}
            onChange={setFillTwo}
          />
        </View>
      )}

      {/* Studying */}
      {status === 'studying' && (
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Educational Background</Text>
          <InputField
            placeholder="Field of Study (e.g. BTech in CSE)"
            value={fillOne}
            onChange={setFillOne}
          />
          <InputField
            placeholder="Institution (e.g. MIT)"
            value={fillTwo}
            onChange={setFillTwo}
          />
        </View>
      )}

      {/* Skip */}
      {status === 'nothing' && (
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Skipped</Text>
          <Text style={styles.skipNote}>
            No worries! You can add these details later.
          </Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },

  mainHeading: {
    fontSize: 13,
    color: '#555',
    marginLeft: 4,
    fontFamily: 'Poppins-SemiBold',
  },

  subHeading: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    paddingLeft: 4,
    fontFamily: 'Poppins-Regular',
  },

  statusOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },

  statusBtn: {
    width: '30%',
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },

  statusBtnSelected: {
    backgroundColor: '#000',
    borderWidth: 1.4,
    borderColor: '#777',
  },

  statusText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },

  statusTextSelected: {
    color: '#fff',
  },

  section: {
    marginTop: 10,
  },

  sectionHeading: {
    fontSize: 14,
    color: '#444',
    paddingLeft: 4,
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },

  inputWrapper: {
    marginVertical: 5,
  },

  input: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 15,
    color: '#222',
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#ddd',
  },

  skipNote: {
    fontSize: 12,
    color: '#888',
    paddingLeft: 6,
    fontFamily: 'Poppins-Regular',
  },
});
