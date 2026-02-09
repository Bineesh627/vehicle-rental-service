import { Button } from "@/components/ui/button";
import { rentalShops, vehicles } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { UserStackParamList } from "@/navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  Bike,
  Calendar,
  Car,
  Check,
  Clock,
  Fuel,
  Heart,
  Settings2,
  Share2,
  Users,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type VehicleDetailsRouteProp = RouteProp<UserStackParamList, "VehicleDetails">;
type VehicleDetailsNavigationProp = NativeStackNavigationProp<
  UserStackParamList,
  "VehicleDetails"
>;

export default function VehicleDetails() {
  const route = useRoute<VehicleDetailsRouteProp>();
  const navigation = useNavigation<VehicleDetailsNavigationProp>();
  const { id } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [pricingType, setPricingType] = useState<"hour" | "day">("hour");

  const vehicle = vehicles.find((v) => v.id === id);
  const shop = vehicle
    ? rentalShops.find((s) => s.id === vehicle.shopId)
    : null;

  if (!vehicle || !shop) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted-foreground">Vehicle not found</Text>
      </View>
    );
  }

  const { width } = Dimensions.get("window");

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image Gallery */}
        <View className="relative h-72">
          <Image
            source={{ uri: vehicle.images[activeImageIndex] }}
            className="h-full w-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/30" />

          {/* Header actions */}
          <SafeAreaView className="absolute left-0 right-0 top-0">
            <View className="flex-row items-center justify-between p-4">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="rounded-xl bg-white/20 p-3 backdrop-blur-sm"
              >
                <ArrowLeft color="white" size={20} />
              </TouchableOpacity>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setIsFavorite(!isFavorite)}
                  className="rounded-xl bg-white/20 p-3 backdrop-blur-sm"
                >
                  <Heart
                    color={isFavorite ? "#ef4444" : "white"}
                    fill={isFavorite ? "#ef4444" : "transparent"}
                    size={20}
                  />
                </TouchableOpacity>
                <TouchableOpacity className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                  <Share2 color="white" size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>

          {/* Image indicators */}
          {vehicle.images.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
              {vehicle.images.map((_, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setActiveImageIndex(index)}
                  className={cn(
                    "h-2 rounded-full",
                    index === activeImageIndex
                      ? "w-6 bg-primary"
                      : "w-2 bg-white/60",
                  )}
                />
              ))}
            </View>
          )}

          {/* Type badge */}
          <View className="absolute left-4 top-20">
            <View className="flex-row items-center gap-1.5 rounded-lg bg-black/50 px-3 py-2">
              {vehicle.type === "car" ? (
                <Car color="white" size={16} />
              ) : (
                <Bike color="white" size={16} />
              )}
              <Text className="text-sm font-medium text-white capitalize">
                {vehicle.type}
              </Text>
            </View>
          </View>
        </View>

        {/* Vehicle Info */}
        <View className="px-4 -mt-6 relative z-10">
          <View className="rounded-2xl bg-card p-5 shadow-sm border border-border">
            <View>
              <View
                className={cn(
                  "mb-2 self-start rounded-full px-3 py-1",
                  vehicle.isAvailable ? "bg-green-100" : "bg-red-100",
                )}
              >
                <Text
                  className={cn(
                    "text-xs font-semibold",
                    vehicle.isAvailable ? "text-green-700" : "text-red-700",
                  )}
                >
                  {vehicle.isAvailable ? "Available" : "Currently Booked"}
                </Text>
              </View>
              <Text className="text-2xl font-bold text-foreground">
                {vehicle.name}
              </Text>
              <Text className="text-muted-foreground">{vehicle.model}</Text>
              {vehicle.vehicleNumber && (
                <Text className="text-sm font-medium text-primary mt-1">
                  {vehicle.vehicleNumber}
                </Text>
              )}
            </View>

            {/* Specs */}
            <View className="mt-6 flex-row gap-4">
              <View className="flex-1 rounded-xl bg-secondary p-4 items-center">
                <Fuel color="#000" size={20} style={{ marginBottom: 4 }} />
                <Text className="text-sm font-medium text-foreground">
                  {vehicle.fuelType}
                </Text>
                <Text className="text-xs text-muted-foreground">Fuel</Text>
              </View>
              <View className="flex-1 rounded-xl bg-secondary p-4 items-center">
                <Settings2 color="#000" size={20} style={{ marginBottom: 4 }} />
                <Text className="text-sm font-medium text-foreground">
                  {vehicle.transmission}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  Transmission
                </Text>
              </View>
              {vehicle.seating && (
                <View className="flex-1 rounded-xl bg-secondary p-4 items-center">
                  <Users color="#000" size={20} style={{ marginBottom: 4 }} />
                  <Text className="text-sm font-medium text-foreground">
                    {vehicle.seating} Seats
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    Capacity
                  </Text>
                </View>
              )}
            </View>

            {/* Features */}
            <View className="mt-6">
              <Text className="mb-3 font-semibold text-foreground">
                Features
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {vehicle.features.map((feature) => (
                  <View
                    key={feature}
                    className="flex-row items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2"
                  >
                    <Check color="#000" size={14} />
                    <Text className="text-sm font-medium text-primary">
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Shop info */}
            <View className="mt-6 rounded-xl border border-border p-4">
              <Text className="text-xs text-muted-foreground">
                Available at
              </Text>
              <Text className="font-semibold text-foreground">{shop.name}</Text>
              <Text className="text-sm text-muted-foreground">
                {shop.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Pricing */}
        <View className="px-4 py-6">
          <View className="rounded-2xl bg-card p-5 shadow-sm border border-border">
            <Text className="mb-4 font-semibold text-foreground">Pricing</Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => setPricingType("hour")}
                className={cn(
                  "flex-1 rounded-xl p-4 items-center border",
                  pricingType === "hour"
                    ? "border-primary bg-primary/5"
                    : "border-border",
                )}
              >
                <Clock
                  color={pricingType === "hour" ? "#000" : "#6b7280"}
                  size={20}
                  style={{ marginBottom: 4 }}
                />
                <Text
                  className={cn(
                    "text-2xl font-bold",
                    pricingType === "hour" ? "text-primary" : "text-foreground",
                  )}
                >
                  ${vehicle.pricePerHour}
                </Text>
                <Text className="text-sm text-muted-foreground">per hour</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setPricingType("day")}
                className={cn(
                  "flex-1 rounded-xl p-4 items-center border",
                  pricingType === "day"
                    ? "border-primary bg-primary/5"
                    : "border-border",
                )}
              >
                <Calendar
                  color={pricingType === "day" ? "#000" : "#6b7280"}
                  size={20}
                  style={{ marginBottom: 4 }}
                />
                <Text
                  className={cn(
                    "text-2xl font-bold",
                    pricingType === "day" ? "text-primary" : "text-foreground",
                  )}
                >
                  ${vehicle.pricePerDay}
                </Text>
                <Text className="text-sm text-muted-foreground">per day</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom action */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-border bg-card p-4 pb-8">
        <View className="flex-row items-center gap-4">
          <View>
            <Text className="text-sm text-muted-foreground">
              {pricingType === "hour" ? "Per hour" : "Per day"}
            </Text>
            <Text className="text-2xl font-bold text-primary">
              $
              {pricingType === "hour"
                ? vehicle.pricePerHour
                : vehicle.pricePerDay}
              <Text className="text-sm font-normal text-muted-foreground">
                {pricingType === "hour" ? "/hr" : "/day"}
              </Text>
            </Text>
          </View>
          <Button
            className="flex-1 h-14"
            disabled={!vehicle.isAvailable}
            onPress={() => navigation.navigate("Booking", { id: vehicle.id })}
          >
            <Text className="text-primary-foreground font-bold text-lg">
              {vehicle.isAvailable ? "Book Now" : "Not Available"}
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
