import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const MAX_CUSTOM_LINKS = 5;

const CustomLinksInput = ({ customLinks = [], setCustomLinks }) => {
  const addLink = () => {
    if (customLinks.length >= MAX_CUSTOM_LINKS) return;

    setCustomLinks(prev => [...prev, { name: '', url: '' }]);
  };

  const updateLink = (index, field, value) => {
    setCustomLinks(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const removeLink = index => {
    setCustomLinks(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Custom Links</Text>
      <Text style={styles.sectionHint}>
        Add useful links like portfolio, booking page, brochure, etc.
      </Text>

      {customLinks.map((link, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Link {index + 1}</Text>

            <TouchableOpacity onPress={() => removeLink(index)}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Link name (e.g. Portfolio)"
            value={link.name}
            onChangeText={text => updateLink(index, 'name', text.slice(0, 30))}
            maxLength={30}
          />

          <TextInput
            style={styles.input}
            placeholder="https://example.com"
            value={link.url}
            onChangeText={text => updateLink(index, 'url', text)}
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>
      ))}

      {customLinks.length < MAX_CUSTOM_LINKS && (
        <TouchableOpacity style={styles.addButton} onPress={addLink}>
          <Text style={styles.addButtonText}>+ Add another link</Text>
        </TouchableOpacity>
      )}

      {customLinks.length >= MAX_CUSTOM_LINKS && (
        <Text style={styles.limitText}>
          You can add up to {MAX_CUSTOM_LINKS} links
        </Text>
      )}
    </View>
  );
};

export default CustomLinksInput;
const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
  },

  sectionTitle: {
    fontSize: 15,
    color: '#222',
    marginLeft: 6,
    fontFamily: 'Poppins-SemiBold',
  },

  sectionHint: {
    fontSize: 12,
    color: '#777',
    marginLeft: 6,
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  cardTitle: {
    fontSize: 13,
    color: '#444',
    fontFamily: 'Poppins-SemiBold',
  },

  remove: {
    fontSize: 13,
    color: '#ef4444',
    fontFamily: 'Poppins-SemiBold',
  },

  input: {
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    fontSize: 14,
    color: '#222',
    fontFamily: 'Poppins-Regular',
  },

  addButton: {
    marginHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#000',
    alignItems: 'center',
  },

  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },

  limitText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginTop: 6,
    fontFamily: 'Poppins-Regular',
  },
});
