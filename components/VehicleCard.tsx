import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Car, Bike, Fuel, Users, Settings2 } from "lucide-react-native";
import { Vehicle } from "@/types";
import { cn } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick: () => void;
}

export const VehicleCard = ({ vehicle, onClick }: VehicleCardProps) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      className="overflow-hidden rounded-2xl bg-card shadow-sm mb-4 border border-border"
    >
      <View className="relative h-44">
        <Image
          source={{ uri: vehicle.images[0] }}
          className="h-full w-full"
          resizeMode="cover"
        />
        <View className="absolute left-3 top-3">
          <View className="flex-row items-center gap-1.5 rounded-lg bg-black/50 px-2.5 py-1.5">
            {vehicle.type === "car" ? (
              <Car color="white" size={16} />
            ) : (
              <Bike color="white" size={16} />
            )}
            <Text className="text-xs font-medium text-white capitalize">
              {vehicle.type}
            </Text>
          </View>
        </View>
        <View className="absolute right-3 top-3">
          <View
            className={cn(
              "rounded-lg px-2.5 py-1.5",
              vehicle.isAvailable ? "bg-green-100" : "bg-red-100",
            )}
          >
            <Text
              className={cn(
                "text-xs font-semibold",
                vehicle.isAvailable ? "text-green-700" : "text-red-700",
              )}
            >
              {vehicle.isAvailable ? "Available" : "Booked"}
            </Text>
          </View>
        </View>
      </View>

      <View className="p-4">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-lg font-bold text-foreground">
              {vehicle.name}
            </Text>
            <Text className="text-sm text-muted-foreground">
              {vehicle.brand}
            </Text>
            {vehicle.vehicleNumber && (
              <Text className="text-xs font-medium text-primary mt-1">
                {vehicle.vehicleNumber}
              </Text>
            )}
          </View>
          <View className="items-end">
            <Text className="text-lg font-bold text-primary">
              ${vehicle.pricePerHour}
            </Text>
            <Text className="text-xs text-muted-foreground">/hour</Text>
          </View>
        </View>

        <View className="mt-4 flex-row gap-3">
          {vehicle.fuelType && (
            <View className="flex-row items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5">
              <Fuel color="#6b7280" size={14} />
              <Text className="text-xs font-medium text-muted-foreground">
                {vehicle.fuelType}
              </Text>
            </View>
          )}
          {vehicle.transmission && (
            <View className="flex-row items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5">
              <Settings2 color="#6b7280" size={14} />
              <Text className="text-xs font-medium text-muted-foreground">
                {vehicle.transmission}
              </Text>
            </View>
          )}
          {vehicle.seating && (
            <View className="flex-row items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5">
              <Users color="#6b7280" size={14} />
              <Text className="text-xs font-medium text-muted-foreground">
                {vehicle.seating}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
