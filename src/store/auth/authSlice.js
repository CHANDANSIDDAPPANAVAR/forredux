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

  // ✅ ONLY FLAG (THIS IS ENOUGH)
  creatorCreated: false,
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
      state.bootstrapped = true;

      // tokens
      if (payload.accessToken !== undefined)
        state.accessToken = payload.accessToken;

      if (payload.refreshToken !== undefined)
        state.refreshToken = payload.refreshToken;

      if (payload.sessionId !== undefined) state.sessionId = payload.sessionId;

      // user info
      if (payload.userAccountType !== undefined)
        state.userAccountType = payload.userAccountType;

      if (payload.userSubscription !== undefined)
        state.userSubscription = payload.userSubscription;

      if (payload.userId !== undefined) state.userId = payload.userId;

      if (payload.userCountry !== undefined)
        state.userCountry = payload.userCountry;

      if (payload.userShownearby !== undefined)
        state.userShownearby = payload.userShownearby;

      // ✅ CREATOR FLAG (ONLY THIS)
      if (payload.creatorCreated !== undefined)
        state.creatorCreated = payload.creatorCreated;
    },

    authLogout() {
      return { ...initialState, loading: false, bootstrapped: true };
    },

    authFinish(state) {
      state.loading = false;
      state.bootstrapped = true;
    },
  },
});

export const { authStart, authSuccess, authLogout, authFinish } =
  authSlice.actions;

export default authSlice.reducer;
