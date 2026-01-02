import React, { useState, useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Linking,
  Modal,
  View,
  Image,
  Pressable,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { showToast } from '../../../../../util/alerts/toast';

const UPIPaymentButton = ({ upiId, payeeName = 'User', style, textStyle }) => {
  const [showErrorModal, setShowErrorModal] = useState(false);

  /* ---------------------------
     Open UPI App (iOS + Android)
  ---------------------------- */
  const handlePayment = useCallback(async () => {
    if (!upiId) {
      setShowErrorModal(true);
      return;
    }

    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}`;

    try {
      const supported = await Linking.canOpenURL(upiUrl);
      if (!supported) {
        setShowErrorModal(true);
        return;
      }

      await Linking.openURL(upiUrl);
    } catch {
      setShowErrorModal(true);
    }
  }, [upiId, payeeName]);

  /* ---------------------------
     Copy UPI ID
  ---------------------------- */
  const handleCopy = useCallback(() => {
    if (!upiId) return;
    Clipboard.setString(upiId);
    showToast('UPI ID copied to clipboard');
    setShowErrorModal(false);
  }, [upiId]);

  return (
    <>
      {/* PAY BUTTON */}
      <TouchableOpacity
        style={[styles.button, style]}
        onPress={handlePayment}
        activeOpacity={0.85}
      >
        <Text style={[styles.text, textStyle]}>Pay with UPI</Text>
      </TouchableOpacity>

      {/* FALLBACK MODAL */}
      <Modal
        visible={showErrorModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Unable to open UPI app</Text>

            <Text style={styles.modalMessage}>
              Please copy the UPI ID below and pay manually from your UPI app.
            </Text>

            <View style={styles.upiBox}>
              <Text selectable style={styles.upiId}>
                {upiId || '—'}
              </Text>

              <Pressable
                onPress={handleCopy}
                hitSlop={10}
                style={styles.copyIcon}
              >
                <Image
                  source={require('../../../../../assets/util/copyicon.png')}
                  style={styles.copyImage}
                />
              </Pressable>
            </View>

            <TouchableOpacity
              style={styles.okButton}
              onPress={() => setShowErrorModal(false)}
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default React.memo(UPIPaymentButton);
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#16a34a', // emerald-600
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    marginBottom: 14,

    // depth
    shadowColor: '#16a34a',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  text: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0.4,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)', // slate-900 overlay
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '88%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 22,

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827', // slate-900
    marginBottom: 6,
  },

  modalMessage: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#475569', // slate-600
    marginBottom: 18,
    lineHeight: 20,
  },

  upiBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc', // slate-50
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  upiId: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#0f172a', // slate-900
  },

  copyIcon: {
    paddingLeft: 8,
  },

  copyImage: {
    width: 22,
    height: 22,
    tintColor: '#2F80ED', // blue-600
  },

  okButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#2F80ED', // blue-600
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },

  okButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
});
