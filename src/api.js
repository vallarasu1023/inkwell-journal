import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL || 'https://inkwell-journal.onrender.com';
export const PEXELS_KEY = process.env.REACT_APP_PEXELS_KEY || '';

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