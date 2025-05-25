import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true  // Always send cookies like csrftoken
});

// Attach JWT token to all requests except login/register
instance.interceptors.request.use(config => {
  if (config.url && (config.url.includes('auth/login') || config.url.includes('auth/register') || config.url.includes('auth/csrf'))) {
    return config;
  }

  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
