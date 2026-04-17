import api_client from './apiClient';
import { normalize_success_response, normalize_error_response } from '../utils/apiResponse';

export async function get_dashboard_summary() {
  try {
    const response = await api_client.get('/dashboard/summary');
    return normalize_success_response(response);
  } catch (error) {
    return normalize_error_response(error);
  }
}