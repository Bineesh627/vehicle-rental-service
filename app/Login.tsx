import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { AuthStackParamList } from "@/navigation/types";
import { UserRole } from "@/types/auth";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Store,
  Users,
  Wrench,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const roleInfo: Record<
  UserRole,
  { icon: React.ElementType; label: string; color: string; credentials: string }
> = {
  user: {
    icon: Users,
    label: "Customer",
    color: "bg-blue-500",
    credentials: "user@rental.com / user123",
  },
  owner: {
    icon: Store,
    label: "Shop Owner",
    color: "bg-purple-500",
    credentials: "owner@rental.com / owner123",
  },
  staff: {
    icon: Wrench,
    label: "Staff",
    color: "bg-green-500",
    credentials: "staff@rental.com / staff123",
  },
  admin: {
    icon: Shield,
    label: "Admin",
    color: "bg-red-500",
    credentials: "admin@rental.com / admin123",
  },
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
      });
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Login successful!",
      });
      // Navigation is handled by RootNavigator based on auth state,
      // but if we needed to navigate explicitly we could.
    } else {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: result.error || "Login failed",
      });
    }
  };

  const handleQuickLogin = async (role: UserRole) => {
    setSelectedRole(role);
    const credentials: Record<UserRole, { email: string; password: string }> = {
      user: { email: "user@rental.com", password: "user123" },
      owner: { email: "owner@rental.com", password: "owner123" },
      staff: { email: "staff@rental.com", password: "staff123" },
      admin: { email: "admin@rental.com", password: "admin123" },
    };

    const cred = credentials[role];
    const result = await login(cred.email, cred.password);

    if (result.success) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `Logged in as ${roleInfo[role].label}`,
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-8">
        <View className="mb-6 items-center">
          <View className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-sm">
            {/* Simple placeholder icon or SVG */}
            <Shield color="white" size={32} />
          </View>
          <Text className="text-3xl font-bold text-foreground">
            Welcome Back
          </Text>
          <Text className="mt-2 text-muted-foreground text-center">
            Sign in to your account
          </Text>
        </View>

        {/* Quick Role Selection */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-muted-foreground mb-3 text-center">
            Quick Login (Demo)
          </Text>
          <View className="flex-row flex-wrap justify-between gap-2">
            {(Object.keys(roleInfo) as UserRole[]).map((role) => {
              const info = roleInfo[role];
              const Icon = info.icon;
              const isSelected = selectedRole === role;
              return (
                <TouchableOpacity
                  key={role}
                  onPress={() => handleQuickLogin(role)}
                  className={`flex-row items-center gap-2 rounded-xl p-3 border-2 flex-grow basis-[45%] ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  <View className={`rounded-lg p-2 ${info.color}`}>
                    <Icon color="white" size={16} />
                  </View>
                  <Text className="text-sm font-medium text-foreground">
                    {info.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="flex-row items-center gap-4 mb-6">
          <View className="h-[1px] flex-1 bg-border" />
          <Text className="text-sm text-muted-foreground">
            or login manually
          </Text>
          <View className="h-[1px] flex-1 bg-border" />
        </View>

        {/* Form */}
        <View className="space-y-4">
          <View>
            <View className="absolute left-4 top-[18px] z-10">
              <Mail color="#6b7280" size={20} />
            </View>
            <Input
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              className="pl-12"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View>
            <View className="absolute left-4 top-[18px] z-10">
              <Lock color="#6b7280" size={20} />
            </View>
            <Input
              secureTextEntry={!showPassword}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              className="pl-12 pr-12"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[18px] z-10"
            >
              {showPassword ? (
                <EyeOff color="#6b7280" size={20} />
              ) : (
                <Eye color="#6b7280" size={20} />
              )}
            </TouchableOpacity>
          </View>

          <Button onPress={handleLogin} className="w-full mt-4" size="lg">
            <Text className="text-primary-foreground font-semibold mr-2">
              Sign In
            </Text>
            <ArrowRight color="white" size={20} />
          </Button>
        </View>

        {/* Sign up link */}
        <View className="mt-8 flex-row justify-center">
          <Text className="text-sm text-muted-foreground">
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text className="text-sm font-semibold text-primary">Sign up</Text>
          </TouchableOpacity>
        </View>

        {/* Shop owner signup link */}
        <View className="mt-2 flex-row justify-center">
          <Text className="text-sm text-muted-foreground">
            Own a rental shop?{" "}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ShopOwnerSignup")}
          >
            <Text className="text-sm font-semibold text-purple-500">
              Register as partner
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
