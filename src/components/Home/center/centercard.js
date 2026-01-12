import React, { useState, useCallback } from 'react';
import {
  View,
  Image,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from './coustombutton';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window');
const CARD_HORIZONTAL_PADDING = 16;
const CARD_BORDER_RADIUS = 16;

function OptionButton({ onPress, iconSource, title, subtitle, testID }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionButton,
        pressed && styles.optionPressed,
      ]}
      testID={testID}
    >
      {iconSource ? (
        <Image
          source={iconSource}
          style={styles.optionIcon}
          resizeMode="contain"
        />
      ) : null}

      <Text numberOfLines={1} style={styles.optionText}>
        {title}
      </Text>
      <Text numberOfLines={2} style={styles.optionSub}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

export default function QRCard({ fadeAnim = null }) {
  const navigation = useNavigation();
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const openCreateModal = useCallback(() => setCreateModalVisible(true), []);
  const closeCreateModal = useCallback(() => setCreateModalVisible(false), []);

  const onSelectCreateOption = useCallback(
    option => {
      closeCreateModal();

      const routeMap = {
        Spark: 'MainAddstory',
        Moments: 'Momentpost',
        clips: 'CameraClipsOnly',
        market: 'CreateMarket',
        default: 'CreateScreen',
      };

      const routeName = routeMap[option] || routeMap.default;
      navigation.navigate(routeName);
    },
    [navigation, closeCreateModal],
  );

  // ✅ PRODUCTION-GRADE QR SCAN HANDLER
  const openQRScanner = useCallback(() => {
    navigation.navigate('QRScanner', {
      onScan: value => {
        if (!value) return;

        // 🔗 URL → WebView
        if (value.startsWith('http')) {
          navigation.navigate('WebViewScreen', { url: value });
          return;
        }

        // 📦 Handle non-URL QR data here
        console.log('Scanned QR:', value);
      },
    });
  }, [navigation]);

  return (
    <>
      <Animated.View
        style={[styles.card, fadeAnim ? { opacity: fadeAnim } : {}]}
      >
        <Image
          source={require('../../assets/icons/Blink.png')}
          style={styles.bgDecor}
          accessibilityIgnoresInvertColors
        />

        <View style={styles.cardContent}>
          <CustomButton
            title="My QR Code"
            bgColor="#21b06b"
            onPress={() => navigation.navigate('MyQRCodeScreen')}
            accessibilityLabel="Open my QR code"
          />

          <Image
            source={require('../../assets/icons/checkout.png')}
            style={styles.centerimg}
            resizeMode="contain"
            accessible
            accessibilityLabel="QR illustration"
          />

          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Scan to Unlock New Connections</Text>
            <Text style={styles.cardSubtitle}>Scan. Connect. Grow.</Text>
          </View>

          {/* ✅ SCAN NOW → QRScanner */}
          <CustomButton
            title="Scan Now"
            bgColor="#3b6bff"
            onPress={openQRScanner}
            accessibilityLabel="Open QR scanner"
          />

          <Pressable
            style={styles.createTouch}
            onPress={openCreateModal}
            accessibilityRole="button"
            accessibilityLabel="Open create menu"
            testID="openCreateModal"
          >
            <Text style={styles.createText}>Create</Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* Create Modal */}
      <Modal
        visible={createModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeCreateModal}
      >
        <SafeAreaView style={styles.modalWrapper}>
          <Pressable style={styles.modalOverlay} onPress={closeCreateModal} />

          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Create</Text>

            <View style={styles.optionsRow}>
              <OptionButton
                onPress={() => onSelectCreateOption('Spark')}
                iconSource={require('../../assets/icons/chat.png')}
                title="Spark"
                subtitle="Share short stories with photos or videos"
              />

              <OptionButton
                onPress={() => onSelectCreateOption('Moments')}
                iconSource={require('../../assets/icons/chat.png')}
                title="Moments"
                subtitle="Showcase your moments in images or videos"
              />
            </View>

            <View style={styles.optionsRow}>
              <OptionButton
                onPress={() => onSelectCreateOption('clips')}
                iconSource={require('../../assets/icons/chat.png')}
                title="Clips"
                subtitle="Express yourself through short clips"
              />

              <OptionButton
                onPress={() => onSelectCreateOption('market')}
                iconSource={require('../../assets/icons/chat.png')}
                title="Market"
                subtitle="Showcase products and find buyers or renters"
              />
            </View>

            <Pressable
              onPress={closeCreateModal}
              style={({ pressed }) => [
                styles.closeBtn,
                pressed && styles.closeBtnPressed,
              ]}
              accessibilityRole="button"
            >
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    marginBottom: 16,
    marginHorizontal: CARD_HORIZONTAL_PADDING,
    borderRadius: CARD_BORDER_RADIUS,
    overflow: 'hidden',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 6,
      },
    }),
  },
  bgDecor: {
    position: 'absolute',
    right: -12,
    bottom: -6,
    width: width * 0.62,
    height: height * 0.18,
    tintColor: '#EEF2FF',
    opacity: 0.95,
  },
  cardContent: {
    paddingHorizontal: 18,
    paddingVertical: 22,
    alignItems: 'center',
  },
  centerimg: {
    width: width * 0.36,
    height: height * 0.16,
    marginVertical: 12,
  },
  cardText: {
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#374151',
    marginTop: 4,
  },
  createTouch: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: '#0F1CD8',
  },
  createText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  modalWrapper: { flex: 1, justifyContent: 'flex-end' },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalContainer: {
    paddingBottom: 28,
    paddingHorizontal: 16,
    borderTopRightRadius: CARD_BORDER_RADIUS,
    borderTopLeftRadius: CARD_BORDER_RADIUS,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  modalHandle: {
    width: 44,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#E6E7F2',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  optionButton: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E7F2',
    alignItems: 'center',
    backgroundColor: '#FAFAFB',
  },
  optionPressed: { opacity: 0.95 },
  optionIcon: { width: 48, height: 48, marginBottom: 8 },
  optionText: { fontSize: 15, fontWeight: '700' },
  optionSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
  },
  closeBtn: { marginTop: 12, paddingVertical: 12 },
  closeBtnPressed: { opacity: 0.9 },
  closeText: { color: '#3B6BFF', fontSize: 15, fontWeight: '600' },
});
