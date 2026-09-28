import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getToken,
  getUser,
  getGarage,
  getProfileComplete,
  clearStorage,
} from "../../utils/storage";
import { isTokenExpired } from "../../utils/token";

// ─── Session Restore Thunk ─────────────────────────────────────────────────────
// Reads persisted data on app boot and hydrates Redux state. An expired JWT is
// discarded here so the user lands on Login instead of on a screen whose first
// API call would fail with 401.
export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const user = await getUser();
      if (!token || !user) return null;

      if (isTokenExpired(token)) {
        await clearStorage();
        return null;
      }

      const [garage, profileComplete] = await Promise.all([
        getGarage(),
        getProfileComplete(),
      ]);
      return { token, user, garage, profileComplete };
    } catch {
      // Corrupt/unreadable storage: start clean rather than half-restored
      await clearStorage().catch(() => {});
      return rejectWithValue(null);
    }
  },
);

// ─── Slice ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // { _id, phoneNo, role, fullName, ... }
    garage: null, // { garageName, garageOwnerName, ... }
    accessToken: null,
    // true | false | null. null = unknown (session saved before the flag existed)
    profileComplete: null,
    loading: true, // true until session restore completes
    isAuthenticated: false,
  },
  reducers: {
    // Dispatched after successful OTP verification
    loginSuccess(state, action) {
      const { user, garage, accessToken, isProfileComplete } = action.payload;
      state.user = user;
      state.garage = garage ?? null;
      state.accessToken = accessToken;
      state.profileComplete =
        typeof isProfileComplete === "boolean" ? isProfileComplete : null;
      state.isAuthenticated = true;
      state.loading = false;
    },
    // Dispatched after GarageDetails form is saved successfully
    updateGarage(state, action) {
      state.garage = { ...state.garage, ...action.payload };
    },
    setProfileComplete(state, action) {
      state.profileComplete = Boolean(action.payload);
    },
    // Dispatched on logout or when the API reports the session is invalid
    logout(state) {
      state.user = null;
      state.garage = null;
      state.accessToken = null;
      state.profileComplete = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.garage = action.payload.garage ?? null;
          state.accessToken = action.payload.token;
          state.profileComplete = action.payload.profileComplete ?? null;
          state.isAuthenticated = true;
        }
        state.loading = false;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.loading = false;
      });
  },
});

// Owners who haven't finished garage onboarding must complete it before using
// the app. `=== false` (not falsy) so unknown/legacy sessions aren't trapped.
export const selectNeedsGarageSetup = (state) =>
  state.auth.user?.role === "owner" && state.auth.profileComplete === false;

export const { loginSuccess, updateGarage, setProfileComplete, logout } =
  authSlice.actions;
export default authSlice.reducer;
