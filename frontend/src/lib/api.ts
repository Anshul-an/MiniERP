import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('your-railway')
      ? import.meta.env.VITE_API_URL
      : 'https://minierp-production-31188248.up.railway.app',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

// Map HTTP status codes to human-readable messages + redirect on 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

/**
 * Maps any caught error to a human-readable message.
 * Pages should call this in their catch blocks instead of showing raw error text.
 */
export function getErrorMessage(err: unknown): string {
  if (!err || typeof err !== 'object') return 'An unexpected error occurred.';

  const axiosErr = err as any;

  // Network / no response
  if (axiosErr.code === 'ERR_NETWORK' || !axiosErr.response) {
    return "Can't reach the server — check your connection.";
  }

  const status: number = axiosErr.response?.status;
  const serverMsg: string | undefined = axiosErr.response?.data?.message;

  // If the server sent a friendly message, prefer it
  if (serverMsg && typeof serverMsg === 'string' && serverMsg.length < 200) {
    return serverMsg;
  }

  switch (status) {
    case 400: return 'Invalid request — check your input and try again.';
    case 401: return 'Session expired — please sign in again.';
    case 403: return "You don't have permission to do that.";
    case 404: return 'The requested resource was not found.';
    case 422: return 'Validation failed — check your input.';
    case 500:
    case 502:
    case 503: return 'Something went wrong on our end. Try again in a moment.';
    default:  return 'An unexpected error occurred.';
  }
}

export default api;
