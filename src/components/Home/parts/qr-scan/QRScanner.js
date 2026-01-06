import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Animated,
  Linking,
  Platform,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import { SafeAreaView } from 'react-native-safe-area-context';

const QRScanner = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const device = useCameraDevice('back');
  const scannedRef = useRef(false);
  const timeoutRef = useRef(null);
  const scanAnim = useRef(new Animated.Value(0)).current;

  // ✅ Handle scanned QR
  const handleRead = value => {
    if (scannedRef.current) return;
    scannedRef.current = true;

    clearTimeout(timeoutRef.current);

    if (value && value.startsWith('http')) {
      // ✅ Navigate directly to WebView
      navigation.replace('WebViewScreen', { url: value });
      return;
    }

    // ❌ Non-URL or cancelled
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  // ✅ iOS + Android safe code scanner
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (!codes || codes.length === 0) return;

      const code = codes[0];
      if (!code?.value) return;

      handleRead(code.value);
    },
  });

  useEffect(() => {
    const requestPermission = async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    };

    requestPermission();
    scannedRef.current = false;

    // ⏱ Auto close after 30s
    timeoutRef.current = setTimeout(() => {
      handleRead(null);
    }, 30000);

    // 🔁 Scan animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    return () => {
      clearTimeout(timeoutRef.current);
      scannedRef.current = false;
    };
  }, []);

  const openAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  // ⏳ Loading
  if (hasPermission === null || !device) {
    return (
      <View style={styles.page2}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.infoText}>Preparing camera...</Text>
      </View>
    );
  }

  // 🚫 Permission denied
  if (hasPermission === false) {
    return (
      <View style={styles.page2}>
        <Text style={styles.infoText}>
          Camera permission denied. Enable it in settings.
        </Text>
        <TouchableOpacity onPress={openAppSettings} style={styles.actionBtn}>
          <Text style={styles.actionText}>⚙️ Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.page2}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true} // ✅ Required for iOS
        codeScanner={codeScanner}
        torch={torchOn ? 'on' : 'off'}
        enableZoomGesture
        onInitialized={() => setCameraReady(true)}
        onError={() => setCameraReady(false)}
      />

      {cameraReady && (
        <View style={styles.scanBox}>
          <Animated.View
            style={[
              styles.scanningLine,
              {
                transform: [
                  {
                    translateY: scanAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 220],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <TouchableOpacity
            onPress={() => setTorchOn(v => !v)}
            style={[styles.actionBtn, { marginRight: 10 }]}
          >
            <Text style={styles.actionText}>
              {torchOn ? '🔦 Torch On' : '💡 Torch Off'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleRead(null)}
            style={styles.actionBtn}
          >
            <Text style={styles.actionText}>❌ Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QRScanner;

const styles = StyleSheet.create({
  page2: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  scanBox: {
    position: 'absolute',
    top: '30%',
    width: 220,
    height: 220,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 2,
  },
  scanningLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#00FFAA',
    shadowColor: '#00FFAA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 100,
    paddingHorizontal: 20,
    width: '100%',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionBtn: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  actionText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
