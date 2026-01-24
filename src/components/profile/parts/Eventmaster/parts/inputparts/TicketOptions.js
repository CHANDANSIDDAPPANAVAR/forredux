import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/* =====================================================
   CONFIG
===================================================== */
const TICKET_TYPES = [
  {
    key: 'free',
    title: 'Free',
    description: 'Anyone can attend without payment',
  },
  {
    key: 'paid',
    title: 'Paid',
    description: 'Attendees must purchase a ticket',
  },
  {
    key: 'invite',
    title: 'Invite Only',
    description: 'Only invited guests can attend',
  },
];

/* =====================================================
   COMPONENT
===================================================== */
const TicketOptions = ({ ticketType, setTicketType }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Ticket Type <Text style={styles.required}>*</Text>
      </Text>
      <Text style={styles.helper}>
        Choose how attendees can access your event
      </Text>

      <View style={styles.optionsColumn}>
        {TICKET_TYPES.map(option => {
          const selected = ticketType === option.key;

          return (
            <TouchableOpacity
              key={option.key}
              activeOpacity={0.85}
              style={[styles.option, selected && styles.selectedOption]}
              onPress={() => setTicketType(option.key)}
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

export default TicketOptions;

/* =====================================================
   STYLES
===================================================== */
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    color: '#111',
    marginBottom: 4,
    marginLeft: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  required: {
    color: '#EF4444',
  },
  helper: {
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
    marginLeft: 4,
    fontFamily: 'Poppins-Regular',
  },
  optionsColumn: {
    gap: 10,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 14,
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
