import { cn } from "@/lib/utils";
import { Vehicle } from "@/types";
import { Bike, Car, Fuel, Settings2, Users } from "lucide-react-native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick: () => void;
}

export const VehicleCard = ({ vehicle, onClick }: VehicleCardProps) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      className="overflow-hidden rounded-3xl bg-[#16202C] mb-4"
    >
      <View className="relative h-48">
        <Image
          source={{ uri: vehicle.images[0] }}
          className="h-full w-full"
          resizeMode="cover"
        />

        {/* Type Badge - Top Left */}
        <View className="absolute left-4 top-4">
          <View className="flex-row items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm">
            {vehicle.type === "car" ? (
              <Car color="white" size={14} />
            ) : (
              <Bike color="white" size={14} />
            )}
            <Text className="text-xs font-medium text-white capitalize">
              {vehicle.type}
            </Text>
          </View>
        </View>

        {/* Status Badge - Top Right */}
        <View className="absolute right-4 top-4">
          <View
            className={cn(
              "rounded-full px-3 py-1.5",
              vehicle.isAvailable ? "bg-[#22C55E]" : "bg-red-500",
            )}
          >
            <Text className="text-xs font-bold text-white">
              {vehicle.isAvailable ? "Available" : "Booked"}
            </Text>
          </View>
        </View>
      </View>

      <View className="p-5">
        <View className="flex-row items-start justify-between mb-4">
          <View>
            <Text className="text-xl font-bold text-white mb-1">
              {vehicle.name}
            </Text>
            <Text className="text-sm text-slate-400">{vehicle.brand}</Text>
          </View>
          <View className="items-end">
            <Text className="text-xl font-bold text-[#22D3EE]">
              ${vehicle.pricePerHour}
            </Text>
            <Text className="text-xs text-slate-400">/hour</Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          {vehicle.fuelType && (
            <View className="flex-row items-center gap-2 rounded-full bg-[#0F1C23] px-3 py-2 border border-slate-700/50">
              <Fuel color="#94A3B8" size={14} />
              <Text className="text-xs font-medium text-slate-300">
                {vehicle.fuelType}
              </Text>
            </View>
          )}
          {vehicle.transmission && (
            <View className="flex-row items-center gap-2 rounded-full bg-[#0F1C23] px-3 py-2 border border-slate-700/50">
              <Settings2 color="#94A3B8" size={14} />
              <Text className="text-xs font-medium text-slate-300">
                {vehicle.transmission}
              </Text>
            </View>
          )}
          {vehicle.seating && (
            <View className="flex-row items-center gap-2 rounded-full bg-[#0F1C23] px-3 py-2 border border-slate-700/50">
              <Users color="#94A3B8" size={14} />
              <Text className="text-xs font-medium text-slate-300">
                {vehicle.seating}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
