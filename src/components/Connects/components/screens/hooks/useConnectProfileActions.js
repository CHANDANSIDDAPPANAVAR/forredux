// hooks/useConnectProfileActions.js
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import api from '../../../../../services/api';

/* ---------------- RESET CONFIG ---------------- */
const RESET_TO_CONNECTS = {
  index: 0,
  routes: [
    {
      name: 'AppTabs',
      state: {
        index: 0,
        routes: [{ name: 'ConnectsTab' }],
      },
    },
  ],
};

export default function useConnectProfileActions({ userId }) {
  const navigation = useNavigation();
  const accessToken = useSelector(state => state.auth.accessToken);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH PROFILE ---------------- */
  useEffect(() => {
    let active = true;

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/connectprofile/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (active) {
          setProfile(res.data);
        }
      } catch (e) {
        // optional: toast / error state
      } finally {
        if (active) setLoading(false);
      }
    };

    if (userId && accessToken) {
      fetchProfile();
    } else {
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [userId, accessToken]);

  /* ---------------- RESET NAV ---------------- */
  const resetToConnects = useCallback(() => {
    navigation.reset(RESET_TO_CONNECTS);
  }, [navigation]);

  /* ---------------- BLOCK ---------------- */
  const blockUser = useCallback(async () => {
    if (!userId || !accessToken) return;

    await api.post(
      `/api/connect/block/${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    resetToConnects();
  }, [userId, accessToken, resetToConnects]);

  /* ---------------- REMOVE ---------------- */
  const removeConnection = useCallback(async () => {
    if (!userId || !accessToken) return;

    await api.delete(`/api/connect/unfollow/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    resetToConnects();
  }, [userId, accessToken, resetToConnects]);

  return {
    profile,
    loading,
    blockUser,
    removeConnection,
  };
}
