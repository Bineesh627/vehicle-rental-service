import { rentalShops, vehicles } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { UserStackParamList } from "@/navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Fuel,
  Heart,
  MapPin,
  Settings2,
  Share2,
  Star,
  Users,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type VehicleDetailsRouteProp = RouteProp<UserStackParamList, "VehicleDetails">;
type VehicleDetailsNavigationProp = NativeStackNavigationProp<
  UserStackParamList,
  "VehicleDetails"
>;

export default function VehicleDetails() {
  const route = useRoute<VehicleDetailsRouteProp>();
  const navigation = useNavigation<VehicleDetailsNavigationProp>();
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [pricingType, setPricingType] = useState<"hour" | "day">("hour");

  const vehicle = vehicles.find((v) => v.id === id);
  const shop = vehicle
    ? rentalShops.find((s) => s.id === vehicle.shopId)
    : null;

  if (!vehicle || !shop) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0F1C23]">
        <Text className="text-slate-400">Vehicle not found</Text>
      </View>
    );
  }

  const { width } = Dimensions.get("window");

  return (
    <View className="flex-1 bg-[#0F1C23]">
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Image Gallery */}
        <View className="relative h-[400px]">
          <Image
            source={{ uri: vehicle.images[activeImageIndex] }}
            className="h-full w-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0F1C23]" />

          {/* Header actions */}
          <View
            className="absolute left-0 right-0 flex-row items-center justify-between px-4"
            style={{ top: insets.top + 10 }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="rounded-full bg-black/40 p-3 backdrop-blur-md"
            >
              <ArrowLeft color="#fff" size={24} />
            </TouchableOpacity>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setIsFavorite(!isFavorite)}
                className="rounded-full bg-black/40 p-3 backdrop-blur-md"
              >
                <Heart
                  color={isFavorite ? "#ef4444" : "#fff"}
                  fill={isFavorite ? "#ef4444" : "transparent"}
                  size={24}
                />
              </TouchableOpacity>
              <TouchableOpacity className="rounded-full bg-black/40 p-3 backdrop-blur-md">
                <Share2 color="#fff" size={24} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Image indicators */}
          {vehicle.images.length > 1 && (
            <View className="absolute bottom-6 left-0 right-0 flex-row justify-center gap-2">
              {vehicle.images.map((_, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setActiveImageIndex(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    index === activeImageIndex
                      ? "w-8 bg-[#22D3EE]"
                      : "w-1.5 bg-white/40",
                  )}
                />
              ))}
            </View>
          )}
        </View>

        {/* Content */}
        <View className="px-5 -mt-8 relative z-10">
          {/* Availability Badge */}
          <View className="mb-4 self-start">
            <View
              className={cn(
                "rounded-full px-3 py-1 border",
                vehicle.isAvailable
                  ? "bg-green-500/10 border-green-500/20"
                  : "bg-red-500/10 border-red-500/20",
              )}
            >
              <Text
                className={cn(
                  "text-xs font-bold uppercase tracking-wider",
                  vehicle.isAvailable ? "text-green-500" : "text-red-500",
                )}
              >
                {vehicle.isAvailable ? "Available" : "Booked"}
              </Text>
            </View>
          </View>

          {/* Title Section */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-white mb-1">
              {vehicle.name}
            </Text>
            <Text className="text-lg text-slate-400">{vehicle.model} 2023</Text>
          </View>

          {/* Specs Grid */}
          <View className="flex-row gap-3 mb-8">
            <View className="flex-1 rounded-2xl bg-[#1E293B] p-4 items-center border border-slate-800">
              <Fuel color="#22D3EE" size={24} style={{ marginBottom: 8 }} />
              <Text className="text-sm font-bold text-white mb-0.5">
                {vehicle.fuelType}
              </Text>
              <Text className="text-[10px] text-slate-400 uppercase tracking-widest">
                Fuel
              </Text>
            </View>
            <View className="flex-1 rounded-2xl bg-[#1E293B] p-4 items-center border border-slate-800">
              <Settings2
                color="#22D3EE"
                size={24}
                style={{ marginBottom: 8 }}
              />
              <Text className="text-sm font-bold text-white mb-0.5">
                {vehicle.transmission}
              </Text>
              <Text className="text-[10px] text-slate-400 uppercase tracking-widest">
                Transmission
              </Text>
            </View>
            {vehicle.seating && (
              <View className="flex-1 rounded-2xl bg-[#1E293B] p-4 items-center border border-slate-800">
                <Users color="#22D3EE" size={24} style={{ marginBottom: 8 }} />
                <Text className="text-sm font-bold text-white mb-0.5">
                  {vehicle.seating} Seats
                </Text>
                <Text className="text-[10px] text-slate-400 uppercase tracking-widest">
                  Capacity
                </Text>
              </View>
            )}
          </View>

          {/* Features */}
          <View className="mb-8">
            <Text className="text-lg font-bold text-white mb-4">Features</Text>
            <View className="flex-row flex-wrap gap-2">
              {vehicle.features.map((feature) => (
                <View
                  key={feature}
                  className="flex-row items-center gap-2 rounded-full bg-[#1E293B] px-4 py-2.5 border border-slate-800"
                >
                  <Check color="#22D3EE" size={14} />
                  <Text className="text-sm font-medium text-slate-300">
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Shop/Location Info */}
          <View className="mb-8">
            <Text className="text-xs text-slate-400 uppercase tracking-widest mb-3">
              Available at
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ShopDetails", { id: shop.id })
              }
              className="rounded-2xl bg-[#1E293B] p-4 border border-slate-800"
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-bold text-white">
                  {shop.name}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Star color="#F59E0B" fill="#F59E0B" size={14} />
                  <Text className="font-bold text-white">{shop.rating}</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2">
                <MapPin color="#64748B" size={16} />
                <Text className="text-slate-400 flex-1">{shop.address}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Pricing Selector */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-white mb-4">Pricing</Text>
            <View className="flex-row gap-4 p-1 bg-[#1E293B] rounded-2xl border border-slate-800">
              <TouchableOpacity
                onPress={() => setPricingType("hour")}
                className={cn(
                  "flex-1 flex-row items-center justify-center gap-2 py-4 rounded-xl",
                  pricingType === "hour" ? "bg-[#22D3EE]" : "bg-transparent",
                )}
              >
                <Clock
                  color={pricingType === "hour" ? "#0F1C23" : "#94A3B8"}
                  size={18}
                />
                <View>
                  <Text
                    className={cn(
                      "text-xs font-medium",
                      pricingType === "hour"
                        ? "text-slate-800"
                        : "text-slate-500",
                    )}
                  >
                    Hourly
                  </Text>
                  <Text
                    className={cn(
                      "text-lg font-bold -mt-1",
                      pricingType === "hour" ? "text-[#0F1C23]" : "text-white",
                    )}
                  >
                    ${vehicle.pricePerHour}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setPricingType("day")}
                className={cn(
                  "flex-1 flex-row items-center justify-center gap-2 py-4 rounded-xl",
                  pricingType === "day" ? "bg-[#22D3EE]" : "bg-transparent",
                )}
              >
                <Calendar
                  color={pricingType === "day" ? "#0F1C23" : "#94A3B8"}
                  size={18}
                />
                <View>
                  <Text
                    className={cn(
                      "text-xs font-medium",
                      pricingType === "day"
                        ? "text-slate-800"
                        : "text-slate-500",
                    )}
                  >
                    Daily
                  </Text>
                  <Text
                    className={cn(
                      "text-lg font-bold -mt-1",
                      pricingType === "day" ? "text-[#0F1C23]" : "text-white",
                    )}
                  >
                    ${vehicle.pricePerDay}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-[#0F1C23] border-t border-slate-800 px-5 pt-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="flex-row items-center justify-between gap-6">
          <View>
            <Text className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
              Total Price
            </Text>
            <View className="flex-row items-baseline gap-1">
              <Text className="text-3xl font-bold text-[#22D3EE]">
                $
                {pricingType === "hour"
                  ? vehicle.pricePerHour
                  : vehicle.pricePerDay}
              </Text>
              <Text className="text-sm font-medium text-slate-400">
                /{pricingType === "hour" ? "hr" : "day"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            disabled={!vehicle.isAvailable}
            onPress={() => navigation.navigate("Booking", { id: vehicle.id })}
            className={cn(
              "flex-1 bg-[#22D3EE] h-14 rounded-2xl items-center justify-center",
              !vehicle.isAvailable && "opacity-50",
            )}
          >
            <Text className="text-[#0F1C23] font-bold text-lg">
              {vehicle.isAvailable ? "Book Now" : "Unavailable"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
