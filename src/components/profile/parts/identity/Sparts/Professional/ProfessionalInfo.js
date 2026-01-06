import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

/* ----------------------------------
   UTILS
----------------------------------- */
const capitalizeFirst = text => {
  if (typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const safeArray = value => (Array.isArray(value) ? value : []);

/* ----------------------------------
   COMPONENT
----------------------------------- */
const ProfessionalInfo = ({
  professionalAreas,
  experience,
  certifications,
  companyName,
}) => {
  const {
    formattedAreas,
    formattedCertifications,
    hasData,
    expValue,
    company,
  } = useMemo(() => {
    const areas = safeArray(professionalAreas)
      .filter(item => typeof item === 'string' && item.trim())
      .map(capitalizeFirst)
      .join(', ');

    const certs = safeArray(certifications)
      .filter(item => typeof item === 'string' && item.trim())
      .join(', ');

    const exp =
      typeof experience === 'string' || typeof experience === 'number'
        ? String(experience).trim()
        : '';

    const comp = typeof companyName === 'string' ? companyName.trim() : '';

    return {
      formattedAreas: areas,
      formattedCertifications: certs,
      expValue: exp,
      company: comp,
      hasData: !!areas || !!exp || !!certs || !!comp,
    };
  }, [professionalAreas, certifications, experience, companyName]);

  /* ❌ Render nothing if no valid data */
  if (!hasData) {
    return null;
  }

  return (
    <View style={styles.card}>
      {!!formattedAreas && (
        <InfoItem label="Professional Areas" value={formattedAreas} />
      )}

      {!!expValue && (
        <InfoItem
          label="Experience"
          value={`${expValue} ${expValue === '1' ? 'Year' : 'Years'}`}
        />
      )}

      {!!formattedCertifications && (
        <InfoItem
          label="Certifications & Degrees"
          value={formattedCertifications}
        />
      )}

      {!!company && (
        <InfoItem label="Company / Business / Institute" value={company} />
      )}
    </View>
  );
};

export default memo(ProfessionalInfo);

/* ----------------------------------
   SUB COMPONENT
----------------------------------- */
const InfoItem = memo(({ label, value }) => {
  return (
    <View style={styles.item}>
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
    marginVertical: 6,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 18,

    // Android
    elevation: 4,

    // iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  label: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#64748B',
    marginBottom: 6,
    letterSpacing: 0.3,
  },

  value: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#0F172A',
    lineHeight: 22,
  },
});
