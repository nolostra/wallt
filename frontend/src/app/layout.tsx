"use client";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import { AuthProvider} from "@/contexts/AuthContext";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <AuthProvider>
        <body>
          <Toaster position="bottom-right" />
          <Navbar />
          <main>{children}</main>
        </body>
      </AuthProvider>
    </html>
  );
};

export default Layout;
