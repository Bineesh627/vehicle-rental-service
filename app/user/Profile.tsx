import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import {
  Bell,
  ChevronRight,
  CreditCard,
  HelpCircle,
  LogOut,
  MapPin,
  Settings,
  Shield,
  User,
  UserCheck,
} from "lucide-react-native";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const ProfileMenuItem = ({
  icon: Icon,
  label,
  href,
  color = "text-foreground",
  bgColor = "bg-secondary",
}: {
  icon: any;
  label: string;
  href?: string;
  color?: string;
  bgColor?: string;
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (href) {
      router.push(href as any);
    }
  };

  return (
    <TouchableOpacity
      className="flex-row items-center justify-between p-4 bg-card border-b border-border active:bg-secondary"
      onPress={handlePress}
    >
      <View className="flex-row items-center gap-4">
        <View className={`p-2 rounded-full ${bgColor}`}>
          <Icon size={20} className={color} />
        </View>
        <Text className="text-base font-medium text-foreground">{label}</Text>
      </View>
      <ChevronRight size={20} className="text-muted-foreground" />
    </TouchableOpacity>
  );
};

export default function Profile() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            router.replace("/Login");
            Toast.show({
              type: "success",
              text1: "Logged Out",
              text2: "See you soon!",
            });
          } catch (error) {
            Toast.show({
              type: "error",
              text1: "Logout Failed",
              text2: "Please try again.",
            });
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background pt-8">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile Header */}
        <View className="items-center py-8 bg-card border-b border-border mb-6">
          <View className="relative mb-4">
            <View className="h-24 w-24 rounded-full bg-secondary items-center justify-center overflow-hidden border-2 border-primary">
              <User size={40} className="text-muted-foreground" />
            </View>
            <TouchableOpacity
              className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-2 border-background"
              onPress={() => router.push("/user/EditProfile")}
            >
              <Settings size={14} className="text-primary-foreground" />
            </TouchableOpacity>
          </View>
          <Text className="text-xl font-bold text-foreground">John Doe</Text>
          <Text className="text-sm text-muted-foreground mt-1">
            john.doe@example.com
          </Text>
          <View className="flex-row gap-2 mt-3">
            <View className="px-3 py-1 bg-green-500/10 rounded-full flex-row items-center gap-1">
              <UserCheck size={12} className="text-green-500" />
              <Text className="text-xs font-medium text-green-500">
                Verified
              </Text>
            </View>
            <View className="px-3 py-1 bg-primary/10 rounded-full">
              <Text className="text-xs font-medium text-primary">Member</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-4 gap-6">
          <View className="rounded-xl overflow-hidden border border-border bg-card">
            <ProfileMenuItem
              icon={User}
              label="Edit Profile"
              href="/user/EditProfile"
              color="text-primary"
              bgColor="bg-primary/10"
            />
            <ProfileMenuItem
              icon={UserCheck}
              label="KYC Verification"
              href="/user/KYCVerification"
              color="text-orange-500"
              bgColor="bg-orange-500/10"
            />
          </View>

          <View className="rounded-xl overflow-hidden border border-border bg-card">
            <ProfileMenuItem
              icon={Bell}
              label="Notifications"
              href="/user/Notifications"
              color="text-blue-500"
              bgColor="bg-blue-500/10"
            />
            <ProfileMenuItem
              icon={CreditCard}
              label="Payment Methods"
              href="/user/PaymentMethods"
              color="text-green-500"
              bgColor="bg-green-500/10"
            />
            <ProfileMenuItem
              icon={MapPin}
              label="Saved Locations"
              href="/user/SavedLocations"
              color="text-purple-500"
              bgColor="bg-purple-500/10"
            />
          </View>

          <View className="rounded-xl overflow-hidden border border-border bg-card">
            <ProfileMenuItem
              icon={Shield}
              label="Privacy & Security"
              href="/user/PrivacySecurity"
              color="text-red-500"
              bgColor="bg-red-500/10"
            />
            <ProfileMenuItem
              icon={Settings}
              label="App Settings"
              href="/user/Settings"
              color="text-gray-500"
              bgColor="bg-gray-500/10"
            />
            <ProfileMenuItem
              icon={HelpCircle}
              label="Help & Support"
              href="/user/HelpSupport"
              color="text-teal-500"
              bgColor="bg-teal-500/10"
            />
          </View>

          <TouchableOpacity
            className="flex-row items-center justify-center p-4 bg-destructive/10 rounded-xl border border-destructive/20 active:bg-destructive/20"
            onPress={handleLogout}
          >
            <LogOut size={20} className="text-destructive mr-2" />
            <Text className="text-base font-semibold text-destructive">
              Log Out
            </Text>
          </TouchableOpacity>

          <Text className="text-center text-xs text-muted-foreground mt-2 pb-8">
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
