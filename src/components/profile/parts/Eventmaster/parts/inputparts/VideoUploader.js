import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Video from 'react-native-video';
import * as Progress from 'react-native-progress';
import api from '../../../../../../services/api';

const MAX_SIZE = 1024 * 1024 * 1024; // 1GB

export default function EventVideoUploader() {
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // 🔐 HARD LOCK (prevents double request 100%)
  const uploadingRef = useRef(false);

  const pickVideo = async () => {
    if (uploadingRef.current) return;

    const res = await launchImageLibrary({
      mediaType: 'video',
      selectionLimit: 1,
    });

    if (res.didCancel) return;

    const file = res.assets?.[0];
    if (!file) return;

    if (file.fileSize > MAX_SIZE) {
      Alert.alert('Error', 'Video must be under 1GB');
      return;
    }

    setVideo(file);
  };

  const uploadVideo = async () => {
    if (!video) return;

    // 🛑 STOP duplicate uploads
    if (uploadingRef.current) return;

    uploadingRef.current = true;
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('video', {
      uri: video.uri,
      type: video.type || 'video/mp4',
      name: video.fileName || 'event-video.mp4',
    });

    try {
      await api.post('/api/events/video/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => {
          if (!e.total) return;
          setProgress(e.loaded / e.total);
        },
      });

      Alert.alert('Success', 'Video uploaded & processing started');
      setVideo(null);
    } catch (err) {
      Alert.alert('Upload failed', err?.response?.data?.message || 'Try again');
    } finally {
      uploadingRef.current = false;
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Event Video (Optional)</Text>

      {!video ? (
        <TouchableOpacity
          style={styles.pickBtn}
          onPress={pickVideo}
          disabled={uploading}
          activeOpacity={0.7}
        >
          <Text style={styles.pickText}>Add Event Video</Text>
        </TouchableOpacity>
      ) : (
        <>
          <Video
            source={{ uri: video.uri }}
            style={styles.video}
            resizeMode="contain"
            controls
          />

          {uploading && (
            <Progress.Bar
              progress={progress}
              width={null}
              color="#000"
              borderRadius={6}
              style={{ marginVertical: 10 }}
            />
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.uploadBtn, uploading && { opacity: 0.6 }]}
              onPress={uploadVideo}
              disabled={uploading}
              activeOpacity={0.7}
            >
              <Text style={styles.btnText}>
                {uploading ? 'Uploading…' : 'Upload'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelBtn, uploading && { opacity: 0.6 }]}
              onPress={() => setVideo(null)}
              disabled={uploading}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  label: {
    fontSize: 13,
    marginBottom: 8,
    color: '#555',
    fontFamily: 'Poppins-SemiBold',
  },
  pickBtn: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  pickText: {
    color: '#fff',
    fontSize: 15,
  },
  video: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
    borderRadius: 10,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  uploadBtn: {
    flex: 1,
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
  },
});
