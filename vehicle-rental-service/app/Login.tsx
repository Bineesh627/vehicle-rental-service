import { router } from "expo-router";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeftRight,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export const Login = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

      // Navigate based on role
      if (result.role === "staff") {
        router.replace("/staff");
      } else {
        // Default to user tabs
        router.replace("/(tabs)");
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: result.error || "Login failed",
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
          <TouchableOpacity onPress={() => router.push("/Signup")}>
            <Text className="font-bold text-[#22D3EE]">Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
