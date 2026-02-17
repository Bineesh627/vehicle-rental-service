import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthUser, mockUsers } from "../types/auth";
import Constants from "expo-constants";

const getBaseUrl = () => {
  // Try to get the machine's IP from the Expo packager
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  if (localhost) {
    return `http://${localhost}:8000/api`;
  }

  // Fallback if detection fails
  return "http://192.168.43.122:8000/api";
};

const API_BASE_URL = getBaseUrl();

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{
    success: boolean;
    error?: string;
    redirectPath?: string;
    role?: string;
  }>;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string,
    role?: string,
  ) => Promise<{ success: boolean; error?: string }>;
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
    try {
      // Use dynamic base URL
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse login response:", parseError);
        return { success: false, error: "Server returned an invalid response" };
      }

      if (response.ok) {
        const userData = { ...data.user, token: data.token }; // user object from backend
        // Extend mock user structure if needed, or adapt type
        const authUser: AuthUser = {
          id: userData.id,
          name: userData.first_name || userData.username, // first_name is the user's name
          email: userData.email,
          phone: userData.phone || "", // Add phone if available or empty string
          role: userData.role || "user", // Fetch from backend
          avatar: "https://i.pravatar.cc/150?u=" + userData.email, // Placeholder
        };

        setUser(authUser);
        await AsyncStorage.setItem("auth_user", JSON.stringify(authUser));
        await AsyncStorage.setItem("auth_token", data.token);
        return { success: true, role: authUser.role };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (e) {
      console.error("Login error", e);
      return { success: false, error: "Network error or server unreachable" };
    }
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      phone?: string,
      role: string = "user",
    ) => {
      try {
        const response = await fetch(`${API_BASE_URL}/register/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: name, email, password, role }),
        });

        const data = await response.json();

        if (response.ok) {
          // Auto login after register
          return { success: true };
        } else {
          // Handle validation errors (data object might contain field-specific errors)
          const errorMsg = Object.values(data).flat().join(", ");
          return { success: false, error: errorMsg || "Registration failed" };
        }
      } catch (e) {
        console.error("Registration error", e);
        return { success: false, error: "Network error" };
      }
    },
    [],
  );

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
      value={{ user, isLoading, isAuthenticated, login, register, logout }}
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
