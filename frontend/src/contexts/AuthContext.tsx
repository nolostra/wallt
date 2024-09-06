"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin, register as apiRegister } from "@/lib/api";
import { TOKEN_KEY, USER_KEY, ROUTES } from "@/config/index";
import { User } from "@/types";

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // New state to track component mount

  useEffect(() => {
    // Ensure the component is mounted
    if (typeof window !== "undefined") {
      // Check if user is logged in (client-side logic)
      const storedUser = localStorage.getItem(USER_KEY);
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedUser) {
        console.log("User data retrieved from localStorage:", storedUser);
        // setUser(JSON.parse(storedUser)); // Placeholder, replace with actual user data
      }
      if (storedToken) {
        setToken(storedToken);
      }else{
        router.push(ROUTES.LOGIN);
      }
    }
    setIsLoading(false);
  }, []);




  const login = async (email: string, password: string) => {
    const { token, user } = await apiLogin(email, password);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);

    router.push(ROUTES.DASHBOARD); // Ensure router.push is called only after component mounts
  };

  const register = async (email: string, password: string) => {
    await apiRegister(email, password);

    router.push(ROUTES.LOGIN); // Ensure router.push is called only after component mounts
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    router.push(ROUTES.LOGIN); // Ensure router.push is called only after component mounts

  };



  return (
    <AuthContext.Provider
      value={{ token, user, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
