import { useNavigation } from "@react-navigation/native";
import { Home } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function NotFound() {
  const navigation = useNavigation<any>();

  return (
    <View className="flex-1 items-center justify-center bg-background p-4">
      <Text className="text-4xl font-bold text-primary mb-4">404</Text>
      <Text className="text-xl font-semibold text-foreground mb-2">
        Page Not Found
      </Text>
      <Text className="text-center text-muted-foreground mb-8">
        The screen you are looking for does not exist or has been moved.
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        className="flex-row items-center bg-primary px-6 py-3 rounded-xl"
      >
        <Home color="white" size={20} style={{ marginRight: 8 }} />
        <Text className="text-primary-foreground font-semibold">Go Home</Text>
      </TouchableOpacity>
    </View>
  );
}
