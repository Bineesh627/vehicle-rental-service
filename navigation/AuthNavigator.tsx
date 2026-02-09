import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Login } from "../app/Login";
import ShopOwnerSignup from "../app/ShopOwnerSignup";
import Signup from "../app/Signup";

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ShopSignup" component={ShopOwnerSignup} />
    </Stack.Navigator>
  );
};
