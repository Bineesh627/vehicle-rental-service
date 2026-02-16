import { BottomNav } from "@/components/BottomNav";
import { Tabs } from "expo-router";
import { Calendar, Home, Search, User } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
          tabBarLabel: "Explore",
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, size }) => (
            <Calendar color={color} size={size} />
          ),
          tabBarLabel: "Bookings",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          tabBarLabel: "Profile",
        }}
      />
    </Tabs>
  );
}
