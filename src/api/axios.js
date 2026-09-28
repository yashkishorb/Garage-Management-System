import axios from "axios";
import { API_BASE_URL } from "@env";
import { getToken, clearStorage } from "../utils/storage";
import { isTokenExpired } from "../utils/token";
import { emitUnauthorized } from "./authEvents";

const SESSION_EXPIRED_MSG = "Session expired. Please login again.";

const axiosClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

const expireSession = async () => {
  await clearStorage();
  emitUnauthorized();
};

axiosClient.interceptors.request.use(
  async (config) => {
    if (!API_BASE_URL) {
      const err = new Error("API_BASE_URL is not set");
      err.displayMessage =
        "App is not configured (missing API_BASE_URL). See .env.example.";
      throw err;
    }

    const token = await getToken();
    if (token) {
      if (isTokenExpired(token)) {
        await expireSession();
        const err = new Error("Access token expired");
        err.displayMessage = SESSION_EXPIRED_MSG;
        throw err;
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

const buildDisplayMessage = (error, hadToken) => {
  const status = error?.response?.status;
  const data = error?.response?.data;

  const serverMessage =
    data?.msg ||
    data?.message ||
    data?.errors?.[0]?.msg ||
    data?.errors?.[0]?.message ||
    (typeof data?.error === "string" ? data.error : null);
  if (serverMessage) return serverMessage;

  if (error?.code === "ECONNABORTED") return "Request timed out. Try again.";
  if (!error?.response) return "No internet connection.";
  if (status === 401) return hadToken ? SESSION_EXPIRED_MSG : "Unauthorized.";
  if (status === 403) return "Access denied.";
  if (status === 404) return "Not found.";
  if (status >= 500) return "Server error. Try again later.";
  return "Something went wrong.";
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const hadToken = Boolean(error?.config?.headers?.Authorization);

    // Errors thrown by the request interceptor above (missing config, expired
    // token) already carry a message and have no HTTP response — keep it.
    if (!error.displayMessage) {
      // eslint-disable-next-line no-param-reassign
      error.displayMessage = buildDisplayMessage(error, hadToken);
    }

    // Only treat 401 as "session ended" if we actually sent a token; a 401 on
    // the login/OTP calls is just a failed attempt.
    if (status === 401 && hadToken) {
      await expireSession();
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
