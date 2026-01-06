import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

/* ----------------------------------
   UTILS
----------------------------------- */
const capitalizeFirst = text => {
  if (typeof text !== 'string' || !text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const safeString = value => (typeof value === 'string' ? value.trim() : '');

/* ----------------------------------
   COMPONENT
----------------------------------- */
const ServicesAndPricingInfo = ({ services, pricing }) => {
  const { formattedServices, formattedPricing, hasData } = useMemo(() => {
    const s = capitalizeFirst(safeString(services));
    const p = safeString(pricing);

    return {
      formattedServices: s,
      formattedPricing: p,
      hasData: !!s || !!p,
    };
  }, [services, pricing]);

  /* ❌ Render nothing if no valid data */
  if (!hasData) {
    return null;
  }

  return (
    <View style={styles.card}>
      {!!formattedServices && (
        <InfoBlock label="Services Offered" value={formattedServices} />
      )}

      {!!formattedPricing && (
        <InfoBlock label="Service Pricing" value={formattedPricing} />
      )}
    </View>
  );
};

export default memo(ServicesAndPricingInfo);

/* ----------------------------------
   SUB COMPONENT
----------------------------------- */
const InfoBlock = memo(({ label, value }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
});

/* ----------------------------------
   STYLES
----------------------------------- */
const styles = StyleSheet.create({
  card: {
    marginVertical: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,

    // Android shadow
    elevation: 3,

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },

    borderWidth: 1,
    borderColor: '#F1F5F9',
  },

  section: {
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 6,
    letterSpacing: 0.3,
  },

  value: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#374151',
    lineHeight: 21,
  },
});
