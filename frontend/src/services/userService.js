import api_client from './apiClient';
import { normalize_success_response, normalize_error_response } from '../utils/apiResponse';

export async function get_users(params = {}) {
  try {
    const response = await api_client.get('/users', { params });
    return normalize_success_response(response);
  } catch (error) {
    return normalize_error_response(error);
  }
}

export async function get_user_by_id(user_id) {
  try {
    const response = await api_client.get(`/users/${user_id}`);
    return normalize_success_response(response);
  } catch (error) {
    return normalize_error_response(error);
  }
}

export async function create_user(payload) {
  try {
    const response = await api_client.post('/users', payload);
    return normalize_success_response(response);
  } catch (error) {
    return normalize_error_response(error);
  }
}

export async function update_user(user_id, payload) {
  try {
    const response = await api_client.patch(`/users/${user_id}`, payload);
    return normalize_success_response(response);
  } catch (error) {
    return normalize_error_response(error);
  }
}

export async function update_user_status(user_id, payload) {
  try {
    const response = await api_client.patch(`/users/${user_id}/status`, payload);
    return normalize_success_response(response);
  } catch (error) {
    return normalize_error_response(error);
  }
}