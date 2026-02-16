import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "../global.css";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
