import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { AuthStackParamList } from "@/navigation/types";
import { UserRole } from "@/types/auth";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowLeftRight,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Store,
  User,
  Wrench,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const roleInfo: Record<
  UserRole,
  { icon: React.ElementType; label: string; color: string; iconColor: string }
> = {
  user: {
    icon: User,
    label: "Customer",
    color: "bg-blue-500/20 border-blue-500/50",
    iconColor: "#3b82f6",
  },
  owner: {
    icon: Store,
    label: "Shop Owner",
    color: "bg-purple-500/20 border-purple-500/50",
    iconColor: "#a855f7",
  },
  staff: {
    icon: Wrench,
    label: "Staff",
    color: "bg-green-500/20 border-green-500/50",
    iconColor: "#22c55e",
  },
  admin: {
    icon: Shield,
    label: "Admin",
    color: "bg-red-500/20 border-red-500/50",
    iconColor: "#ef4444",
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
    <SafeAreaView className="flex-1 bg-[#0F1C23]">
      <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-8">
        <View className="mb-8 items-center">
          <View className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#22D3EE] shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            <ArrowLeftRight color="#0F1C23" size={32} strokeWidth={2.5} />
          </View>
          <Text className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </Text>
          <Text className="text-slate-400 text-base">
            Sign in to your account
          </Text>
        </View>

        {/* Quick Role Selection */}
        <View className="mb-8">
          <Text className="text-sm font-medium text-slate-500 mb-4 text-center">
            Quick Login (Demo)
          </Text>
          <View className="flex-row flex-wrap justify-between gap-3">
            {(Object.keys(roleInfo) as UserRole[]).map((role) => {
              const info = roleInfo[role];
              const Icon = info.icon;
              return (
                <TouchableOpacity
                  key={role}
                  onPress={() => handleQuickLogin(role)}
                  className={`flex-row items-center gap-3 rounded-2xl p-4 border border-slate-700/50 bg-[#16202C] w-[48%] active:opacity-80`}
                >
                  <View
                    className={`h-8 w-8 items-center justify-center rounded-full bg-${
                      role === "user"
                        ? "blue"
                        : role === "owner"
                          ? "purple"
                          : role === "staff"
                            ? "green"
                            : "red"
                    }-500/20`}
                  >
                    <Icon color={info.iconColor} size={16} />
                  </View>
                  <Text className="text-sm font-medium text-white">
                    {info.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="flex-row items-center gap-4 mb-8">
          <View className="h-[1px] flex-1 bg-slate-800" />
          <Text className="text-sm text-slate-500">or login manually</Text>
          <View className="h-[1px] flex-1 bg-slate-800" />
        </View>

        {/* Form */}
        <View className="gap-4">
          <View>
            <View className="absolute left-4 top-[18px] z-10">
              <Mail color="#94A3B8" size={20} />
            </View>
            <Input
              placeholder="Email address"
              placeholderTextColor="#64748B"
              value={email}
              onChangeText={setEmail}
              className="pl-12 bg-[#16202C] border-slate-700/50 text-white h-14 rounded-2xl focus:border-[#22D3EE]"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View>
            <View className="absolute left-4 top-[18px] z-10">
              <Lock color="#94A3B8" size={20} />
            </View>
            <Input
              secureTextEntry={!showPassword}
              placeholder="Password"
              placeholderTextColor="#64748B"
              value={password}
              onChangeText={setPassword}
              className="pl-12 pr-12 bg-[#16202C] border-slate-700/50 text-white h-14 rounded-2xl focus:border-[#22D3EE]"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[18px] z-10"
            >
              {showPassword ? (
                <EyeOff color="#94A3B8" size={20} />
              ) : (
                <Eye color="#94A3B8" size={20} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            className="w-full mt-4 bg-[#22D3EE] h-14 rounded-full items-center justify-center flex-row gap-2 active:opacity-90 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            <Text className="text-[#0F1C23] text-lg font-bold">Sign In</Text>
            <ArrowRight color="#0F1C23" size={20} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Sign up link */}
        <View className="mt-8 flex-row justify-center items-center">
          <Text className="text-slate-400">Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text className="font-bold text-[#22D3EE]">Sign up</Text>
          </TouchableOpacity>
        </View>

        {/* Shop owner signup link */}
        <View className="mt-4 flex-row justify-center items-center">
          <Text className="text-slate-400">Own a rental shop? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ShopOwnerSignup")}
          >
            <Text className="font-bold text-[#A855F7]">
              Register as partner
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
