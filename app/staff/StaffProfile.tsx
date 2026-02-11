import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  LogOut,
  User,
  Wrench,
  Lock,
} from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// Theme Colors
const COLORS = {
  background: "#111318",
  card: "#1A1F26",
  primary: "#2DD4BF",
  danger: "#B91C1C", // Red for Logout
  text: "#FFFFFF",
  textMuted: "#9CA3AF",
  border: "#2C3340",
  inputBg: "#111318", // Darker input background
};

export default function StaffProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "Mike Staff", // Hardcoded based on screenshot
    email: "staff@rental.com", // Hardcoded based on screenshot
    phone: "+1 555-0300", // Hardcoded based on screenshot
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

  // Custom Input Component to match design
  const CustomInput = ({
    label,
    value,
    onChangeText,
    icon: Icon,
    secureTextEntry = false,
    placeholder = "",
    editable = true,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    icon?: any;
    secureTextEntry?: boolean;
    placeholder?: string;
    editable?: boolean;
  }) => (
    <View className="mb-4">
      <Text className="text-white font-medium mb-2 ml-1">{label}</Text>
      <View
        className="flex-row items-center px-4 py-3.5 rounded-xl border"
        style={{
          backgroundColor: COLORS.inputBg,
          borderColor: COLORS.border,
        }}
      >
        {Icon && <Icon size={18} color={COLORS.textMuted} style={{ marginRight: 10 }} />}
        <TextInput
          className="flex-1 text-white text-base"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          editable={editable}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="flex-row items-center px-4 py-4 mb-2">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 rounded-full mr-3"
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Staff Profile</Text>
          </View>

          <View className="px-4 pb-12">
            {/* Avatar Section */}
            <View className="items-center mb-8">
              <View className="h-24 w-24 rounded-full bg-green-900/30 items-center justify-center mb-3 border border-green-800/50">
                <Wrench size={40} color="#22C55E" />
              </View>
              <Text className="text-2xl font-bold text-white">
                {formData.name}
              </Text>
              <Text className="text-gray-400">Rental Staff</Text>
            </View>

            {/* Profile Information Card */}
            <View
              className="p-5 rounded-2xl border mb-6"
              style={{
                backgroundColor: COLORS.card,
                borderColor: COLORS.border,
              }}
            >
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-lg font-bold text-white">
                  Profile Information
                </Text>
                <TouchableOpacity onPress={() => {
                   if(isEditing) handleSaveProfile();
                   else setIsEditing(true);
                }}>
                  <Text className="text-gray-400 font-medium">
                    {isEditing ? "Save" : "Edit"}
                  </Text>
                </TouchableOpacity>
              </View>

              <CustomInput
                label="Full Name"
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
                icon={User}
                editable={isEditing}
              />
              <CustomInput
                label="Email Address"
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                icon={null} // Icon is inside label in design, but input has no icon
                editable={isEditing}
              />
              <CustomInput
                label="Phone Number"
                value={formData.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
                icon={null}
                editable={isEditing}
              />

              {isEditing && (
                <TouchableOpacity
                  className="w-full py-3 rounded-full items-center mt-2"
                  style={{ backgroundColor: COLORS.primary }}
                  onPress={handleSaveProfile}
                >
                  <Text className="text-black font-bold text-base">
                    Save Changes
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Change Password Card */}
            <View
              className="p-5 rounded-2xl border mb-8"
              style={{
                backgroundColor: COLORS.card,
                borderColor: COLORS.border,
              }}
            >
              <View className="flex-row items-center gap-2 mb-6">
                <Lock size={18} color="white" />
                <Text className="text-lg font-bold text-white">
                  Change Password
                </Text>
              </View>

              <CustomInput
                label="Current Password"
                value={formData.currentPassword}
                onChangeText={(text) => handleInputChange("currentPassword", text)}
                secureTextEntry
                placeholder="Enter current password"
              />
              <CustomInput
                label="New Password"
                value={formData.newPassword}
                onChangeText={(text) => handleInputChange("newPassword", text)}
                secureTextEntry
                placeholder="Enter new password"
              />
              <CustomInput
                label="Confirm New Password"
                value={formData.confirmPassword}
                onChangeText={(text) => handleInputChange("confirmPassword", text)}
                secureTextEntry
                placeholder="Confirm new password"
              />

              <TouchableOpacity
                className="w-full py-3.5 rounded-full items-center mt-2"
                style={{ backgroundColor: COLORS.primary }}
                onPress={handleChangePassword}
              >
                <Text className="text-black font-bold text-base">
                  Update Password
                </Text>
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              className="w-full py-4 rounded-full flex-row items-center justify-center gap-2 mb-8"
              style={{ backgroundColor: COLORS.danger }}
              onPress={handleLogout}
            >
              <LogOut size={20} color="white" />
              <Text className="text-white font-bold text-base">Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}