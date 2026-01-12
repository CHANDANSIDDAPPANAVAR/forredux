import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  ToastAndroid,
  Modal,
  Dimensions,
} from 'react-native';

import { pick, types } from '@react-native-documents/picker';
import RNBlobUtil from 'react-native-blob-util';
import RNFS from 'react-native-fs';
import Pdf from 'react-native-pdf';

import { resolveMediaUrl } from '../../../../../../../services/mediaUrl';
import ConfirmModal from '../../../../../../util/alerts/ConfirmModal';

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const PDF_HEIGHT = SCREEN_HEIGHT * 0.9;

/* -------------------------
   Helpers
-------------------------- */

const cleanDocName = (name = '') =>
  name
    .replace(/\.pdf$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 30);

const normalizeFile = doc => {
  if (!doc || (!doc.uri && !doc.url)) return null;

  return {
    name: doc.name || doc.displayName || 'Document',
    uri: doc.uri || doc.url,
    url: doc.url || doc.uri,
    type: doc.type || 'application/pdf',
    displayName:
      doc.displayName ||
      cleanDocName(doc.name || doc.displayName || 'Document'),
  };
};

/* -------------------------
   Component
-------------------------- */

export default function ProfileFileScreen({
  onFilesPicked,
  initialFile,
  augtitle,
}) {
  const [file, setFile] = useState(null);
  const [docName, setDocName] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfUri, setPdfUri] = useState('');
  console.log(initialFile);
  /* -------------------consol------
     Sync backend value
  -------------------------- */
  useEffect(() => {
    if (!initialFile) {
      setFile(null);
      setDocName('');
      return;
    }

    // ✅ Handle array OR object
    const doc = Array.isArray(initialFile) ? initialFile[0] : initialFile;

    if (!doc) {
      setFile(null);
      setDocName('');
      return;
    }

    const normalized = normalizeFile(doc);
    if (!normalized) {
      setFile(null);
      setDocName('');
      return;
    }

    setFile(normalized);
    setDocName(normalized.displayName);
  }, [initialFile]);

  const showToast = msg => {
    Platform.OS === 'android'
      ? ToastAndroid.show(msg, ToastAndroid.SHORT)
      : Alert.alert('', msg);
  };

  /* -------------------------
     Pick PDF
  -------------------------- */
  const handleFilePick = async () => {
    try {
      setLoading(true);

      const [picked] = await pick({
        type: [types.pdf],
        allowMultiSelection: false,
      });

      if (!picked) return;

      if (picked.size && picked.size > MAX_FILE_SIZE) {
        Alert.alert('File too large', 'Please upload a PDF under 4 MB.');
        return;
      }

      const normalized = normalizeFile(picked);
      if (!normalized) return;

      setFile(normalized);
      setDocName(normalized.displayName);

      // ✅ ALWAYS SEND ARRAY
      onFilesPicked?.([normalized]);

      showToast('Document added');
    } catch (err) {
      if (
        err?.code === 'DOCUMENT_PICKER_CANCELED' ||
        err?.code === 'DOCUMENT_PICKER_CANCELLED'
      ) {
        return;
      }

      Alert.alert('Error', 'Unable to select document.');
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
     View PDF
  -------------------------- */
  const handleView = async doc => {
    try {
      let path = doc?.url;
      if (!path) return;

      // Android content://
      if (Platform.OS === 'android' && path.startsWith('content://')) {
        const temp = `${RNFS.TemporaryDirectoryPath}/view-${Date.now()}.pdf`;
        await RNFS.copyFile(path, temp);
        path = `file://${temp}`;
      }

      // Backend / remote
      if (path.startsWith('/') || path.startsWith('http')) {
        const local = `${RNFS.TemporaryDirectoryPath}/${Date.now()}.pdf`;
        const url = resolveMediaUrl(path);

        const res = await RNBlobUtil.config({
          fileCache: true,
          path: local,
        }).fetch('GET', url);

        if (res.info().status !== 200) throw new Error();
        path = `file://${local}`;
      }

      setPdfUri(path);
      setShowPdfViewer(true);
    } catch {
      showToast('Unable to open PDF');
    }
  };

  /* -------------------------
     Render
  -------------------------- */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Documents</Text>
      <Text style={styles.subtitle}>{augtitle} (PDF only, max 4 MB)</Text>

      {file && (
        <>
          <Text style={styles.label}>Document name</Text>
          <TextInput
            style={styles.input}
            value={docName}
            onChangeText={text => setDocName(text.slice(0, 30))}
            maxLength={30}
            autoCapitalize="words"
          />
          <Text style={styles.counter}>
            {30 - docName.length} characters left
          </Text>
        </>
      )}

      {!file && !loading && (
        <Text style={styles.helperText}>Select a PDF document to attach</Text>
      )}

      {loading && <ActivityIndicator style={{ marginVertical: 16 }} />}

      {file && !loading && (
        <View style={styles.fileCard}>
          <TouchableOpacity
            onPress={() => handleView(file)}
            style={{ flex: 1 }}
          >
            <Text style={styles.fileText} numberOfLines={1}>
              📄 {file.displayName}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setConfirmVisible(true)}>
            <Text style={styles.remove}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleFilePick}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {file ? 'Replace PDF' : 'Select PDF'}
        </Text>
      </TouchableOpacity>

      <ConfirmModal
        visible={confirmVisible}
        title="Remove document"
        message="Do you want to remove this document?"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          setFile(null);
          setDocName('');

          // ✅ ALWAYS SEND EMPTY ARRAY
          onFilesPicked?.([]);

          showToast('Document removed');
          setConfirmVisible(false);
        }}
      />

      {/* PDF Preview */}
      <Modal
        visible={showPdfViewer}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPdfViewer(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.pdfContainer, { height: PDF_HEIGHT }]}>
            <TouchableOpacity
              onPress={() => setShowPdfViewer(false)}
              style={styles.closeBar}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

            <Pdf
              source={{ uri: pdfUri }}
              style={{ flex: 1 }}
              onError={() => {
                showToast('Failed to load PDF');
                setShowPdfViewer(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* -------------------------
   Styles
-------------------------- */

const styles = StyleSheet.create({
  container: { marginBottom: 24 },

  title: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },

  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
  },

  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    marginLeft: 4,
    fontFamily: 'Poppins-SemiBold',
  },

  input: {
    backgroundColor: '#f6f6f6',
    padding: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
  },

  counter: {
    textAlign: 'right',
    fontSize: 11,
    color: '#888',
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },

  helperText: {
    fontSize: 12,
    color: '#777',
    marginTop: 6,
    marginLeft: 6,
    fontFamily: 'Poppins-Regular',
  },

  fileCard: {
    marginTop: 14,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  fileText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },

  remove: {
    color: '#d32f2f',
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
  },

  button: {
    marginTop: 12,
    backgroundColor: '#000',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  pdfContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },

  closeBar: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'flex-end',
  },

  closeText: {
    color: '#007bff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});
