'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TOKEN_KEY } from '@/config';

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by checking for a token in localStorage
    const token = localStorage.getItem(TOKEN_KEY);
    setIsLoggedIn(!!token); // Set to true if token exists
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY); // Clear token from localStorage
    setIsLoggedIn(false); // Update state to reflect the user is logged out
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={isLoggedIn ? '/dashboard' : '/login'}>
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
