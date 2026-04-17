import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from '../data/apiConfig';

const api_client = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api_client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('signalos_access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api_client;