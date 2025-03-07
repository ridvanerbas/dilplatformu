import { createContext, useContext } from "react";

type AuthContextType = {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const signOut = async () => {
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");
};
