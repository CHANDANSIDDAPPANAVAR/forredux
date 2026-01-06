import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import {
  saveAccountTypeThunk,
  syncAccountTypeThunk,
} from '../../../../store/auth/authThunks';

import ConfirmModal from '../../../util/alerts/ConfirmModal';
import Header from '../../../Home/parts/Heder';
import Regheader from '../../../Auth/auth/components/utlits/Regheders';

/* ============================
   CONSTANTS
============================ */
const ACCOUNT_TYPES = [
  {
    key: 'OPEN_NETWORK',
    title: 'Open Network',
    subtitle: 'Social & public connections',
    icon: require('../../../assets/choseaccount/assets/opennetwork.png'),
    color: '#4F46E5',
  },
  {
    key: 'SERVICE',
    title: 'Service',
    subtitle: 'Freelancers & providers',
    icon: require('../../../assets/choseaccount/assets/serviceselicon.png'),
    color: '#059669',
  },
  {
    key: 'PROFESSIONALS',
    title: 'Professional',
    subtitle: 'Jobs & expertise',
    icon: require('../../../assets/choseaccount/assets/professel.png'),
    color: '#D97706',
  },
  {
    key: 'BUSINESS',
    title: 'Business',
    subtitle: 'Companies & brands',
    icon: require('../../../assets/choseaccount/assets/busselicon.png'),
    color: '#DC2626',
  },
];

/* ============================
   SMALL iOS SAFE HELPER
============================ */
const runAfterInteraction = fn => {
  requestAnimationFrame(() => {
    setTimeout(fn, 0);
  });
};

/* ============================
   SCREEN
============================ */
export default function ChooseAccountType() {
  const dispatch = useDispatch();

  const { userAccountType } = useSelector(state => state.auth);

  const [selectedType, setSelectedType] = useState(null);

  const [loading, setLoading] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    if (userAccountType) {
      setSelectedType(userAccountType);
    }
  }, [userAccountType]);

  /* 🧹 Kill keyboard + iOS responder bugs */
  useEffect(() => {
    runAfterInteraction(() => {
      dispatch(syncAccountTypeThunk());
    });
  }, [dispatch]);

  /* ============================
     CONFIRM ACTION
  ============================ */
  const handleConfirm = async () => {
    try {
      setLoading(true);
      await dispatch(saveAccountTypeThunk(selectedType));
    } catch (err) {
      alert(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
      setConfirmVisible(false);
    }
  };

  /* ============================
     UI
  ============================ */
  return (
    <SafeAreaView style={styles.safe}>
      <Regheader />
      <View style={styles.container}>
        {/* HEADER */}
        <Text style={styles.heading}>Choose your account type</Text>
        <Text style={styles.subheading}>
          This helps us personalize your experience
        </Text>

        {/* GRID */}
        <View style={styles.grid}>
          {ACCOUNT_TYPES.map(item => {
            const selected = selectedType === item.key;

            return (
              <Pressable
                key={item.key}
                onPressIn={() => {}}
                onPress={() => setSelectedType(item.key)}
                style={[
                  styles.card,
                  selectedType === item.key && {
                    borderColor: item.color,
                    shadowColor: item.color,
                  },
                ]}
              >
                <Image source={item.icon} style={styles.icon} />
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* CONTINUE BUTTON */}
        <Pressable
          onPressIn={() => {}}
          onPress={() => {
            if (!selectedType || loading) return;
            setConfirmVisible(true);
          }}
          style={[
            styles.confirmBtn,
            (!selectedType || loading) && styles.disabledBtn,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmText}>Continue</Text>
          )}
        </Pressable>
      </View>

      {/* CONFIRM MODAL */}
      {confirmVisible && (
        <ConfirmModal
          visible
          title="Confirm account type"
          message="This choice cannot be changed later."
          confirmText="Confirm"
          confirmColor="#4F46E5"
          onCancel={() => setConfirmVisible(false)}
          onConfirm={handleConfirm}
        />
      )}
    </SafeAreaView>
  );
}

/* ============================
   STYLES
============================ */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  heading: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    textAlign: 'center',
  },

  subheading: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 28,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 12,
    marginBottom: 16,
    alignItems: 'center',

    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',

    // Android
    elevation: 2,
    overflow: 'hidden',
    // iOS
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },

  /* Selected state */
  selectedCard: {
    borderWidth: 2,
    elevation: 6,

    // iOS glow
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },

  icon: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    textAlign: 'center',
  },

  cardSubtitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },

  confirmBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },

  disabledBtn: {
    opacity: 0.5,
  },

  confirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});
