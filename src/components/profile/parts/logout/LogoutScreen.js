import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSessions } from '../hooks/usesessions';
import ConfirmModal from '../../../util/alerts/ConfirmModal';
import styles from './logoutstyles';
import ScreenHeader from '../../../util/heders/btheder';

export default function LogoutScreen() {
  const { sessionId: currentSessionId } = useSelector(state => state.auth);

  const { sessions, loading, error, logoutSession, logoutCurrent, logoutAll } =
    useSessions();

  /**
   * confirmType can be:
   *  - null
   *  - 'current'
   *  - 'all'
   *  - { type: 'single', sessionId }
   */
  const [confirmType, setConfirmType] = useState(null);

  const closeModal = () => setConfirmType(null);

  const confirmAction = async () => {
    try {
      if (confirmType === 'current') {
        await logoutCurrent();
      } else if (confirmType === 'all') {
        await logoutAll();
      } else if (confirmType?.type === 'single') {
        await logoutSession(confirmType.sessionId);
      }
    } finally {
      closeModal();
    }
  };

  /* ============================
     LOADING / ERROR
  ============================ */
  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Checking active sessions…</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  /* ============================
     MAIN UI
  ============================ */
  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Active Sessions" />
      {/* HEADER */}
      <View style={styles.subcontiner}>
        <Text style={styles.subtitle}>
          Manage devices where your account is logged in
        </Text>

        {/* SESSION LIST */}
        <FlatList
          data={sessions}
          keyExtractor={item => item.sessionId}
          contentContainerStyle={{ paddingBottom: 160 }}
          renderItem={({ item }) => {
            const isCurrent = item.sessionId === currentSessionId;

            return (
              <View style={[styles.card, isCurrent && styles.currentCard]}>
                {/* ROW */}
                <View style={styles.row}>
                  {/* LEFT */}
                  <View style={styles.leftCol}>
                    <Text style={styles.deviceText}>
                      {item.deviceInfo || 'Unknown device'}
                    </Text>
                    <Text style={styles.timeText}>
                      {new Date(item.loginTime).toLocaleString()}
                    </Text>
                  </View>

                  {/* RIGHT */}
                  <View style={styles.rightCol}>
                    {isCurrent ? (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>This device</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.inlineLogoutBtn}
                        onPress={() =>
                          setConfirmType({
                            type: 'single',
                            sessionId: item.sessionId,
                          })
                        }
                      >
                        <Text style={styles.inlineLogoutText}>Logout</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          }}
        />

        {/* ACTION BAR */}
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => setConfirmType('current')}
          >
            <Text style={styles.primaryBtnText}>Logout from this device</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => setConfirmType('all')}
          >
            <Text style={styles.secondaryBtnText}>Logout from all devices</Text>
          </TouchableOpacity>
        </View>

        {/* CONFIRM MODAL */}
        <ConfirmModal
          visible={!!confirmType}
          title={
            confirmType === 'all'
              ? 'Logout from all devices?'
              : confirmType === 'current'
              ? 'Logout from this device?'
              : 'Logout this device?'
          }
          message={
            confirmType === 'all'
              ? 'You will be signed out everywhere.'
              : 'You will need to login again.'
          }
          confirmText="Logout"
          onCancel={closeModal}
          onConfirm={confirmAction}
        />
      </View>
    </SafeAreaView>
  );
}
