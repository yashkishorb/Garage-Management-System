import { UPLOAD_ENDPOINTS } from "../utils/constants";
import axiosClient from "./axios";
import { requireEndpoint } from "./endpoint";

const MIME_BY_EXT = { png: "image/png", webp: "image/webp", gif: "image/gif" };

// Uploads a local image (file:// URI from expo-image-picker) and resolves to
// the hosted URL string. Requires UPLOAD_IMAGE_PATH to be configured — the
// expected contract is documented in BACKEND_REQUIREMENTS.md.
export const uploadImage = async (uri) => {
  const path = requireEndpoint(UPLOAD_ENDPOINTS.IMAGE, "UPLOAD_IMAGE_PATH");

  const name = uri.split("/").pop() || "upload.jpg";
  const ext = /\.(\w+)$/.exec(name)?.[1]?.toLowerCase();
  const form = new FormData();
  form.append("file", { uri, name, type: MIME_BY_EXT[ext] || "image/jpeg" });

  const res = await axiosClient.post(path, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const url = res.data?.data?.url ?? res.data?.url;
  if (typeof url !== "string" || !url) {
    throw new Error("Upload succeeded but the server returned no image URL.");
  }
  return url;
};
