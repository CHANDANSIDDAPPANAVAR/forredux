import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';

import RNFS from 'react-native-fs';
import RNBlobUtil from 'react-native-blob-util';
import { resolveMediaUrl } from '../../../../../../services/mediaUrl';
import PdfViewerModal from './PdfViewerModal';

/* ---------------------------
   Helpers
---------------------------- */
const isLocalFile = uri =>
  uri?.startsWith('file://') || uri?.startsWith('content://');

/* ---------------------------
   Component
---------------------------- */
const DocumentsSection = ({ documents = [] }) => {
  const [visible, setVisible] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);
  const [docTitle, setDocTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const openDocument = useCallback(
    async doc => {
      if (loading) return;

      try {
        setLoading(true);

        const rawPath = typeof doc === 'string' ? doc : doc?.url;
        if (!rawPath) throw new Error('Invalid document');

        const title = doc?.displayName || doc?.name || 'Document';
        setDocTitle(title);

        /* ---------- LOCAL FILE ---------- */
        if (isLocalFile(rawPath)) {
          setPdfUri(rawPath);
          setVisible(true);
          return;
        }

        /* ---------- REMOTE FILE ---------- */
        const url = resolveMediaUrl(rawPath);
        if (!url) throw new Error('Invalid document URL');

        const fileName =
          rawPath.split('/').pop()?.split('?')[0] || `doc-${Date.now()}.pdf`;

        const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

        if (!(await RNFS.exists(localPath))) {
          await RNBlobUtil.config({
            fileCache: true,
            path: localPath,
          }).fetch('GET', url);
        }

        setPdfUri(`file://${localPath}`);
        setVisible(true);
      } catch {
        Alert.alert('Unable to open document');
      } finally {
        setLoading(false);
      }
    },
    [loading],
  );

  if (!documents.length) {
    return <View style={{ height: 1 }} />;
  }

  return (
    <View style={styles.container}>
      {documents.map((doc, index) => (
        <TouchableOpacity
          key={index}
          style={styles.item}
          activeOpacity={0.85}
          disabled={loading}
          onPress={() => openDocument(doc)}
        >
          <View style={styles.centerContent}>
            <Image
              source={require('../../../../../assets/util/pdficon.png')}
              style={styles.icon}
            />
            <Text style={styles.text} numberOfLines={1}>
              {doc.displayName || doc.name || 'Document'}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* ✅ PDF MODAL */}
      <PdfViewerModal
        visible={visible}
        uri={pdfUri}
        title={docTitle}
        onClose={() => {
          setVisible(false);
          setPdfUri(null);
          setDocTitle('');
        }}
      />
    </View>
  );
};

export default React.memo(DocumentsSection);

/* ---------------------------
   Styles
---------------------------- */
const styles = StyleSheet.create({
  container: {
    marginTop: 6,
  },

  item: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginVertical: 10,

    justifyContent: 'center',
  },

  centerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  icon: {
    width: 20,
    height: 20,
  },

  text: {
    maxWidth: '80%',
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
});
