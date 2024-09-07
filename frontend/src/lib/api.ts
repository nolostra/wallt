// lib/api.ts
import axios, { AxiosInstance } from "axios";
import { User, Preference, Profile } from "../types";
import { TOKEN_KEY, USER_KEY } from "@/config";

const auth_api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3001", // Replace with your actual API URL
});
// eslint-disable-next-line react-hooks/rules-of-hooks

const play_api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3002", // Replace with your actual API URL
});

// export const logout = async () => {
//   const token = localStorage.getItem(TOKEN_KEY);
//   const response = await auth_api.post("/logout", {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return response.data;
// };
let globalLogout: (() => void) | null = null;

export const setLogoutHandler = (logout: () => void) => {
  globalLogout = logout;
};

// Interceptor for handling 401 Unauthorized errors
const setupInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response, // Proceed if successful
    async (error) => {
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized access - logging out...");
        if (globalLogout) {
          globalLogout(); // Call the logout function if it's defined
        }
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
