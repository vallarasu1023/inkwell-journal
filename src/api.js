import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
export const PEXELS_KEY = process.env.REACT_APP_PEXELS_KEY || '78a3ea3a24024b2c9a62e170130bbe1b';

const api = axios.create({ baseURL: `${API_URL}/api` });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(err);
  }
);

export default api;
