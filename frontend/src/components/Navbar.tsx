"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TOKEN_KEY } from "@/config";
import { logout } from "@/lib/api";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter(); // Get router instance

  useEffect(() => {
    // Function to check if user is logged in
    const checkLoginStatus = () => {
      const token = localStorage.getItem(TOKEN_KEY);
      setIsLoggedIn(!!token); // Update state based on the presence of token
    };

    // Check login status on component mount
    checkLoginStatus();

    // Optional: Set up an event listener or other mechanism if needed to handle token changes
    window.addEventListener("storage", checkLoginStatus); // Handles changes from other tabs

    return () => {
      // Cleanup event listener
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []); // Empty dependency array to run only on mount

  const handleLogout = async () => {
    try {
      await logout(); // Make sure logout function is awaited if it's async
      localStorage.removeItem(TOKEN_KEY); // Clear token from localStorage
      setIsLoggedIn(false); // Update state to reflect the user is logged out
      router.push("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={isLoggedIn ? "/dashboard" : "/login"}>
          <p className="text-xl font-bold cursor-pointer">Profile App</p>
        </Link>
        <div className="flex items-center">
          {isLoggedIn ? (
            <>
              <Link href="/profile">
                <p className="mr-4 cursor-pointer">Profile</p>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <p className="mr-4 cursor-pointer">Login</p>
              </Link>
              <Link href="/register">
                <p className="cursor-pointer">Register</p>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
