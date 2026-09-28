import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { STORAGE_KEYS } from "./constants";

// The access token lives in the OS keychain/keystore (expo-secure-store) on
// native platforms. SecureStore keys may only contain [A-Za-z0-9._-], so it
// uses its own key. On web SecureStore is unavailable → AsyncStorage fallback.
const SECURE_TOKEN_KEY = "access_token";
const useSecureStore = Platform.OS !== "web";

export const saveToken = async (token) => {
  if (useSecureStore) {
    await SecureStore.setItemAsync(SECURE_TOKEN_KEY, token);
    // Drop any legacy (unencrypted) copy
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    return;
  }
  await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

export const getToken = async () => {
  if (!useSecureStore) return AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

  const secure = await SecureStore.getItemAsync(SECURE_TOKEN_KEY);
  if (secure) return secure;

  // One-time migration for sessions saved by older app versions
  const legacy = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  if (legacy) {
    await SecureStore.setItemAsync(SECURE_TOKEN_KEY, legacy);
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
  return legacy;
};

export const saveUser = (user) =>
  AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
export const getUser = async () => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER);
  return raw ? JSON.parse(raw) : null;
};

export const saveGarage = (garage) =>
  AsyncStorage.setItem(STORAGE_KEYS.GARAGE, JSON.stringify(garage));
export const getGarage = async () => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.GARAGE);
  return raw ? JSON.parse(raw) : null;
};

// true | false | null (null = unknown, e.g. session saved before this flag existed)
export const saveProfileComplete = (value) =>
  AsyncStorage.setItem(STORAGE_KEYS.PROFILE_COMPLETE, JSON.stringify(Boolean(value)));
export const getProfileComplete = async () => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE_COMPLETE);
  return raw === null ? null : JSON.parse(raw);
};

export const clearStorage = async () => {
  await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  if (useSecureStore) {
    await SecureStore.deleteItemAsync(SECURE_TOKEN_KEY);
  }
};
