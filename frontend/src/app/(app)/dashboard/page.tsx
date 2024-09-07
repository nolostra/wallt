"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/app/globals.css";
import PreferenceForm from "@/components/PreferenceForm";
import Profile from "@/components/Profile";
import SimilarProfiles from "@/components/SimilarProfiles";
import { TOKEN_KEY } from "@/config";
import { useAuth } from "@/contexts/AuthContext";
import { setLogoutHandler } from "@/lib/api";
import Navbar from "@/components/Navbar";
const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const { logout } = useAuth();

  useEffect(() => {
    // Set the global logout function for use in API interceptors
    setLogoutHandler(logout);
  }, [logout]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <PreferenceForm />
            <Profile />
          </div>
          <SimilarProfiles />
        </div>
      </div>
    </>
  );
};

export default Home;
