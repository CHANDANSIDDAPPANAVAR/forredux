import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

/* ----------------------------------
   UTILS
----------------------------------- */
const capitalizeFirst = text => {
  if (typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/* ----------------------------------
   COMPONENT
----------------------------------- */
const ProfessionalInfo = ({
  professionalAreas = [],
  experience = '',
  certifications = [],
  companyName = '',
}) => {
  const { formattedAreas, formattedCertifications, hasData } = useMemo(() => {
    const areas = professionalAreas
      .filter(a => typeof a === 'string' && a.trim())
      .map(capitalizeFirst)
      .join(', ');

    const certs = certifications
      .filter(c => typeof c === 'string' && c.trim())
      .join(', ');

    return {
      formattedAreas: areas,
      formattedCertifications: certs,
      hasData: !!areas || !!experience || !!certs || !!companyName,
    };
  }, [professionalAreas, certifications, experience, companyName]);

  if (!hasData) return null;

  return (
    <View style={styles.card}>
      {!!formattedAreas && (
        <InfoItem label="Professional Areas" value={formattedAreas} />
      )}

      {!!experience && (
        <InfoItem
          label="Experience"
          value={`${experience} ${experience === '1' ? 'Year' : 'Years'}`}
        />
      )}

      {!!formattedCertifications && (
        <InfoItem
          label="Certifications & Degrees"
          value={formattedCertifications}
        />
      )}

      {!!companyName && (
        <InfoItem label="Company / Business / Institute" value={companyName} />
      )}
    </View>
  );
};

export default memo(ProfessionalInfo);

/* ----------------------------------
   SUB COMPONENT
----------------------------------- */
const InfoItem = ({ label, value }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

/* ----------------------------------
   STYLES (IMPROVED UI)
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
