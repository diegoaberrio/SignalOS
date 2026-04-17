import api_client from './apiClient';
import { normalize_success_response, normalize_error_response } from '../utils/apiResponse';

export async function login_user(payload) {
  try {
    const response = await api_client.post('/auth/login', payload);
    const normalized = normalize_success_response(response);

    const access_token =
      normalized.data?.access_token ||
      normalized.data?.token ||
      normalized.data?.jwt ||
      null;

    if (access_token) {
      localStorage.setItem('signalos_access_token', access_token);
    }

    return normalized;
  } catch (error) {
    return normalize_error_response(error);
  }
}

export async function get_current_user() {
  try {
    const response = await api_client.get('/auth/me');
    return normalize_success_response(response);
  } catch (error) {
    return normalize_error_response(error);
  }
}

export function logout_user() {
  localStorage.removeItem('signalos_access_token');
}