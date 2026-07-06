import axios from 'axios';

export const API_ORIGIN = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const API = axios.create({
  baseURL: `${API_ORIGIN}/api`,
});

/** Media paths from the API may be relative; make them absolute. */
export const mediaUrl = (path: string | null): string | null => {
  if (!path) return null;
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
};

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, try to refresh the access token once and retry the request.
let refreshing: Promise<string> | null = null;

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const refresh = localStorage.getItem('refresh');
    if (error.response?.status === 401 && refresh && !original._retried) {
      original._retried = true;
      try {
        refreshing =
          refreshing ||
          axios
            .post(`${API_ORIGIN}/api/users/token/refresh/`, { refresh })
            .then((res) => res.data.access as string)
            .finally(() => setTimeout(() => (refreshing = null), 0));
        const access = await refreshing;
        localStorage.setItem('access', access);
        original.headers.Authorization = `Bearer ${access}`;
        return API(original);
      } catch {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
