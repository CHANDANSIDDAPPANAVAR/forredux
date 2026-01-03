import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';

const CallChatActions = ({ phoneNumber, onChatPress }) => {
  const handleCall = useCallback(() => {
    if (!phoneNumber) return;
    Linking.openURL(`tel:${phoneNumber}`);
  }, [phoneNumber]);

  if (!phoneNumber && !onChatPress) return null;

  return (
    <View style={styles.container}>
      {!!phoneNumber && (
        <TouchableOpacity
          style={[styles.button, styles.callBtn]}
          onPress={handleCall}
          activeOpacity={0.8}
        >
          <Text style={styles.callText}>Call</Text>
        </TouchableOpacity>
      )}

      {!!onChatPress && (
        <TouchableOpacity
          style={[styles.button, styles.chatBtn]}
          onPress={onChatPress}
          activeOpacity={0.8}
        >
          <Text style={styles.chatText}>Chat</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(CallChatActions);
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginVertical: 5,
  },

  button: {
    minWidth: 120,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  /* CALL */
  callBtn: {
    backgroundColor: '#2563eb',
  },

  callText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0.3,
  },

  /* CHAT */
  chatBtn: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5f5',
  },

  chatText: {
    color: '#1e3a8a',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0.3,
  },
});
