import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: true,
  bootstrapped: false,
  isAuthenticated: false,

  // tokens
  accessToken: null,
  refreshToken: null,
  sessionId: null,

  // user info
  userAccountType: null,
  userSubscription: null,
  userId: null,
  userCountry: null,
  userShownearby: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /* =========================
       START LOADING
    ========================= */
    authStart(state) {
      state.loading = true;
    },

    /* =========================
       AUTH SUCCESS
    ========================= */
    authSuccess(state, action) {
      const payload = action.payload || {};

      state.loading = false;
      state.isAuthenticated = true;
      state.bootstrapped = true;
      state.accessToken = payload.accessToken ?? null;
      state.refreshToken = payload.refreshToken ?? null;
      state.sessionId = payload.sessionId ?? null;

      state.userAccountType = payload.userAccountType ?? null;
      state.userSubscription = payload.userSubscription ?? null;
      state.userId = payload.userId ?? null;
      state.userCountry = payload.userCountry ?? null;
      state.userShownearby = payload.userShownearby ?? null;
    },

    /* =========================
       AUTH LOGOUT
    ========================= */
    authLogout() {
      return { ...initialState, loading: false, bootstrapped: true };
    },

    /* =========================
       STOP LOADING (NO SESSION)
    ========================= */
    authFinish(state) {
      state.loading = false;
      state.bootstrapped = true;
    },
  },
});

export const { authStart, authSuccess, authLogout, authFinish } =
  authSlice.actions;

export default authSlice.reducer;
