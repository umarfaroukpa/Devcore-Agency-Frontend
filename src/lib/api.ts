import axios from 'axios';

const api = axios.create({ 
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://devcore-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

let currentToken: string | null = null;

const isClient = typeof window !== 'undefined';

// Helper functions
const getToken = (): string | null => {
  if (!isClient) return null;
  return localStorage.getItem('token') || currentToken;
};

const setToken = (token: string | null) => {
  currentToken = token;
  if (token && isClient) {
    localStorage.setItem('token', token);
  } else if (isClient) {
    localStorage.removeItem('token');
  }
};

// On app load, restore token from localStorage
if (isClient) {
  const storedToken = localStorage.getItem('token');
  if (storedToken) {
    currentToken = storedToken;
    api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    console.log('🔑 Token restored from localStorage');
  }
}

// Request interceptor  that adds token to every request
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    const publicRoutes = ['/auth/login', '/auth/signup', '/auth/verify-invite', '/auth/forgot-password'];
    const isPublic = publicRoutes.some(route => config.url?.includes(route));

    if (!isPublic && token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔄 Added token to request:', config.url);
    } else if (isPublic) {
      console.log('🔓 Public route - no token added');
    } else {
      console.log('⚠️ No token available for protected route:', config.url);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && isClient) {
      console.log('🔴 401 - Logging out');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      currentToken = null;
      delete api.defaults.headers.common.Authorization;

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Public functions
export function setAuthToken(token: string | null) {
  setToken(token);
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export function getAuthToken() {
  return getToken();
}

export function clearAuth() {
  setToken(null);
  localStorage.removeItem('user');
}

export default api;