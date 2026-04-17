import api_client from './apiClient';
import { normalize_success_response, normalize_error_response } from '../utils/apiResponse';

export async function get_companies(params = {}) {
  try {
    const response = await api_client.get('/companies', { params });
    return normalize_success_response(response);
  } catch (error) {
    return normalize_error_response(error);
  }
}

export async function get_company_by_id(company_id) {
  try {
    const response = await api_client.get(`/companies/${company_id}`);
    return normalize_success_response(response);
  } catch (error) {
    return normalize_error_response(error);
  }
}

export async function get_company_interactions(company_id, params = {}) {
  try {
    const response = await api_client.get(`/companies/${company_id}/interactions`, {
      params,
    });
    return normalize_success_response(response);
  } catch (error) {
    return normalize_error_response(error);
  }
}