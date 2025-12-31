import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDispatch, useSelector } from 'react-redux';
import { authSuccess } from '../../../../store/auth/authSlice';
import { saveTokens } from '../../../../store/auth/authStorage';
import api from '../../../../services/api';
import {
  setCreatorCreatedThunk,
  saveCreatorCreatedThunk,
} from '../../../../store/auth/authThunks';

export default function CreateCreatorScreen() {
  const debounceRef = useRef(null);
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth);

  const [fullName, setFullName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');

  const [checking, setChecking] = useState(false);
  const [handleStatus, setHandleStatus] = useState(null); // 'available' | 'taken' | null
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  /* ============================
     HANDLE SUGGESTIONS
  ============================ */
  useEffect(() => {
    if (!fullName.trim()) {
      setSuggestions([]);
      return;
    }

    const base = fullName
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .trim()
      .split(' ')
      .join('');

    setSuggestions([
      base,
      `${base}_official`,
      `${base}${Math.floor(Math.random() * 100)}`,
    ]);
  }, [fullName]);

  useEffect(() => {
    dispatch(setCreatorCreatedThunk());
  }, [dispatch]);

  /* ============================
     CHECK HANDLE (DEBOUNCED)
  ============================ */
  const checkHandleAvailability = value => {
    setHandle(value);
    setHandleStatus(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 3) return;

    debounceRef.current = setTimeout(async () => {
      setChecking(true);
      try {
        const res = await api.get('/api/creators/check-username', {
          params: { q: value.trim() },
        });

        setHandleStatus(res.data.taken ? 'taken' : 'available');
      } catch {
        setHandleStatus(null);
      } finally {
        setChecking(false);
      }
    }, 500);
  };

  /* ============================
     CREATE CREATOR
  ============================ */
  const handleCreate = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Full name is required');
      return;
    }

    if (!handle.trim()) {
      Alert.alert('Error', 'Handle is required');
      return;
    }

    if (handleStatus !== 'available') {
      Alert.alert('Error', 'Please choose an available handle');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/api/creators', {
        display_name: fullName.trim(),
        handle: handle.trim(),
        bio: bio.trim() || null,
      });

      // ✅ BOTH cases → mark creatorCreated true
      if (res.data?.alreadyExists || res.status === 201) {
        await dispatch(saveCreatorCreatedThunk());
      }
    } catch (err) {
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Failed to create creator profile',
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================
     UIaa
  ============================ */
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Creator Profile</Text>

      {/* FULL NAME */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

      {/* HANDLE */}
      <TextInput
        style={styles.input}
        placeholder="Unique Handle"
        autoCapitalize="none"
        value={handle}
        onChangeText={checkHandleAvailability}
      />

      {/* HANDLE STATUS */}
      {checking && <Text style={styles.info}>Checking availability…</Text>}
      {handleStatus === 'available' && (
        <Text style={styles.available}>✔ Handle available</Text>
      )}
      {handleStatus === 'taken' && (
        <Text style={styles.error}>✖ Handle already taken</Text>
      )}

      {/* SUGGESTIONS */}
      {suggestions.length > 0 && !handle && (
        <View style={styles.suggestionBox}>
          <Text style={styles.suggestionTitle}>Suggestions</Text>
          <FlatList
            data={suggestions}
            keyExtractor={item => item}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestion}
                onPress={() => checkHandleAvailability(item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* BIO */}
      <TextInput
        style={[styles.input, styles.bio]}
        placeholder="Bio (optional)"
        value={bio}
        onChangeText={setBio}
        maxLength={150}
        multiline
      />

      {/* SUBMIT */}
      <TouchableOpacity
        style={[
          styles.primaryBtn,
          handleStatus !== 'available' && styles.disabledBtn,
        ]}
        onPress={handleCreate}
        disabled={loading || handleStatus !== 'available'}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryText}>Continue</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ============================
   STYLES
============================ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#101828',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 10,
  },
  bio: {
    height: 90,
    textAlignVertical: 'top',
  },
  info: {
    fontSize: 13,
    color: '#667085',
    marginBottom: 6,
  },
  available: {
    fontSize: 13,
    color: '#12B76A',
    marginBottom: 6,
  },
  error: {
    fontSize: 13,
    color: '#D92D20',
    marginBottom: 6,
  },
  suggestionBox: {
    marginBottom: 12,
  },
  suggestionTitle: {
    fontSize: 13,
    color: '#667085',
    marginBottom: 6,
  },
  suggestion: {
    backgroundColor: '#F2F4F7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#101828',
  },
  primaryBtn: {
    backgroundColor: '#2F80ED',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 14,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});
