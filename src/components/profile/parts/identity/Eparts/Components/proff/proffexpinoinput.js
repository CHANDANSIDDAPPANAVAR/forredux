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

/* =====================================================
   SUGGESTION LISTS
===================================================== */

/* ---------- PROFESSIONAL ---------- */
const PROFESSIONAL_SUGGESTIONS = [
  // Medical
  'General Practitioner',
  'Dentist',
  'Dermatologist',
  'Cardiologist',
  'Gynecologist',
  'Pediatrician',
  'Psychiatrist',
  'Physiotherapist',
  'Nutritionist',
  'Surgeon',

  // Legal
  'Corporate Lawyer',
  'Criminal Lawyer',
  'Family Lawyer',
  'Tax Lawyer',
  'Immigration Lawyer',

  // IT
  'Software Developer',
  'Web Developer',
  'Mobile App Developer',
  'Data Scientist',
  'IT Consultant',

  // Business & Creative
  'Business Consultant',
  'Financial Advisor',
  'Graphic Designer',
  'UI/UX Designer',
  'Photographer',
  'Content Writer',
];

/* ---------- BUSINESS ---------- */
const BUSINESS_SUGGESTIONS = [
  'Restaurant',
  'Cafe',
  'Bakery',
  'Salon',
  'Spa',
  'Boutique',
  'Fitness Center',
  'Coaching Institute',
  'Travel Agency',
  'Real Estate',
  'Event Management',
  'IT Company',
  'Marketing Agency',
];

/* ---------- SERVICE ---------- */
const SERVICE_SUGGESTIONS = [
  'Plumbing',
  'Electrical Repair',
  'AC Repair',
  'Refrigerator Repair',
  'Washing Machine Repair',
  'House Cleaning',
  'Pest Control',
  'Painting',
  'Carpentry',
  'Home Renovation',
  'Interior Work',
];

/* =====================================================
   CONFIG BY TYPE
===================================================== */
const CONFIG = {
  professional: {
    label: 'Professional Area',
    placeholder: 'e.g. Lawyer, Doctor, Developer...',
    suggestions: PROFESSIONAL_SUGGESTIONS,
  },
  business: {
    label: 'Business Category',
    placeholder: 'e.g. Restaurant, Salon, Travel Agency...',
    suggestions: BUSINESS_SUGGESTIONS,
  },
  service: {
    label: 'Services Offered',
    placeholder: 'e.g. Plumbing, AC Repair, Painting...',
    suggestions: SERVICE_SUGGESTIONS,
  },
};

/* =====================================================
   COMPONENT (NAME + PROPS UNCHANGED)
===================================================== */
const ProffExperienceInfo = ({
  selectedSkills,
  setSelectedSkills,
  type = 'professional', // optional, default professional
}) => {
  const [search, setSearch] = useState('');

  const { label, placeholder, suggestions } =
    CONFIG[type] || CONFIG.professional;

  const filteredSuggestions = useMemo(() => {
    if (!search.trim()) return [];

    const term = search.toLowerCase();
    return suggestions.filter(
      item =>
        item.toLowerCase().includes(term) &&
        !selectedSkills.includes(item.toLowerCase()),
    );
  }, [search, selectedSkills, suggestions]);

  const addSkill = useCallback(
    value => {
      const normalized = value.toLowerCase().trim();
      if (!normalized || selectedSkills.includes(normalized)) return;

      setSelectedSkills(prev => [...prev, normalized]);
      setSearch('');
      Keyboard.dismiss();
    },
    [selectedSkills, setSelectedSkills],
  );

  const removeSkill = useCallback(
    value => {
      setSelectedSkills(prev => prev.filter(v => v !== value));
    },
    [setSelectedSkills],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {/* TAGS */}
      <View style={styles.tagContainer}>
        {selectedSkills.map(item => (
          <View key={item} style={styles.tag}>
            <Text style={styles.tagText}>{item}</Text>
            <TouchableOpacity onPress={() => removeSkill(item)}>
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
        placeholder={placeholder}
        placeholderTextColor="#999"
        returnKeyType="done"
        onSubmitEditing={() => addSkill(search)}
      />

      {/* SUGGESTIONS */}
      {search.length > 0 && filteredSuggestions.length > 0 && (
        <ScrollView
          style={styles.dropdown}
          keyboardShouldPersistTaps="always"
          nestedScrollEnabled={true} // ✅ Android nested scroll fix
        >
          {filteredSuggestions.slice(0, 10).map(item => (
            <TouchableOpacity
              key={item}
              style={styles.dropdownItem}
              onPress={() => addSkill(item)}
              activeOpacity={0.7}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ProffExperienceInfo;

/* =====================================================
   STYLES
===================================================== */
const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    marginLeft: 5,
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
    maxHeight: 160,
    backgroundColor: '#F9F9F9',
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
    zIndex: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
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
    textTransform: 'capitalize',
    marginRight: 6,
  },
  removeText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
});
