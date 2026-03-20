import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Calendar, Home as HomeIcon, Search, User } from "lucide-react-native";
import React from "react";
import Bookings from "../app/(tabs)/bookings";
import Explore from "../app/(tabs)/explore";
import Home from "../app/(tabs)/index";
import Profile from "../app/(tabs)/profile";
import Booking from "../app/Booking";
import BookingDetails from "../app/BookingDetails";
import ShopDetails from "../app/ShopDetails";
import ShopReviews from "../app/ShopReviews";
import Notifications from "../app/user/Notifications";
import VehicleDetails from "../app/VehicleDetails";

import { BottomNav } from "../components/BottomNav";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const UserTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
          tabBarLabel: "Explore",
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={Bookings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Calendar color={color} size={size} />
          ),
          tabBarLabel: "Bookings",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export const UserNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={UserTabs} />
      <Stack.Screen name="ShopDetails" component={ShopDetails} />
      <Stack.Screen name="VehicleDetails" component={VehicleDetails} />
      <Stack.Screen name="Booking" component={Booking} />
      <Stack.Screen name="BookingDetails" component={BookingDetails} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="ShopReviews" component={ShopReviews} />
    </Stack.Navigator>
  );
};
