import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Keyboard,
  Alert,
} from 'react-native';

const ALL_LANGUAGES = [
  'English',
  'Hindi',
  'Kannada',
  'Telugu',
  'Tamil',
  'Marathi',
  'Gujarati',
  'Bengali',
  'Punjabi',
  'Malayalam',
  'Urdu',
  'Odia',
  'Assamese',
];

const MAX_LANGUAGES = 10;

export default function LanguagesSpokenSelector({
  selectedLanguages,
  setSelectedLanguages,
}) {
  const [search, setSearch] = useState('');

  const filteredLanguages = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return [];

    return ALL_LANGUAGES.filter(
      lang =>
        lang.toLowerCase().includes(term) && !selectedLanguages.includes(lang),
    );
  }, [search, selectedLanguages]);

  const addLanguage = lang => {
    if (selectedLanguages.length >= MAX_LANGUAGES) {
      Alert.alert(
        'Limit reached',
        `You can add up to ${MAX_LANGUAGES} languages.`,
      );
      return;
    }

    if (!selectedLanguages.includes(lang)) {
      setSelectedLanguages([...selectedLanguages, lang]);
    }

    setSearch('');
    Keyboard.dismiss();
  };

  const removeLanguage = lang => {
    setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.label}>Languages Spoken</Text>
      <Text style={styles.helperText}>
        Add the languages you can communicate in
      </Text>

      {/* Selected tags */}
      {selectedLanguages.length > 0 && (
        <View style={styles.tagContainer}>
          {selectedLanguages.map(lang => (
            <View key={lang} style={styles.tag}>
              <Text style={styles.tagText}>{lang}</Text>
              <TouchableOpacity
                onPress={() => removeLanguage(lang)}
                hitSlop={8}
              >
                <Text style={styles.removeText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Input */}
      <TextInput
        style={styles.input}
        value={search}
        onChangeText={setSearch}
        placeholder="Type a language (e.g. English)"
        placeholderTextColor="#9a9a9a"
        returnKeyType="done"
        onSubmitEditing={() => {
          if (search.trim()) {
            addLanguage(search.trim());
          }
        }}
      />

      {/* Suggestions */}
      {search.length > 0 && filteredLanguages.length > 0 && (
        <ScrollView keyboardShouldPersistTaps="handled" style={styles.dropdown}>
          {filteredLanguages.slice(0, 8).map(lang => (
            <TouchableOpacity
              key={lang}
              onPress={() => addLanguage(lang)}
              style={styles.dropdownItem}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownText}>{lang}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Footer */}
      <Text style={styles.limitNote}>
        {selectedLanguages.length}/{MAX_LANGUAGES} languages added
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    color: '#444',
    fontFamily: 'Poppins-SemiBold',
  },

  helperText: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },

  input: {
    backgroundColor: '#f6f6f6',
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 15,
    color: '#222',
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#ddd',
  },

  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },

  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },

  tagText: {
    fontSize: 13,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },

  removeText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },

  dropdown: {
    maxHeight: 180,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    marginTop: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  dropdownText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },

  limitNote: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    fontFamily: 'Poppins-Regular',
  },
});
