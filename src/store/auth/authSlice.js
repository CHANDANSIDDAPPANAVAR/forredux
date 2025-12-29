import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: true,
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
    authStart(state) {
      state.loading = true;
    },

    authSuccess(state, action) {
      const payload = action.payload || {};

      state.loading = false;
      state.isAuthenticated = true;

      state.accessToken = payload.accessToken ?? state.accessToken;
      state.refreshToken = payload.refreshToken ?? state.refreshToken;
      state.sessionId = payload.sessionId ?? state.sessionId;

      state.userAccountType = payload.userAccountType ?? null;
      state.userSubscription = payload.userSubscription ?? null;
      state.userId = payload.userId ?? null;
      state.userCountry = payload.userCountry ?? null;
      state.userShownearby = payload.userShownearby ?? null;
    },

    authLogout() {
      return { ...initialState, loading: false };
    },
  },
});

export const { authStart, authSuccess, authLogout } = authSlice.actions;
export default authSlice.reducer;
