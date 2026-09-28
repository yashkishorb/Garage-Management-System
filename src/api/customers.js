import { CUSTOMER_ENDPOINTS } from "../utils/constants";
import axiosClient from "./axios";
import { requireEndpoint } from "./endpoint";

// POST payload: { fullName, phoneNo, emailId?, address?, role: "customer" }
// Endpoint is unconfirmed → see BACKEND_REQUIREMENTS.md.
export const createCustomer = async (payload) => {
  const path = requireEndpoint(CUSTOMER_ENDPOINTS.CREATE, "CUSTOMER_ENDPOINTS.CREATE");
  return (await axiosClient.post(path, payload)).data;
};
