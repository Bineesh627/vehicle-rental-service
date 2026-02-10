import { VehicleCard } from "@/components/VehicleCard";
import { rentalShops, vehicles } from "@/data/mockData";
import { UserStackParamList } from "@/navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  Bike,
  Car,
  Clock,
  MapPin,
  Phone,
  Share2,
  Star,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ShopDetailsRouteProp = RouteProp<UserStackParamList, "ShopDetails">;
type ShopDetailsNavigationProp = NativeStackNavigationProp<
  UserStackParamList,
  "ShopDetails"
>;

export default function ShopDetails() {
  const route = useRoute<ShopDetailsRouteProp>();
  const navigation = useNavigation<ShopDetailsNavigationProp>();
  const { id } = route.params;
  const insets = useSafeAreaInsets();

  const shop = rentalShops.find((s) => s.id === id);
  // In a real app, you'd filter vehicles by shopId.
  // For this mock, we'll just show all vehicles or filter if shopId matches in mockData.
  const shopVehicles = vehicles;

  const [activeFilter, setActiveFilter] = useState<"all" | "car" | "bike">(
    "all",
  );

  if (!shop) return null;

  const filteredVehicles = shopVehicles.filter((v) => {
    if (activeFilter === "all") return true;
    return v.type === activeFilter;
  });

  const handleCall = () => {
    // Implement phone call intent
  };

  const handleShare = () => {
    // Implement share intent
  };

  const handleDirections = () => {
    // Implement maps intent
  };

  return (
    <View className="flex-1 bg-[#0F1C23]">
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero Image */}
        <View className="relative">
          <Image
            source={{ uri: shop.image }}
            className="w-full h-72"
            resizeMode="cover"
          />

          {/* Header Buttons Overlay */}
          <View
            className="absolute left-0 right-0 flex-row justify-between items-center px-4"
            style={{ top: insets.top + 10 }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-[#1E293B]/80 p-3 rounded-full"
            >
              <ArrowLeft color="#fff" size={24} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShare}
              className="bg-[#1E293B]/80 p-3 rounded-full"
            >
              <Share2 color="#fff" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Shop Info Card - Overlapping */}
        <View className="-mt-10 bg-[#0F1C23] rounded-t-[32px] px-6 pt-8">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-2xl font-bold text-white flex-1 mr-4">
              {shop.name}
            </Text>
            <View className="bg-[#0F1C23] px-3 py-1.5 rounded-full flex-row items-center gap-1.5 border border-slate-700">
              <Star fill="#F59E0B" color="#F59E0B" size={14} />
              <Text className="font-bold text-white">{shop.rating}</Text>
              <Text className="text-xs text-slate-400">
                ({shop.reviewCount})
              </Text>
            </View>
          </View>

          <View className="mb-6 space-y-3">
            <View className="flex-row items-center gap-2">
              <MapPin color="#94A3B8" size={16} />
              <Text className="text-slate-400 text-base">{shop.address}</Text>
            </View>

            <View className="flex-row items-center gap-4">
              {shop.isOpen ? (
                <View className="flex-row items-center gap-2">
                  <View className="w-2 h-2 rounded-full bg-green-500" />
                  <Text className="text-green-500 font-medium">Open Now</Text>
                </View>
              ) : (
                <View className="flex-row items-center gap-2">
                  <View className="w-2 h-2 rounded-full bg-red-500" />
                  <Text className="text-red-500 font-medium">Closed</Text>
                </View>
              )}

              <View className="flex-row items-center gap-2">
                <Clock color="#94A3B8" size={16} />
                <Text className="text-slate-400">
                  {shop.operatingHours || "8:00 AM - 10:00 PM"}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-4 mb-8">
            <TouchableOpacity
              onPress={handleCall}
              className="flex-1 flex-row items-center justify-center gap-2 bg-[#22D3EE] py-4 rounded-2xl"
            >
              <Phone color="#0F1C23" size={20} />
              <Text className="font-bold text-[#0F1C23] text-base">
                Call Shop
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDirections}
              className="flex-1 flex-row items-center justify-center gap-2 border border-[#22D3EE] py-4 rounded-2xl"
            >
              <Text className="font-bold text-[#22D3EE] text-base">
                Get Directions
              </Text>
            </TouchableOpacity>
          </View>

          {/* Available Vehicles Header */}
          <View className="flex-row justify-between items-end mb-4">
            <Text className="text-xl font-bold text-white">
              Available Vehicles
            </Text>
            <Text className="text-slate-400 pb-1">
              {filteredVehicles.length} vehicles
            </Text>
          </View>

          {/* Custom Filters */}
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              onPress={() => setActiveFilter("all")}
              className={`w-10 h-10 rounded-full items-center justify-center ${activeFilter === "all" ? "bg-[#22D3EE]" : "bg-[#0F1C23] border border-slate-700"}`}
            >
              <Text
                className={`font-medium ${activeFilter === "all" ? "text-[#0F1C23]" : "text-slate-400"}`}
              >
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveFilter("car")}
              className={`px-4 h-10 rounded-full flex-row items-center gap-2 ${activeFilter === "car" ? "bg-[#22D3EE]" : "bg-[#0F1C23] border border-slate-700"}`}
            >
              <Car
                color={activeFilter === "car" ? "#0F1C23" : "#94A3B8"}
                size={18}
              />
              <Text
                className={`font-medium ${activeFilter === "car" ? "text-[#0F1C23]" : "text-slate-400"}`}
              >
                Cars
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveFilter("bike")}
              className={`px-4 h-10 rounded-full flex-row items-center gap-2 ${activeFilter === "bike" ? "bg-[#22D3EE]" : "bg-[#0F1C23] border border-slate-700"}`}
            >
              <Bike
                color={activeFilter === "bike" ? "#0F1C23" : "#94A3B8"}
                size={18}
              />
              <Text
                className={`font-medium ${activeFilter === "bike" ? "text-[#0F1C23]" : "text-slate-400"}`}
              >
                Bikes
              </Text>
            </TouchableOpacity>
          </View>

          {/* Vehicle List */}
          <View className="gap-4">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onPress={() =>
                  navigation.navigate("VehicleDetails", { id: vehicle.id })
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
