import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <AuthProvider>
        <body>
          <Navbar />
          <main>{children}</main>
        </body>
      </AuthProvider>
    </html>
  );
};

export default Layout;
