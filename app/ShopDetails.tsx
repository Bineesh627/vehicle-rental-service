import { VehicleCard } from "@/components/VehicleCard";
import { VehicleFilter } from "@/components/VehicleFilter";
import { rentalShops, vehicles } from "@/data/mockData";
import { UserStackParamList } from "@/navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  Share2,
  Star,
} from "lucide-react-native";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ShopDetailsRouteProp = RouteProp<UserStackParamList, "ShopDetails">;
type ShopDetailsNavigationProp = NativeStackNavigationProp<
  UserStackParamList,
  "ShopDetails"
>;

export default function ShopDetails() {
  const route = useRoute<ShopDetailsRouteProp>();
  const navigation = useNavigation<ShopDetailsNavigationProp>();
  const { id } = route.params;

  const shop = rentalShops.find((s) => s.id === id);
  const shopVehicles = vehicles; // In real app, filter by shop ID

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

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView>
        {/* Hero Image */}
        <View className="relative">
          <Image
            source={{ uri: shop.image }}
            className="w-full h-64"
            resizeMode="cover"
          />
          <View className="absolute top-4 left-4 right-4 flex-row justify-between items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-background/80 p-2 rounded-full"
            >
              <ArrowLeft color="#000" size={24} />
            </TouchableOpacity>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={handleShare}
                className="bg-background/80 p-2 rounded-full"
              >
                <Share2 color="#000" size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Shop Info */}
        <View className="px-4 py-6 bg-background -mt-6 rounded-t-3xl">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-foreground mb-1">
                {shop.name}
              </Text>
              <View className="flex-row items-center gap-1">
                <MapPin color="#6b7280" size={16} />
                <Text className="text-sm text-muted-foreground">
                  {shop.address}
                </Text>
              </View>
            </View>
            <View className="bg-primary/10 px-3 py-1.5 rounded-full flex-row items-center gap-1">
              <Star fill="#000" color="#000" size={14} />
              <Text className="font-bold text-primary">{shop.rating}</Text>
            </View>
          </View>

          <View className="flex-row gap-4 mb-6">
            <TouchableOpacity
              onPress={handleCall}
              className="flex-1 flex-row items-center justify-center gap-2 bg-secondary py-3 rounded-xl"
            >
              <Phone color="#000" size={20} />
              <Text className="font-semibold text-foreground">Call Shop</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 bg-secondary py-3 rounded-xl">
              <Clock color="#000" size={20} />
              <Text className="font-semibold text-foreground">Open Now</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-lg font-bold text-foreground mb-4">
            Available Vehicles
          </Text>

          <View className="mb-4">
            <VehicleFilter
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </View>

          <View className="gap-4">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onClick={() =>
                  navigation.navigate("VehicleDetails", { id: vehicle.id })
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
