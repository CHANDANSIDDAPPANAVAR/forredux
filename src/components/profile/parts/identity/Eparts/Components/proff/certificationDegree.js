import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Keyboard,
} from 'react-native';

/* ----------------------------------
   CONSTANTS
----------------------------------- */
const certSuggestions = [
  'MBBS',
  'MD',
  'MS',
  'BDS',
  'MDS',
  'DNB',
  'DM',
  'MCh',

  // Law
  'LLB',
  'LLM',
  'JD',
  'Bar Council Certification',
  'IPR Certification',

  // Finance
  'CA',
  'CFA',
  'CPA',
  'CMA',

  // Management & Tech
  'MBA',
  'PMP',
  'Six Sigma Black Belt',

  // Academic
  'PhD',
  'MSc',
  'BSc',
  'BA',
  'BCom',
  'MCom',
  'PG Diploma',
];

/* ----------------------------------
   COMPONENT
----------------------------------- */
const CertificationDegreesInfo = ({ selectedCerts, setSelectedCerts }) => {
  const [search, setSearch] = useState('');

  const filteredSuggestions = useMemo(() => {
    if (!search.trim()) return [];

    const term = search.toLowerCase();
    return certSuggestions.filter(
      cert =>
        cert.toLowerCase().includes(term) &&
        !selectedCerts.includes(cert.toLowerCase()),
    );
  }, [search, selectedCerts]);

  const addCert = useCallback(
    cert => {
      const normalized = cert.trim().toLowerCase();

      if (!selectedCerts.includes(normalized)) {
        setSelectedCerts(prev => [...prev, normalized]);
      }

      setSearch('');
      Keyboard.dismiss();
    },
    [selectedCerts, setSelectedCerts],
  );

  const removeCert = useCallback(
    cert => {
      setSelectedCerts(prev => prev.filter(c => c !== cert));
    },
    [setSelectedCerts],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Certifications & Degrees</Text>

      {/* SELECTED TAGS */}
      <View style={styles.tagContainer}>
        {selectedCerts.map(cert => (
          <View key={cert} style={styles.tag}>
            <Text style={styles.tagText}>{cert}</Text>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeCert(cert)}
              hitSlop={10}
            >
              <Text style={styles.removeText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* INPUT */}
      <TextInput
        style={styles.input}
        value={search}
        onChangeText={setSearch}
        placeholder="e.g. MBA, MBBS, AWS Certified, PMP..."
        placeholderTextColor="#999"
        returnKeyType="done"
        onSubmitEditing={() => {
          if (search.trim()) {
            addCert(search);
          }
        }}
      />

      {/* SUGGESTIONS */}
      {filteredSuggestions.length > 0 && (
        <ScrollView style={styles.dropdown} keyboardShouldPersistTaps="handled">
          {filteredSuggestions.slice(0, 10).map(item => (
            <TouchableOpacity
              key={item}
              style={styles.dropdownItem}
              onPress={() => addCert(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default CertificationDegreesInfo;

/* ----------------------------------
   STYLES
----------------------------------- */
const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
    color: '#555',
    marginLeft: 5,
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },

  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },

  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 6,
  },

  tagText: {
    fontSize: 13,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    textTransform: 'uppercase',
  },

  removeBtn: {
    paddingLeft: 6,
  },

  removeText: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
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

  dropdown: {
    maxHeight: 180,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },

  dropdownText: {
    fontSize: 13,
    color: '#222',
    fontFamily: 'Poppins-Regular',
  },
});
