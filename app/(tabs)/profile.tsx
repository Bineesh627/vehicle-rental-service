import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import {
  Bell,
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
  MapPin,
  Moon,
  Settings,
  Shield,
  Star,
  Sun,
  User,
} from "lucide-react-native";
import { useColorScheme } from "nativewind"; // Or manual theme handling
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const menuItems = [
  { icon: User, label: "Edit Profile", path: "EditProfile" },
  { icon: FileText, label: "KYC Verification", path: "KYC" },
  { icon: MapPin, label: "Saved Locations", path: "SavedLocations" },
  { icon: CreditCard, label: "Payment Methods", path: "PaymentMethods" },
  { icon: Bell, label: "Notifications", path: "Notifications" },
  { icon: Settings, label: "Settings", path: "Settings" },
  { icon: HelpCircle, label: "Help & Support", path: "Support" },
  { icon: Shield, label: "Privacy & Security", path: "Privacy" },
];

export default function Profile() {
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    await logout();
    Toast.show({
      type: "success",
      text1: "Logged out successfully",
    });
    router.replace("/Login");
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="bg-primary px-4 pb-20 pt-8 rounded-b-[2rem]">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-primary-foreground">
              Profile
            </Text>
            <TouchableOpacity
              onPress={toggleColorScheme}
              className="rounded-xl bg-primary-foreground/20 p-3 backdrop-blur-sm"
            >
              {colorScheme === "dark" ? (
                <Sun color="white" size={20} />
              ) : (
                <Moon color="white" size={20} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile card */}
        <View className="px-4 -mt-16">
          <View className="rounded-2xl bg-card p-6 shadow-sm border border-border">
            <View className="flex-row items-center gap-4">
              <View className="flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-500">
                <Text className="text-3xl font-bold text-white">JD</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-foreground">
                  John Doe
                </Text>
                <Text className="text-muted-foreground">
                  john.doe@example.com
                </Text>
                <View className="mt-2 flex-row items-center gap-1">
                  <Star color="#eab308" fill="#eab308" size={16} />
                  <Text className="text-sm font-medium text-foreground">
                    4.9 Rating
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    • 12 trips
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View className="mt-6 flex-row gap-4">
              <View className="flex-1 rounded-xl bg-secondary p-4 items-center">
                <Text className="text-2xl font-bold text-primary">12</Text>
                <Text className="text-xs text-muted-foreground">
                  Total Rides
                </Text>
              </View>
              <View className="flex-1 rounded-xl bg-secondary p-4 items-center">
                <Text className="text-2xl font-bold text-primary">$456</Text>
                <Text className="text-xs text-muted-foreground">
                  Total Spent
                </Text>
              </View>
              <View className="flex-1 rounded-xl bg-secondary p-4 items-center">
                <Text className="text-2xl font-bold text-primary">3</Text>
                <Text className="text-xs text-muted-foreground">
                  Saved Places
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View className="px-4 py-6">
          <View className="rounded-2xl bg-card shadow-sm border border-border overflow-hidden">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => {}} // Navigate to respective screens if they exist
                className="flex-row w-full items-center gap-4 border-b border-border p-4 bg-card"
              >
                <View className="rounded-xl bg-secondary p-3">
                  <item.icon color="#6b7280" size={20} />
                </View>
                <Text className="flex-1 text-left font-medium text-foreground">
                  {item.label}
                </Text>
                <ChevronRight color="#6b7280" size={20} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <View className="px-4">
          <Button
            variant="outline"
            className="w-full flex-row"
            size="lg"
            onPress={handleLogout}
          >
            <LogOut color="red" size={20} style={{ marginRight: 8 }} />
            <Text className="text-red-500 font-semibold">Logout</Text>
          </Button>
        </View>

        {/* Version */}
        <Text className="mt-6 text-center text-sm text-muted-foreground mb-6">
          Version 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}
