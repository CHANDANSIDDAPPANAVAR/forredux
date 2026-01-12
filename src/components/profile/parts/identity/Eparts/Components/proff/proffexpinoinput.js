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
const skillSuggestions = [
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
  'Intellectual Property Lawyer',
  'Immigration Lawyer',
  'Civil Rights Lawyer',

  // IT & Technical
  'Software Developer',
  'Web Developer',
  'Mobile App Developer',
  'Data Scientist',
  'Cybersecurity Specialist',
  'IT Consultant',

  // Business
  'Business Consultant',
  'Financial Advisor',
  'Marketing Consultant',
  'Sales Consultant',
  'Startup Mentor',
  'HR Consultant',

  // Creative
  'Graphic Designer',
  'UI/UX Designer',
  'Photographer',
  'Videographer',
  'Content Writer',
  'Social Media Manager',
  'Animator',

  // Trades
  'Plumber',
  'Electrician',
  'Carpenter',
  'Painter',
  'Mechanic',
  'Interior Designer',

  // Wellness
  'Hair Stylist',
  'Makeup Artist',
  'Skincare Specialist',
  'Massage Therapist',
  'Nail Technician',
  'Personal Trainer',
  'Yoga Instructor',
  'Dietitian',

  // Hospitality
  'Chef',
  'Event Planner',
  'Hotel Manager',
  'Tour Guide',
];

/* ----------------------------------
   COMPONENT
----------------------------------- */
const ProffExperienceInfo = ({ selectedSkills, setSelectedSkills }) => {
  const [search, setSearch] = useState('');

  const filteredSuggestions = useMemo(() => {
    if (!search.trim()) return [];

    const term = search.toLowerCase();
    return skillSuggestions.filter(
      skill =>
        skill.toLowerCase().includes(term) &&
        !selectedSkills.includes(skill.toLowerCase()),
    );
  }, [search, selectedSkills]);

  const addSkill = useCallback(
    skill => {
      const normalized = skill.toLowerCase();

      if (!selectedSkills.includes(normalized)) {
        setSelectedSkills(prev => [...prev, normalized]);
      }

      setSearch('');
      Keyboard.dismiss();
    },
    [selectedSkills, setSelectedSkills],
  );

  const removeSkill = useCallback(
    skill => {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    },
    [setSelectedSkills],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Professional Area</Text>

      {/* SELECTED TAGS */}
      <View style={styles.tagContainer}>
        {selectedSkills.map(skill => (
          <View key={skill} style={styles.tag}>
            <Text style={styles.tagText}>{skill}</Text>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeSkill(skill)}
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
        onSubmitEditing={() => {
          if (search.trim()) {
            addSkill(search.trim());
          }
        }}
        placeholder="e.g. Lawyer, Doctor, CA..."
        placeholderTextColor="#999"
        returnKeyType="done"
      />

      {/* SUGGESTIONS */}
      {search.length > 0 && filteredSuggestions.length > 0 && (
        <ScrollView style={styles.dropdown} keyboardShouldPersistTaps="handled">
          {filteredSuggestions.slice(0, 10).map(item => (
            <TouchableOpacity
              key={item}
              onPress={() => addSkill(item)}
              style={styles.dropdownItem}
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

/* ----------------------------------
   STYLES
----------------------------------- */
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
  },

  removeBtn: {
    paddingLeft: 6,
  },

  removeText: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
});
