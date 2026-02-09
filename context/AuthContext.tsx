import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthUser, mockUsers } from "../types/auth";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string; redirectPath?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem("auth_user");
        if (stored) setUser(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load user", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const found = mockUsers.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );

    if (found) {
      const userData = found.user;
      setUser(userData);
      try {
        await AsyncStorage.setItem("auth_user", JSON.stringify(userData));
        return { success: true };
      } catch (e) {
        return { success: false, error: "Failed to save session" };
      }
    }
    return { success: false, error: "Invalid email or password" };
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem("auth_user");
    } catch (e) {
      console.error("Failed to remove user", e);
    }
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
