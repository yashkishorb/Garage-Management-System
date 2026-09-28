import { GARAGE_USER_ENDPOINTS } from "../utils/constants";
import axiosClient from "./axios";
import { requireEndpoint } from "./endpoint";

// POST payload: { firstName, lastName?, emailId?, phoneNo, role }
// Endpoint is unconfirmed → see BACKEND_REQUIREMENTS.md.
export const createGarageUser = async (payload) => {
  const path = requireEndpoint(
    GARAGE_USER_ENDPOINTS.CREATE,
    "GARAGE_USER_ENDPOINTS.CREATE",
  );
  return (await axiosClient.post(path, payload)).data;
};
