import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Camera,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
} from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function EditProfile() {
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 555-0400",
    address: "123 Main Street, Downtown, City 12345",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    Toast.show({
      type: "success",
      text1: "Profile Updated",
      text2: "Your profile has been saved successfully.",
    });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your current password.",
      });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "New passwords do not match.",
      });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Password must be at least 6 characters.",
      });
      return;
    }
    Toast.show({
      type: "success",
      text1: "Password Changed",
      text2: "Your password has been updated successfully.",
    });
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="border-b border-border bg-card/95 px-4 py-3 flex-row items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onPress={() => router.navigate("profile" as never)}
            >
              <ArrowLeft size={20} className="text-foreground" />
            </Button>
            <Text className="text-lg font-bold text-foreground">
              Edit Profile
            </Text>
          </View>

          <View className="px-4 py-6 gap-6 pb-12">
            {/* Avatar */}
            <View className="items-center gap-4">
              <View className="relative">
                <View className="h-24 w-24 rounded-full bg-primary/10 items-center justify-center">
                  <Text className="text-3xl font-bold text-primary">JD</Text>
                </View>
                <TouchableOpacity
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary items-center justify-center"
                  onPress={() =>
                    Toast.show({
                      type: "info",
                      text1: "Change Photo",
                      text2: "Photo upload coming soon",
                    })
                  }
                >
                  <Camera size={16} className="text-primary-foreground" />
                </TouchableOpacity>
              </View>
              <Text className="text-sm text-muted-foreground">
                Tap to change photo
              </Text>
            </View>

            {/* Personal Information */}
            <Card className="border-border">
              <CardHeader className="pb-3 border-b border-border mb-3">
                <View className="flex-row items-center justify-between">
                  <CardTitle className="text-base text-foreground">
                    Personal Information
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={() => setIsEditing(!isEditing)}
                  >
                    <Text className="text-primary">
                      {isEditing ? "Cancel" : "Edit"}
                    </Text>
                  </Button>
                </View>
              </CardHeader>
              <CardContent className="gap-4">
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground flex-row items-center gap-2">
                    <User size={16} className="text-muted-foreground mr-2" />
                    Full Name
                  </Text>
                  <Input
                    value={profileData.name}
                    onChangeText={(text) => handleProfileChange("name", text)}
                    editable={isEditing}
                    className={!isEditing ? "opacity-50" : ""}
                  />
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground flex-row items-center gap-2">
                    <Mail size={16} className="text-muted-foreground mr-2" />
                    Email Address
                  </Text>
                  <Input
                    value={profileData.email}
                    onChangeText={(text) => handleProfileChange("email", text)}
                    editable={isEditing}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className={!isEditing ? "opacity-50" : ""}
                  />
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground flex-row items-center gap-2">
                    <Phone size={16} className="text-muted-foreground mr-2" />
                    Phone Number
                  </Text>
                  <Input
                    value={profileData.phone}
                    onChangeText={(text) => handleProfileChange("phone", text)}
                    editable={isEditing}
                    keyboardType="phone-pad"
                    className={!isEditing ? "opacity-50" : ""}
                  />
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground flex-row items-center gap-2">
                    <MapPin size={16} className="text-muted-foreground mr-2" />
                    Address
                  </Text>
                  <Input
                    value={profileData.address}
                    onChangeText={(text) =>
                      handleProfileChange("address", text)
                    }
                    editable={isEditing}
                    className={!isEditing ? "opacity-50" : ""}
                  />
                </View>
                {isEditing && (
                  <Button
                    className="w-full mt-2 flex-row gap-2"
                    onPress={handleSaveProfile}
                  >
                    <Save size={16} className="text-primary-foreground" />
                    <Text className="text-primary-foreground font-semibold">
                      Save Changes
                    </Text>
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
                    value={passwordData.currentPassword}
                    onChangeText={(text) =>
                      handlePasswordChange("currentPassword", text)
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
                    value={passwordData.newPassword}
                    onChangeText={(text) =>
                      handlePasswordChange("newPassword", text)
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
                    value={passwordData.confirmPassword}
                    onChangeText={(text) =>
                      handlePasswordChange("confirmPassword", text)
                    }
                    placeholder="Confirm new password"
                  />
                </View>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onPress={handleChangePassword}
                >
                  <Text className="text-foreground">Update Password</Text>
                </Button>
              </CardContent>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
