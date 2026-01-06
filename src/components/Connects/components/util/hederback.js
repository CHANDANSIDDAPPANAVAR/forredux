import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HeadreBack = ({
  title,
  id,
  backScreen,
  onBlockPress,
  onUnblockPress,
  onRemoveConnectionPress,
  showUnblock = false,
}) => {
  const navigation = useNavigation();

  const [menuVisible, setMenuVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [shareInitialCaption, setShareInitialCaption] = useState('');

  // 🔑 MENU POSITION STATE
  const menuBtnRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 12 });

  /* ---------------- BACK ---------------- */
  const onBackPress = () => {
    if (backScreen) {
      navigation.replace(backScreen);
    } else {
      navigation.goBack();
    }
  };

  /* ---------------- SHARE ---------------- */
  const onShareDone = () => {
    setShareVisible(false);
  };

  const openShare = () => {
    setMenuVisible(false);
    setShareInitialCaption('');
    setShareVisible(true);
  };

  /* ---------------- MENU OPEN (FIXED) ---------------- */
  const openMenu = () => {
    menuBtnRef.current?.measureInWindow((x, y, width, height) => {
      setMenuPos({
        top: y + height + 6,
        right: 12,
      });
      setMenuVisible(true);
    });
  };

  /* ---------------- MENU OPTIONS ---------------- */
  const renderMenuOptions = () => {
    if (showUnblock) {
      return (
        <>
          <TouchableOpacity style={styles.actionButton} onPress={openShare}>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setMenuVisible(false);
              onUnblockPress?.();
            }}
          >
            <Text style={styles.actionText}>Unblock</Text>
          </TouchableOpacity>
        </>
      );
    }

    const hasBlock = !!onBlockPress;
    const hasRemove = !!onRemoveConnectionPress;

    if (!hasBlock && !hasRemove) {
      return (
        <>
          <TouchableOpacity style={styles.actionButton} onPress={openShare}>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>

          <View style={[styles.actionButton, { backgroundColor: '#f0f0f0' }]}>
            <Text style={[styles.actionText, { color: '#aaa' }]}>
              No actions available
            </Text>
          </View>
        </>
      );
    }

    return (
      <>
        <TouchableOpacity style={styles.actionButton} onPress={openShare}>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        {hasBlock && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setMenuVisible(false);
              onBlockPress();
            }}
          >
            <Text style={styles.actionText}>Block</Text>
          </TouchableOpacity>
        )}

        {hasRemove && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setMenuVisible(false);
              onRemoveConnectionPress();
            }}
          >
            <Text style={styles.actionText}>Remove Connect</Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  const shouldShowMenu =
    showUnblock || !!onBlockPress || !!onRemoveConnectionPress || !!id;

  /* ---------------- RENDER ---------------- */
  return (
    <View style={styles.header}>
      {/* BACK */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={onBackPress}
        activeOpacity={0.7}
      >
        <Image
          source={require('../../../assets/icons/back-left.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      {/* TITLE */}
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>

      {/* MENU BUTTON */}
      {shouldShowMenu && (
        <TouchableOpacity
          ref={menuBtnRef}
          style={styles.menuBtn}
          onPress={openMenu}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../assets/choseaccount/menubtn.png')}
            style={styles.menuIcon}
          />
        </TouchableOpacity>
      )}

      {/* MENU MODAL */}
      <Modal
        transparent
        animationType="fade"
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setMenuVisible(false)}
        >
          <View
            style={[
              styles.menuContainer,
              {
                position: 'absolute',
                top: menuPos.top,
                right: menuPos.right,
              },
            ]}
          >
            {renderMenuOptions()}
          </View>
        </Pressable>
      </Modal>

      {/* SHARE MODAL (KEEP AS IS IF NEEDED)
      <ShareModal
        visible={shareVisible}
        entityId={id}
        shareType="account"
        initialCaption={shareInitialCaption}
        onDone={onShareDone}
      />
      */}
    </View>
  );
};

export default HeadreBack;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  backBtn: {
    padding: 4,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#2E2B2B',
  },
  title: {
    flex: 1,
    fontSize: 17,
    color: '#2E2B2B',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  menuBtn: {
    padding: 6,
    marginLeft: 6,
  },
  menuIcon: {
    width: 20,
    height: 20,
    tintColor: '#2E2B2B',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    minWidth: 180,
    paddingVertical: 6,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    marginVertical: 3,
  },
  actionText: {
    fontSize: 15,
    color: '#2E2B2B',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
});
