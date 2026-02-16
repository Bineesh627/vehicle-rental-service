import { LocationSearch } from "@/components/LocationSearch";
import { Search } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Explore() {
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState("");

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-4 border-b border-border bg-card">
        <Text className="text-xl font-bold text-foreground mb-4">Explore</Text>
        <LocationSearch
          value={location}
          onChange={setLocation}
          onCurrentLocation={() => {}}
        />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="items-center justify-center p-8">
          <Search size={48} color="#9ca3af" />
          <Text className="text-muted-foreground mt-4 text-center">
            Search for vehicles near you
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
