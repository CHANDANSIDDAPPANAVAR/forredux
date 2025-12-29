import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import api from '../../../services/api';
import {
  currentLogoutThunk,
  logoutAllThunk,
} from '../../../store/auth/authThunks';

export default function Logout() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { accessToken, sessionId } = useSelector(state => state.auth);

  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        if (!accessToken) {
          setError('No access token available. Please log in again.');
          setLoading(false);
          return;
        }

        const res = await api.get('/api/sessions', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setActiveSessions(res.data || []);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [accessToken]);

  const handleApiError = err => {
    if (err.response?.status === 401) {
      setError('Session expired. Please log in again.');
      dispatch(currentLogoutThunk());
    } else if (!err.response) {
      setError('Network error. Please check your connection.');
    } else {
      setError('Failed to fetch sessions. Please try again.');
    }
  };

  const handleLogoutFromSession = async sid => {
    try {
      await api.post(
        `/api/singlesessions/${sid}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      setActiveSessions(prev =>
        prev.filter(session => session.sessionId !== sid),
      );
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleLogoutFromAllDevices = () => {
    Alert.alert(
      'Logout All Devices',
      'This will log you out from all devices. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout All',
          style: 'destructive',
          onPress: () => dispatch(logoutAllThunk()),
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading sessions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Go to Login"
          onPress={() => navigation.navigate('Auth')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sessionsTitle}>Active Sessions</Text>

      {activeSessions.length > 0 ? (
        <FlatList
          data={activeSessions}
          keyExtractor={item => item.sessionId}
          renderItem={({ item }) => (
            <View
              style={[
                styles.sessionCard,
                item.sessionId === sessionId && styles.currentDeviceCard,
              ]}
            >
              <Text style={styles.sessionDevice}>
                {item.deviceInfo || 'Unknown Device'}
              </Text>
              <Text style={styles.sessionTime}>
                {new Date(item.loginTime).toLocaleString()}
              </Text>

              {item.sessionId === sessionId ? (
                <Text style={styles.currentDeviceText}>This Device</Text>
              ) : (
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={() => handleLogoutFromSession(item.sessionId)}
                >
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      ) : (
        <Text>No active sessions found</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Logout from This Device"
          color="#FF4C4C"
          onPress={() => dispatch(currentLogoutThunk())}
        />
        <View style={{ height: 10 }} />
        <Button
          title="Logout from All Devices"
          color="#FF9500"
          onPress={handleLogoutFromAllDevices}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sessionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  sessionCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  currentDeviceCard: {
    borderColor: 'green',
    backgroundColor: '#e6ffe6',
  },
  sessionDevice: {
    fontSize: 16,
    fontWeight: '600',
  },
  sessionTime: {
    fontSize: 14,
    color: '#777',
    marginVertical: 5,
  },
  currentDeviceText: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 5,
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: '#FF6F61',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
  },
});
