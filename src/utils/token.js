// Client-side JWT expiry check. This only reads the `exp` claim to avoid
// sending a token the server will certainly reject — it does NOT verify the
// signature. Non-JWT / opaque tokens return null and are left to the server.
export const getTokenExpiryMs = (token) => {
  try {
    if (typeof token !== "string" || typeof atob !== "function") return null;
    const payload = token.split(".")[1];
    if (!payload) return null;
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const { exp } = JSON.parse(atob(padded));
    return typeof exp === "number" ? exp * 1000 : null;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token, skewMs = 30000) => {
  const expiry = getTokenExpiryMs(token);
  return expiry !== null && Date.now() >= expiry - skewMs;
};
