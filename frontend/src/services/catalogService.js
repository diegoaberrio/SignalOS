import api_client from './apiClient';
import { normalize_success_response, normalize_error_response } from '../utils/apiResponse';

export async function get_zones_catalog() {
  try {
    const response = await api_client.get('/public/catalogs/zones');
    return normalize_success_response(response);
  } catch (error) {
    return normalize_error_response(error);
  }
}

export async function get_sectors_catalog() {
  try {
    const response = await api_client.get('/public/catalogs/sectors');
    return normalize_success_response(response);
  } catch (error) {
    return normalize_error_response(error);
  }
}

export async function get_intentions_catalog() {
  try {
    const response = await api_client.get('/public/catalogs/intentions');
    return normalize_success_response(response);
  } catch (error) {
    return normalize_error_response(error);
  }
}

export async function create_public_interaction(payload) {
  try {
    const response = await api_client.post('/public/interactions', payload);
    return normalize_success_response(response);
  } catch (error) {
    return normalize_error_response(error);
  }
}