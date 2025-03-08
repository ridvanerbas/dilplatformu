import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Create auth context
const AuthContext = createContext({
  user: null,
  loading: true,
  signOut: async () => {},
});

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage (for demo purposes)
    const userRole = localStorage.getItem("userRole");
    if (userRole) {
      setUser({
        role: userRole,
        name: localStorage.getItem("userName") || "User",
        email: `${userRole.toLowerCase()}@example.com`,
      });
    }
    setLoading(false);
  }, []);

  const signOut = async () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    setUser(null);
  };

  const value = {
    user,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
