// src/config/constants.ts

export const API_AUTH_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
export const API_PLAY_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user';

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
};

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/profile',
  PREFERENCES: '/preferences',
  SIMILAR_PROFILES: '/similar-profiles',
};