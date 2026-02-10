import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useRouter } from "expo-router";
import {
  AlertTriangle,
  ArrowLeft,
  Eye,
  EyeOff,
  FileText,
  Key,
  Lock,
  Shield,
  Smartphone,
  X,
} from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function PrivacySecurity() {
  const router = useRouter();

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    biometricLogin: true,
    loginAlerts: true,
    dataSharing: false,
    locationTracking: true,
    marketingEmails: false,
  });
  const [sessions] = useState([
    {
      id: "1",
      device: "iPhone 14 Pro",
      location: "New York, US",
      lastActive: "Active now",
      current: true,
    },
    {
      id: "2",
      device: "MacBook Pro",
      location: "New York, US",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      id: "3",
      device: "iPad Air",
      location: "Boston, US",
      lastActive: "3 days ago",
      current: false,
    },
  ]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    Toast.show({
      type: "success",
      text1: "Setting Updated",
    });
  };

  const handleChangePassword = () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields.",
      });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "New passwords do not match.",
      });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Password must be at least 8 characters.",
      });
      return;
    }
    Toast.show({
      type: "success",
      text1: "Password Changed",
      text2: "Your password has been updated successfully.",
    });
    setShowPasswordDialog(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleLogoutSession = (sessionId: string) => {
    Toast.show({
      type: "success",
      text1: "Session Ended",
      text2: "Device has been logged out.",
    });
  };

  const handleLogoutAll = () => {
    Toast.show({
      type: "success",
      text1: "All Sessions Ended",
      text2: "You've been logged out from all other devices.",
    });
  };

  const handleDeleteAccount = () => {
    Toast.show({
      type: "error",
      text1: "Account Scheduled for Deletion",
    });
    setShowDeleteDialog(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
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
            Privacy & Security
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-4 py-6"
          contentContainerStyle={{ gap: 24, paddingBottom: 40 }}
        >
          {/* Security */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border mb-3">
              <View className="flex-row items-center gap-2">
                <Shield size={16} className="text-foreground" />
                <CardTitle className="text-base text-foreground">
                  Security
                </CardTitle>
              </View>
            </CardHeader>
            <CardContent className="gap-4">
              <TouchableOpacity
                className="flex-row items-center py-2"
                onPress={() => setShowPasswordDialog(true)}
              >
                <Key size={16} className="text-muted-foreground mr-3" />
                <Text className="text-base text-foreground">
                  Change Password
                </Text>
              </TouchableOpacity>

              <View className="flex-row items-center justify-between py-2">
                <View className="flex-row items-center gap-3 flex-1">
                  <Smartphone size={16} className="text-muted-foreground" />
                  <View>
                    <Text className="font-medium text-foreground">
                      Two-Factor Authentication
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      Add extra security
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.twoFactorAuth}
                  onValueChange={() => toggleSetting("twoFactorAuth")}
                />
              </View>

              <View className="flex-row items-center justify-between py-2">
                <View className="flex-row items-center gap-3 flex-1">
                  <Eye size={16} className="text-muted-foreground" />
                  <View>
                    <Text className="font-medium text-foreground">
                      Biometric Login
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      Use fingerprint or face ID
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.biometricLogin}
                  onValueChange={() => toggleSetting("biometricLogin")}
                />
              </View>

              <View className="flex-row items-center justify-between py-2">
                <View className="flex-row items-center gap-3 flex-1">
                  <AlertTriangle size={16} className="text-muted-foreground" />
                  <View>
                    <Text className="font-medium text-foreground">
                      Login Alerts
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      Get notified of new logins
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.loginAlerts}
                  onValueChange={() => toggleSetting("loginAlerts")}
                />
              </View>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border mb-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Smartphone size={16} className="text-foreground" />
                  <CardTitle className="text-base text-foreground">
                    Active Sessions
                  </CardTitle>
                </View>
                <TouchableOpacity onPress={handleLogoutAll}>
                  <Text className="text-xs text-destructive font-medium">
                    Logout All
                  </Text>
                </TouchableOpacity>
              </View>
            </CardHeader>
            <CardContent className="gap-3">
              {sessions.map((session) => (
                <View
                  key={session.id}
                  className="flex-row items-center justify-between p-3 rounded-xl bg-secondary/50"
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <Smartphone size={20} className="text-muted-foreground" />
                    <View>
                      <View className="flex-row items-center gap-2">
                        <Text className="font-medium text-foreground text-sm">
                          {session.device}
                        </Text>
                        {session.current && (
                          <View className="px-2 py-0.5 rounded-full bg-green-500/10">
                            <Text className="text-xs text-green-500">
                              Current
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-xs text-muted-foreground">
                        {session.location} • {session.lastActive}
                      </Text>
                    </View>
                  </View>
                  {!session.current && (
                    <TouchableOpacity
                      onPress={() => handleLogoutSession(session.id)}
                    >
                      <Text className="text-xs text-destructive font-medium">
                        Logout
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border mb-3">
              <View className="flex-row items-center gap-2">
                <Lock size={16} className="text-foreground" />
                <CardTitle className="text-base text-foreground">
                  Privacy
                </CardTitle>
              </View>
            </CardHeader>
            <CardContent className="gap-4">
              <View className="flex-row items-center justify-between py-2">
                <View className="flex-1">
                  <Text className="font-medium text-foreground">
                    Data Sharing
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    Share data with partners for offers
                  </Text>
                </View>
                <Switch
                  value={settings.dataSharing}
                  onValueChange={() => toggleSetting("dataSharing")}
                />
              </View>
              <View className="flex-row items-center justify-between py-2">
                <View className="flex-1">
                  <Text className="font-medium text-foreground">
                    Location Tracking
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    Allow location access for delivery
                  </Text>
                </View>
                <Switch
                  value={settings.locationTracking}
                  onValueChange={() => toggleSetting("locationTracking")}
                />
              </View>
              <View className="flex-row items-center justify-between py-2">
                <View className="flex-1">
                  <Text className="font-medium text-foreground">
                    Marketing Emails
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    Receive promotional emails
                  </Text>
                </View>
                <Switch
                  value={settings.marketingEmails}
                  onValueChange={() => toggleSetting("marketingEmails")}
                />
              </View>
            </CardContent>
          </Card>

          {/* Policies */}
          <Card className="border-border">
            <CardContent className="p-0">
              {["Privacy Policy", "Terms of Service", "Data Usage Policy"].map(
                (item, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`flex-row items-center p-4 ${
                      index !== 2 ? "border-b border-border" : ""
                    }`}
                  >
                    <FileText
                      size={16}
                      className="mr-3 text-muted-foreground"
                    />
                    <Text className="text-foreground">{item}</Text>
                  </TouchableOpacity>
                ),
              )}
            </CardContent>
          </Card>

          {/* Delete Account */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-4 flex-row items-start gap-3">
              <AlertTriangle size={20} className="text-destructive mt-0.5" />
              <View className="flex-1">
                <Text className="font-medium text-foreground">
                  Delete Account
                </Text>
                <Text className="text-xs text-muted-foreground mt-1">
                  Permanently delete your account and all associated data.
                </Text>
                <TouchableOpacity
                  className="mt-3 bg-destructive self-start px-3 py-1.5 rounded-md"
                  onPress={() => setShowDeleteDialog(true)}
                >
                  <Text className="text-destructive-foreground text-xs font-semibold">
                    Delete My Account
                  </Text>
                </TouchableOpacity>
              </View>
            </CardContent>
          </Card>
        </ScrollView>

        {/* Change Password Modal */}
        <Modal
          visible={showPasswordDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPasswordDialog(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <View className="bg-background w-full max-w-sm rounded-xl p-6 gap-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-foreground">
                  Change Password
                </Text>
                <TouchableOpacity onPress={() => setShowPasswordDialog(false)}>
                  <X size={24} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>

              <View className="gap-4">
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Current Password
                  </Text>
                  <View className="relative">
                    <Input
                      secureTextEntry={!showPasswords.current}
                      value={passwordForm.currentPassword}
                      onChangeText={(text) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: text,
                        }))
                      }
                      placeholder="Enter current password"
                    />
                    <TouchableOpacity
                      className="absolute right-3 top-3"
                      onPress={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          current: !prev.current,
                        }))
                      }
                    >
                      {showPasswords.current ? (
                        <EyeOff size={16} className="text-muted-foreground" />
                      ) : (
                        <Eye size={16} className="text-muted-foreground" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    New Password
                  </Text>
                  <View className="relative">
                    <Input
                      secureTextEntry={!showPasswords.new}
                      value={passwordForm.newPassword}
                      onChangeText={(text) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          newPassword: text,
                        }))
                      }
                      placeholder="Enter new password"
                    />
                    <TouchableOpacity
                      className="absolute right-3 top-3"
                      onPress={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          new: !prev.new,
                        }))
                      }
                    >
                      {showPasswords.new ? (
                        <EyeOff size={16} className="text-muted-foreground" />
                      ) : (
                        <Eye size={16} className="text-muted-foreground" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Confirm New Password
                  </Text>
                  <View className="relative">
                    <Input
                      secureTextEntry={!showPasswords.confirm}
                      value={passwordForm.confirmPassword}
                      onChangeText={(text) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          confirmPassword: text,
                        }))
                      }
                      placeholder="Confirm new password"
                    />
                    <TouchableOpacity
                      className="absolute right-3 top-3"
                      onPress={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                    >
                      {showPasswords.confirm ? (
                        <EyeOff size={16} className="text-muted-foreground" />
                      ) : (
                        <Eye size={16} className="text-muted-foreground" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View className="flex-row gap-2 mt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onPress={() => setShowPasswordDialog(false)}
                >
                  <Text className="text-foreground">Cancel</Text>
                </Button>
                <Button className="flex-1" onPress={handleChangePassword}>
                  <Text className="text-primary-foreground font-semibold">
                    Update Password
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        {/* Delete Account Modal */}
        <Modal
          visible={showDeleteDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDeleteDialog(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <View className="bg-background w-full max-w-sm rounded-xl p-6 gap-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-destructive">
                  Delete Account
                </Text>
                <TouchableOpacity onPress={() => setShowDeleteDialog(false)}>
                  <X size={24} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>

              <View className="gap-2">
                <Text className="text-muted-foreground">
                  Are you sure you want to delete your account? This will:
                </Text>
                <View className="gap-1 pl-2">
                  <Text className="text-sm text-muted-foreground">
                    • Remove all your personal data
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    • Cancel any active bookings
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    • Delete saved payment methods
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    • This action cannot be undone
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-2 mt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onPress={() => setShowDeleteDialog(false)}
                >
                  <Text className="text-foreground">Cancel</Text>
                </Button>
                <Button
                  className="flex-1 bg-destructive"
                  onPress={handleDeleteAccount}
                >
                  <Text className="text-destructive-foreground font-semibold">
                    Delete Account
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
