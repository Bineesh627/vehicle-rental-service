import { Input } from "@/components/ui/input";
import { AuthStackParamList } from "@/navigation/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Store,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type ShopOwnerSignupNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "ShopOwnerSignup"
>;

export default function ShopOwnerSignup() {
  const navigation = useNavigation<ShopOwnerSignupNavigationProp>();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignup = () => {
    if (!formData.name || !formData.email || !formData.password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all required fields",
      });
      return;
    }
    if (formData.password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Password must be at least 6 characters",
      });
      return;
    }
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Account created! You can now add your shop details after login.",
    });
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0F1C23]">
      <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-12">
        <View className="mb-8 items-center">
          <View className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <Store color="white" size={32} />
          </View>
          <Text className="text-3xl font-bold text-white mb-2">
            Become a Partner
          </Text>
          <Text className="text-slate-400 text-base text-center">
            Create your owner account
          </Text>
        </View>

        {/* Form */}
        <View className="gap-4">
          <View>
            <View className="absolute left-4 top-[18px] z-10">
              <User color="#94A3B8" size={20} />
            </View>
            <Input
              placeholder="Owner name *"
              placeholderTextColor="#64748B"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              className="pl-12 bg-[#16202C] border-slate-700/50 text-white h-14 rounded-2xl focus:border-[#22D3EE]"
            />
          </View>

          <View>
            <View className="absolute left-4 top-[18px] z-10">
              <Mail color="#94A3B8" size={20} />
            </View>
            <Input
              placeholder="Email address *"
              placeholderTextColor="#64748B"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
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
              placeholder="Create password *"
              placeholderTextColor="#64748B"
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
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
            onPress={handleSignup}
            className="w-full mt-4 bg-[#22D3EE] h-14 rounded-full items-center justify-center flex-row gap-2 active:opacity-90 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            <Text className="text-[#0F1C23] text-lg font-bold">
              Submit Application
            </Text>
            <ArrowRight color="#0F1C23" size={20} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View className="mt-8 p-6 rounded-3xl bg-[#1E1B2E] border border-slate-700/30">
          <Text className="text-white font-bold mb-3 text-base">
            What happens next?
          </Text>
          <View className="gap-2">
            <Text className="text-sm text-slate-400">
              • Login to your owner dashboard
            </Text>
            <Text className="text-sm text-slate-400">
              • Add your shop name and address
            </Text>
            <Text className="text-sm text-slate-400">
              • Add vehicles and start earning
            </Text>
          </View>
        </View>

        {/* Login link */}
        <View className="mt-8 flex-row justify-center items-center">
          <Text className="text-slate-400">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="font-bold text-[#22D3EE]">Sign in</Text>
          </TouchableOpacity>
        </View>

        {/* Customer signup link */}
        <View className="mt-4 flex-row justify-center items-center">
          <Text className="text-slate-400">Want to rent a vehicle? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text className="font-bold text-[#22D3EE]">
              Sign up as customer
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
