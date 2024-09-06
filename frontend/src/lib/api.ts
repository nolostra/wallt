// lib/api.ts
import axios, { AxiosInstance } from "axios";
import { User, Preference, Profile } from "../types";
import { TOKEN_KEY, USER_KEY } from "@/config";
import { useAuth } from "@/contexts/AuthContext";

const auth_api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3001", // Replace with your actual API URL
});

const play_api: AxiosInstance = axios.create({
  baseURL: process.env.API_PLAY_URL, // Replace with your actual API URL
});

export const logout = async () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await auth_api.post("/logout", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
const setupInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => {
      return response; // Proceed with the response if successful
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        // Handle 401 Unauthorized error
        console.log("Unauthorized access - logging out...");
        const { logout } = useAuth();
        logout();
      }
      return Promise.reject(error);
    }
  );
};

setupInterceptors(auth_api);
setupInterceptors(play_api);
export const login = async (
  email: string,
  password: string
): Promise<{ token: string; user: User }> => {
  const response = await auth_api.post<{ token: string; user: User }>(
    "/login",
    {
      email,
      password,
    }
  );
  console.log("api data", response.data);
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
  const response = await play_api.post<Preference>(
    "/preferences",
    preferences,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getProfile = async (): Promise<Profile> => {
  const response = await localStorage.getItem(USER_KEY);

  return JSON.parse(response || "{}");
};

export const getSimilarProfiles = async (): Promise<Profile[]> => {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await play_api.get<Profile[]>("/similar-profiles", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
