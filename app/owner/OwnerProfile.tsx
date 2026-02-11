import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { ArrowLeft, Lock, LogOut, Store } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function OwnerProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: user?.name || "John Owner",
    email: user?.email || "owner@rental.com",
    phone: user?.phone || "+1 555-0200",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    Toast.show({
      type: "success",
      text1: "Profile Updated",
      text2: "Your profile has been updated successfully.",
    });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "New passwords do not match.",
      });
      return;
    }
    Toast.show({
      type: "success",
      text1: "Password Changed",
      text2: "Your password has been updated successfully.",
    });
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const handleLogout = () => {
    logout();
    router.replace("/Login");
  };

  return (
    // Main Background Color: Dark Navy/Black (#13131A)
    <SafeAreaView className="flex-1 bg-[#13131A]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
          
          {/* Header */}
          <View className="px-4 py-4 flex-row items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 -ml-2"
              onPress={() => router.push("/owner/OwnerDashboard")}
            >
              <ArrowLeft size={24} className="text-white" />
            </Button>
            <Text className="text-xl font-bold text-white">Owner Profile</Text>
          </View>

          <View className="px-4 gap-6">
            {/* Avatar Section */}
            <View className="items-center gap-3 mt-4 mb-2">
              <View className="h-24 w-24 rounded-full bg-[#251F30] items-center justify-center border-2 border-[#251F30]">
                <Store size={40} color="#A855F7" /> 
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-white mb-1">
                  {formData.name}
                </Text>
                <Text className="text-base text-slate-400">Shop Owner</Text>
              </View>
            </View>

            {/* Profile Information Card */}
            {/* Card BG: #1E2330 (Lighter than main bg) */}
            <Card className="bg-[#1E2330] border-0 rounded-2xl shadow-sm">
              <CardHeader className="pb-2 border-b-0 mb-0">
                <View className="flex-row items-center justify-between w-full">
                  <Text className="text-lg font-bold text-white">
                    Profile Information
                  </Text>
                  <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                    <Text className="text-white font-medium text-sm">
                      {isEditing ? "Cancel" : "Edit"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </CardHeader>
              
              <CardContent className="gap-5 pt-0">
                <View className="gap-2">
                  <Text className="text-sm font-normal text-slate-300 ml-1">
                    Full Name
                  </Text>
                  <Input
                    value={formData.name}
                    onChangeText={(text) => handleInputChange("name", text)}
                    editable={isEditing}
                    placeholder="Full Name"
                    placeholderTextColor="#64748b"
                    // Input BG: #13131A (Matches main bg for cutout effect)
                    className={`bg-[#13131A] border-[#2D3345] text-white rounded-xl h-12 px-4 ${!isEditing ? "opacity-90" : ""}`}
                  />
                </View>
                
                <View className="gap-2">
                  <Text className="text-sm font-normal text-slate-300 ml-1">
                    Email Address
                  </Text>
                  <Input
                    value={formData.email}
                    onChangeText={(text) => handleInputChange("email", text)}
                    editable={isEditing}
                    keyboardType="email-address"
                    placeholder="Email Address"
                    placeholderTextColor="#64748b"
                    className={`bg-[#13131A] border-[#2D3345] text-white rounded-xl h-12 px-4 ${!isEditing ? "opacity-90" : ""}`}
                  />
                </View>

                <View className="gap-2">
                  <Text className="text-sm font-normal text-slate-300 ml-1">
                    Phone Number
                  </Text>
                  <Input
                    value={formData.phone}
                    onChangeText={(text) => handleInputChange("phone", text)}
                    editable={isEditing}
                    keyboardType="phone-pad"
                    placeholder="Phone Number"
                    placeholderTextColor="#64748b"
                    className={`bg-[#13131A] border-[#2D3345] text-white rounded-xl h-12 px-4 ${!isEditing ? "opacity-90" : ""}`}
                  />
                </View>

                {isEditing && (
                  <Button className="w-full mt-2 bg-[#A855F7]" onPress={handleSaveProfile}>
                    <Text className="text-white font-semibold">Save Changes</Text>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card className="bg-[#1E2330] border-0 rounded-2xl shadow-sm">
              <CardHeader className="pb-2 border-b-0 mb-0">
                <View className="flex-row items-center gap-2">
                  <Lock size={18} className="text-white" />
                  <Text className="text-lg font-bold text-white">
                    Change Password
                  </Text>
                </View>
              </CardHeader>
              
              <CardContent className="gap-5 pt-0">
                <View className="gap-2">
                  <Text className="text-sm font-normal text-slate-300 ml-1">
                    Current Password
                  </Text>
                  <Input
                    secureTextEntry
                    value={formData.currentPassword}
                    onChangeText={(text) => handleInputChange("currentPassword", text)}
                    placeholder="Enter current password"
                    placeholderTextColor="#64748b"
                    className="bg-[#13131A] border-[#2D3345] text-white rounded-xl h-12 px-4"
                  />
                </View>

                <View className="gap-2">
                  <Text className="text-sm font-normal text-slate-300 ml-1">
                    New Password
                  </Text>
                  <Input
                    secureTextEntry
                    value={formData.newPassword}
                    onChangeText={(text) => handleInputChange("newPassword", text)}
                    placeholder="Enter new password"
                    placeholderTextColor="#64748b"
                    className="bg-[#13131A] border-[#2D3345] text-white rounded-xl h-12 px-4"
                  />
                </View>

                <View className="gap-2">
                  <Text className="text-sm font-normal text-slate-300 ml-1">
                    Confirm New Password
                  </Text>
                  <Input
                    secureTextEntry
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleInputChange("confirmPassword", text)}
                    placeholder="Confirm new password"
                    placeholderTextColor="#64748b"
                    className="bg-[#13131A] border-[#2D3345] text-white rounded-xl h-12 px-4"
                  />
                </View>

                {/* Custom Styled Update Button (Teal Outline) */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="w-full mt-4 border border-[#2DD4BF] rounded-full h-12 items-center justify-center bg-transparent"
                  onPress={handleChangePassword}
                >
                  <Text className="text-[#2DD4BF] font-bold text-base">
                    Update Password
                  </Text>
                </TouchableOpacity>
              </CardContent>
            </Card>

            {/* Logout Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              className="w-full bg-[#DC2626] rounded-full h-14 flex-row items-center justify-center mt-2 mb-8"
              onPress={handleLogout}
            >
              <LogOut size={20} className="text-white mr-2" />
              <Text className="text-white font-bold text-lg">Logout</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}