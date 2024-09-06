// lib/api.ts
import axios, { AxiosInstance } from "axios";
import { User, Preference, Profile } from "../types";
import { TOKEN_KEY } from "@/config";

const auth_api: AxiosInstance = axios.create({
  baseURL: process.env.API_AUTH_URL, // Replace with your actual API URL
});

const play_api: AxiosInstance = axios.create({
  baseURL: process.env.API_PLAY_URL, // Replace with your actual API URL
});

export const login = async (
  email: string,
  password: string
): Promise<{ token: string; user: User }> => {
  const response = await auth_api.post<{ token: string; user: User }>("/login", {
    email,
    password,
  });
  return {
    token: response.data.token,
    user: response.data.user,
  };
};

export const register = async (
  email: string,
  password: string
): Promise<User> => {
  const response = await auth_api.post<User>("/register", { email, password });
  return response.data;
};

export const addPreference = async (
  preferences: Partial<Preference>
): Promise<Preference> => {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await play_api.post<Preference>("/preferences", preferences, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getProfile = async (): Promise<Profile> => {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await play_api.get<Profile>("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getSimilarProfiles = async (): Promise<Profile[]> => {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await play_api.get<Profile[]>("/similar-profiles", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
