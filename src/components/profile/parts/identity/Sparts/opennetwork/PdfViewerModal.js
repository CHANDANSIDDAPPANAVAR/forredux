import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pdf from 'react-native-pdf';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.91;

const PdfViewerModal = ({ visible, uri, title, onClose }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) setLoading(true);
  }, [visible, uri]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* BACKDROP */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* BOTTOM SHEET */}
      <SafeAreaView style={styles.sheet}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle} numberOfLines={1}>
            {title || 'Document'}
          </Text>
        </View>

        {/* BODY */}
        <View style={styles.body}>
          {uri ? (
            <>
              {loading && (
                <View style={styles.loader}>
                  <ActivityIndicator size="large" color="#2563eb" />
                  <Text style={styles.loadingText}>Loading document…</Text>
                </View>
              )}

              <Pdf
                source={{ uri, cache: true }}
                style={styles.pdf}
                onLoadComplete={() => setLoading(false)}
                onError={() => {
                  Alert.alert('Failed to load PDF');
                  onClose();
                }}
              />
            </>
          ) : (
            <Text style={styles.placeholder}>No document</Text>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default React.memo(PdfViewerModal);

/* ---------------------------
   Styles
---------------------------- */
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },

  sheet: {
    position: 'absolute',
    bottom: 0,
    height: SHEET_HEIGHT,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },

  closeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },

  headerTitle: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#111827',
  },

  body: {
    flex: 1,
  },

  pdf: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },

  loader: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },

  loadingText: {
    marginTop: 8,
    fontSize: 13,
    color: '#6b7280',
  },

  placeholder: {
    padding: 20,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
  },
});
