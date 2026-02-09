import React from "react";
import { View, TouchableOpacity } from "react-native";
import { MapPin, Navigation } from "lucide-react-native";
import { Input } from "@/components/ui/input";

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  onCurrentLocation?: () => void;
}

export const LocationSearch = ({
  value,
  onChange,
  onCurrentLocation,
}: LocationSearchProps) => {
  return (
    <View className="relative w-full">
      <View className="absolute left-4 top-[18px] z-10">
        <MapPin color="#6b7280" size={20} />
      </View>
      <Input
        placeholder="Search location..."
        value={value}
        onChangeText={onChange}
        className="pl-12 pr-12 h-14"
      />
      <TouchableOpacity
        onPress={onCurrentLocation}
        className="absolute right-3 top-2.5 rounded-xl bg-primary/10 p-2.5"
      >
        <Navigation color="#000" size={20} />
      </TouchableOpacity>
    </View>
  );
};
