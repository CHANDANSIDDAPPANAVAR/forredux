import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Alert,
} from 'react-native';

/* ----------------------------------
   CONSTANTS
----------------------------------- */
const MAX_KEYWORDS = 10;

/* ----------------------------------
   COMPONENT
----------------------------------- */
const KeywordInput = ({ keywords, setKeywords }) => {
  const [input, setInput] = useState('');

  const addKeyword = useCallback(() => {
    const normalized = input.trim().toLowerCase();

    if (!normalized) return;

    if (keywords.length >= MAX_KEYWORDS) {
      Alert.alert(
        'Limit Reached',
        `You can add up to ${MAX_KEYWORDS} keywords only.`,
      );
      return;
    }

    if (!keywords.includes(normalized)) {
      setKeywords(prev => [...prev, normalized]);
    }

    setInput('');
    Keyboard.dismiss();
  }, [input, keywords, setKeywords]);

  const removeKeyword = useCallback(
    keyword => {
      setKeywords(prev => prev.filter(k => k !== keyword));
    },
    [setKeywords],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Keywords</Text>

      {/* TAGS */}
      <View style={styles.tagContainer}>
        {keywords.map(keyword => (
          <View key={keyword} style={styles.tag}>
            <Text style={styles.tagText}>{keyword}</Text>
            <TouchableOpacity
              onPress={() => removeKeyword(keyword)}
              style={styles.removeBtn}
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
        value={input}
        onChangeText={setInput}
        onSubmitEditing={addKeyword}
        placeholder="Type a keyword and press done"
        placeholderTextColor="#999"
        returnKeyType="done"
      />

      {/* COUNTER */}
      <Text style={styles.limitNote}>
        {keywords.length}/{MAX_KEYWORDS} keywords added
      </Text>
    </View>
  );
};

export default KeywordInput;

/* ----------------------------------
   STYLES
----------------------------------- */
const styles = StyleSheet.create({
  container: {
    marginBottom: 6,
  },

  label: {
    fontSize: 13,
    color: '#555',
    marginLeft: 5,
    marginBottom: 4,
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
  },

  removeBtn: {
    paddingLeft: 6,
  },

  removeText: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },

  limitNote: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
});
