import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

// Public endpoints that don't need authentication
const publicEndpoints = [
  '/users/login/',
  '/users/register/',
  '/users/token/refresh/',
  '/projects/',
  '/services/',
];

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token && config.url) {
    // Check if the request URL starts with any public endpoint
    const isPublic = publicEndpoints.some(endpoint => config.url?.startsWith(endpoint));
    if (!isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;