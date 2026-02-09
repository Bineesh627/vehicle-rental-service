import { Button } from "@/components/ui/button";
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
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-12">
        <View className="mb-8 items-center">
          <View className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500 shadow-sm">
            <Store color="white" size={32} />
          </View>
          <Text className="text-3xl font-bold text-foreground">
            Become a Partner
          </Text>
          <Text className="mt-2 text-muted-foreground text-center">
            Create your owner account
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          <View>
            <View className="absolute left-4 top-[18px] z-10">
              <User color="#6b7280" size={20} />
            </View>
            <Input
              placeholder="Owner name *"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              className="pl-12"
            />
          </View>

          <View>
            <View className="absolute left-4 top-[18px] z-10">
              <Mail color="#6b7280" size={20} />
            </View>
            <Input
              placeholder="Email address *"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
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
              placeholder="Create password *"
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
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

          <Button onPress={handleSignup} className="w-full mt-4" size="lg">
            <Text className="text-primary-foreground font-semibold mr-2">
              Submit Application
            </Text>
            <ArrowRight color="white" size={20} />
          </Button>
        </View>

        {/* Info */}
        <View className="mt-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <Text className="text-sm text-foreground font-bold mb-2">
            What happens next?
          </Text>
          <View>
            <Text className="text-xs text-muted-foreground">
              • Login to your owner dashboard
            </Text>
            <Text className="text-xs text-muted-foreground">
              • Add your shop name and address
            </Text>
            <Text className="text-xs text-muted-foreground">
              • Add vehicles and start earning
            </Text>
          </View>
        </View>

        {/* Login link */}
        <View className="mt-6 flex-row justify-center">
          <Text className="text-sm text-muted-foreground">
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-sm font-semibold text-primary">Sign in</Text>
          </TouchableOpacity>
        </View>

        {/* Customer signup link */}
        <View className="mt-2 flex-row justify-center">
          <Text className="text-sm text-muted-foreground">
            Want to rent a vehicle?{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text className="text-sm font-semibold text-primary">
              Sign up as customer
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
