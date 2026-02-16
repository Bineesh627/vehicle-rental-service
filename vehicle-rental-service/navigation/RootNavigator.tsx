import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { AuthNavigator } from "./AuthNavigator";
import { UserNavigator } from "./UserNavigator";

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { user, isAuthenticated, isLoading } = useAuth(); // Assuming isLoading exists in context, if not need to add

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            {user?.role === "staff" && (
              <Stack.Screen name="StaffApp" component={UserNavigator} /> // Placeholder for Staff
            )}
            {/* Default to User App for now if role not matched or is 'user' */}
            {(user?.role === "user" ||
              !["staff"].includes(user?.role as string)) && (
              <Stack.Screen name="UserApp" component={UserNavigator} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
