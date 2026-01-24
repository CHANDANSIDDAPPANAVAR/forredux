import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TicketTypeBadge = ({ ticketType }) => {
  if (!ticketType || ticketType === 'free') return null;

  const map = {
    paid: {
      label: 'Paid Event',
      text: '#9a3412',
      bg: '#fff7ed',
      border: '#fed7aa',
    },
    donation: {
      label: 'Donation Based',
      text: '#991b1b',
      bg: '#fef2f2',
      border: '#fecaca',
    },
    invite: {
      label: 'Invite Only',
      text: '#1e3a8a',
      bg: '#eff6ff',
      border: '#bfdbfe',
    },
  };

  const config = map[ticketType];
  if (!config) return null;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
        },
      ]}
    >
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

export default memo(TicketTypeBadge);

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    marginTop: 10,
  },
  text: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    letterSpacing: 0.2,
  },
});
