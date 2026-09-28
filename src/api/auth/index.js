import { AUTH_ENDPOINTS } from "../../utils/constants";
import axiosClient from "../axios";

const { REQUEST_OTP, VERIFY_OTP, UPDATE_PROFILE, RESEND_OTP } = AUTH_ENDPOINTS;

export const requestOtp = async (data) =>
  (await axiosClient.post(REQUEST_OTP, data)).data;

export const resendOtp = async (data) =>
  (await axiosClient.post(RESEND_OTP, data)).data;

export const verifyOtp = async (data) =>
  (await axiosClient.post(VERIFY_OTP, data)).data;

export const updateProfile = async (data) =>
  (await axiosClient.post(UPDATE_PROFILE, data)).data;
