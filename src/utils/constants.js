import { Dimensions } from "react-native";
import { UPLOAD_IMAGE_PATH } from "@env";

// ─── FONTS ──────────────────────────────────────────────────────────────────
export const FONTS = {
  light: "Inter_300Light",
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  extrabold: "Inter_800ExtraBold",
};

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");

// ─── API ─────────────────────────────────────────────────────────────────────

export const AUTH_ENDPOINTS = {
  REQUEST_OTP: "/auth/request-otp",
  VERIFY_OTP: "/auth/verify-otp",
  UPDATE_PROFILE: "/auth/update-garage-profile",
  RESEND_OTP: "/auth/resend-otp",
};

// Endpoints whose backend route is NOT confirmed are `null` on purpose — see
// BACKEND_REQUIREMENTS.md. Do not fill these in with guesses.
export const CUSTOMER_ENDPOINTS = {
  CREATE: null, // POST — awaiting backend contract
};

export const GARAGE_USER_ENDPOINTS = {
  CREATE: null, // POST — awaiting backend contract
};

export const UPLOAD_ENDPOINTS = {
  IMAGE: UPLOAD_IMAGE_PATH || null, // set UPLOAD_IMAGE_PATH in .env
};

export const STORAGE_KEYS = {
  TOKEN: "@access_token", // legacy AsyncStorage location (migrated to SecureStore)
  USER: "@user",
  GARAGE: "@garage",
  PROFILE_COMPLETE: "@profile_complete",
};


// ─── RAW PALETTE ─────────────────────────────────────────────────────────────
export const PALETTE = {
  // Primary — Forest Green
  primary: "#1D9E75",
  primaryDark: "#2e6a5bff",
  primarySoft: "#E1F5EE",

  // Neutrals
  neutral900: "#111827",
  neutral700: "#374151",
  neutral600: "#4B5563",
  neutral400: "#9CA3AF",
  neutral300: "#D1D5DB",
  neutral200: "#E5E7EB",
  neutral100: "#F3F4F6",
  neutral50: "#F9FAFB",

  // Semantic
  error: "#E24B4A",
  errorLight: "#FEF2F2",
  warning: "#BA7517",
  warningLight: "#FFFBEB",
  success: "#1D9E75",
  successLight: "#E1F5EE",
  info: "#3B82F6",
  infoLight: "#EFF6FF",

  white: "#FFFFFF",
  black: "#000000",
};

// ─── COLORS (semantic aliases) ───────────────────────────────────────────────
export const COLORS = {
  // Brand
  primary: PALETTE.primary,
  primaryLight: PALETTE.primarySoft,
  primaryDark: PALETTE.primaryDark,
  secondary: PALETTE.warning,
  secondaryLight: PALETTE.warningLight,

  // Backgrounds
  bg: PALETTE.neutral50,
  bgCard: PALETTE.white,
  bgInput: PALETTE.neutral100,
  bgSection: PALETTE.neutral100,
  neutral50: PALETTE.neutral50,

  // Text
  textPrimary: PALETTE.neutral900,
  textSecondary: PALETTE.neutral600,
  textMuted: PALETTE.neutral400,
  textAccent: PALETTE.primary,

  // Borders
  border: PALETTE.neutral300,
  borderLight: PALETTE.neutral200,

  // Semantic
  success: PALETTE.success,
  successLight: PALETTE.successLight,
  warning: PALETTE.warning,
  warningLight: PALETTE.warningLight,
  error: PALETTE.error,
  errorLight: PALETTE.errorLight,
  live: PALETTE.error,
  liveLight: PALETTE.errorLight,

  // Gradients
  gradPrimary: [PALETTE.primary, PALETTE.primaryDark],
  gradPrimaryReverse: [PALETTE.primaryDark, PALETTE.primary],
  gradCard: [PALETTE.white, PALETTE.neutral50],
  gradGold: ["#BA7517", "#D9940A"],
  gradRoyal: [PALETTE.primary, PALETTE.warning],
  gradSuccess: [PALETTE.primary, "#34D399"],
  gradDeep: [PALETTE.primaryDark, PALETTE.primary],

  white: PALETTE.white,
  black: PALETTE.black,
};

// ─── TYPOGRAPHY ──────────────────────────────────────────────────────────────
export const TYPOGRAPHY = {
  display: { fontSize: 32, fontFamily: FONTS.extrabold, letterSpacing: -0.5 },
  h1: { fontSize: 26, fontFamily: FONTS.bold, letterSpacing: -0.3 },
  h2: { fontSize: 20, fontFamily: FONTS.semibold, letterSpacing: -0.2 },
  h3: { fontSize: 17, fontFamily: FONTS.semibold, letterSpacing: 0 },
  body: { fontSize: 15, fontFamily: FONTS.regular, lineHeight: 24 },
  caption: { fontSize: 13, fontFamily: FONTS.regular },
  label: { fontSize: 12, fontFamily: FONTS.medium, letterSpacing: 0.4 },
};

// ─── SHADOWS / ELEVATION ─────────────────────────────────────────────────────
export const SHADOWS = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
};

// ─── SIZES / SPACING (8px grid) ───────────────────────────────────────────────
export const SIZES = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Border Radii
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusFull: 999,

  // Typography
  textXs: 11,
  textSm: 13,
  textBase: 15,
  textMd: 17,
  textLg: 20,
  textXl: 24,
  textH: 26,

  screenPadding: 20,

  // Interactive element heights
  inputHeight: 56,
  btnHeightLg: 52,
  btnHeightMd: 44,
  btnHeightSm: 36,
  tabBarHeight: 64,
};
