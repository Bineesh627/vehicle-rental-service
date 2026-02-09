import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/Login" />;
  }

  if (user?.role === "admin") {
    return <Redirect href="/admin" />;
  }
  if (user?.role === "owner") {
    return <Redirect href="/owner" />;
  }
  if (user?.role === "staff") {
    return <Redirect href="/staff" />;
  }

  return <Redirect href="/(tabs)" />;
}
