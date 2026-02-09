import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Lock,
  LogOut,
  Mail,
  Phone,
  Save,
  User,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function AdminProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
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
    if (!formData.currentPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your current password.",
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
    <SafeAreaView className="flex-1 bg-background pt-8">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="border-b border-border bg-card/95 px-4 py-3 flex-row items-center gap-3">
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <ArrowLeft className="text-foreground" size={24} />
          </Button>
          <Text className="text-lg font-bold text-foreground">
            Admin Profile
          </Text>
        </View>

        <ScrollView
          className="px-4 py-6"
          contentContainerStyle={{ gap: 24, paddingBottom: 40 }}
        >
          {/* Avatar Section */}
          <View className="items-center gap-4">
            <View className="h-24 w-24 rounded-full bg-destructive/10 items-center justify-center">
              <User size={48} className="text-destructive" />
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold text-foreground">
                {user?.name}
              </Text>
              <Text className="text-sm text-muted-foreground">
                System Administrator
              </Text>
            </View>
          </View>

          {/* Profile Information */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border mb-3">
              <View className="flex-row items-center justify-between">
                <CardTitle className="text-base text-foreground">
                  Profile Information
                </CardTitle>
                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                  <Text className="text-primary text-sm">
                    {isEditing ? "Cancel" : "Edit"}
                  </Text>
                </TouchableOpacity>
              </View>
            </CardHeader>
            <CardContent className="gap-4">
              <View className="gap-2">
                <View className="flex-row items-center gap-2">
                  <User size={16} className="text-muted-foreground" />
                  <Text className="text-sm font-medium text-foreground">
                    Full Name
                  </Text>
                </View>
                <Input
                  value={formData.name}
                  onChangeText={(text) => handleInputChange("name", text)}
                  editable={isEditing}
                  className={!isEditing ? "opacity-50" : ""}
                />
              </View>
              <View className="gap-2">
                <View className="flex-row items-center gap-2">
                  <Mail size={16} className="text-muted-foreground" />
                  <Text className="text-sm font-medium text-foreground">
                    Email Address
                  </Text>
                </View>
                <Input
                  keyboardType="email-address"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange("email", text)}
                  editable={isEditing}
                  className={!isEditing ? "opacity-50" : ""}
                />
              </View>
              <View className="gap-2">
                <View className="flex-row items-center gap-2">
                  <Phone size={16} className="text-muted-foreground" />
                  <Text className="text-sm font-medium text-foreground">
                    Phone Number
                  </Text>
                </View>
                <Input
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange("phone", text)}
                  editable={isEditing}
                  className={!isEditing ? "opacity-50" : ""}
                />
              </View>
              {isEditing && (
                <Button
                  className="w-full flex-row gap-2"
                  onPress={handleSaveProfile}
                >
                  <Save size={16} className="text-primary-foreground" />
                  <Text className="text-primary-foreground">Save Changes</Text>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border mb-3">
              <View className="flex-row items-center gap-2">
                <Lock size={16} className="text-foreground" />
                <CardTitle className="text-base text-foreground">
                  Change Password
                </CardTitle>
              </View>
            </CardHeader>
            <CardContent className="gap-4">
              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground">
                  Current Password
                </Text>
                <Input
                  secureTextEntry
                  value={formData.currentPassword}
                  onChangeText={(text) =>
                    handleInputChange("currentPassword", text)
                  }
                  placeholder="Enter current password"
                />
              </View>
              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground">
                  New Password
                </Text>
                <Input
                  secureTextEntry
                  value={formData.newPassword}
                  onChangeText={(text) =>
                    handleInputChange("newPassword", text)
                  }
                  placeholder="Enter new password"
                />
              </View>
              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground">
                  Confirm New Password
                </Text>
                <Input
                  secureTextEntry
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    handleInputChange("confirmPassword", text)
                  }
                  placeholder="Confirm new password"
                />
              </View>
              <Button
                variant="outline"
                className="w-full"
                onPress={handleChangePassword}
              >
                <Text className="text-foreground">Update Password</Text>
              </Button>
            </CardContent>
          </Card>

          {/* Logout */}
          <Button
            variant="destructive"
            className="w-full flex-row gap-2"
            onPress={handleLogout}
          >
            <LogOut size={16} className="text-destructive-foreground" />
            <Text className="text-destructive-foreground">Logout</Text>
          </Button>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
