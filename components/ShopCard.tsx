import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import {
  Star,
  Clock,
  MapPin,
  ChevronRight,
  Car,
  Bike,
} from "lucide-react-native";
import { RentalShop } from "@/types";
import { cn } from "@/lib/utils";

interface ShopCardProps {
  shop: RentalShop;
  onClick: () => void;
}

export const ShopCard = ({ shop, onClick }: ShopCardProps) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      className="overflow-hidden rounded-2xl bg-card shadow-sm mb-4 border border-border"
    >
      <View className="relative h-40">
        <Image
          source={{ uri: shop.image }}
          className="h-full w-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/30" />
        <View className="absolute bottom-3 left-3 right-3 flex-row items-end justify-between">
          <View>
            <Text className="text-lg font-bold text-white">{shop.name}</Text>
            <View className="flex-row items-center gap-1">
              <MapPin color="white" size={14} />
              <Text className="text-sm text-white/90">
                {shop.distance} km away
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1 rounded-lg bg-black/50 px-2 py-1">
            <Star color="#eab308" fill="#eab308" size={14} />
            <Text className="text-sm font-semibold text-white">
              {shop.rating}
            </Text>
          </View>
        </View>
      </View>

      <View className="p-4">
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-1.5">
            <Clock color="#6b7280" size={16} />
            <Text className="text-sm text-muted-foreground">
              {shop.operatingHours}
            </Text>
          </View>
          <View
            className={cn(
              "rounded-full px-2 py-0.5",
              shop.isOpen ? "bg-green-100" : "bg-red-100",
            )}
          >
            <Text
              className={cn(
                "text-xs font-medium",
                shop.isOpen ? "text-green-700" : "text-red-700",
              )}
            >
              {shop.isOpen ? "Open" : "Closed"}
            </Text>
          </View>
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          <View className="flex-row gap-3">
            <View className="flex-row items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5">
              <Car color="#000" size={16} />
              <Text className="text-sm font-medium text-foreground">
                {shop.vehicleCount.cars}
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5">
              <Bike color="#000" size={16} />
              <Text className="text-sm font-medium text-foreground">
                {shop.vehicleCount.bikes}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-sm font-semibold text-primary">
              View Vehicles
            </Text>
            <ChevronRight color="#000" size={16} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
