import { VehicleCard } from "@/components/VehicleCard";
import { api, chatApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { RentalShop, Vehicle } from "@/types";
import { UserStackParamList } from "@/navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Bike,
  Car,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Star,
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type ShopDetailsRouteProp = RouteProp<UserStackParamList, "ShopDetails">;
type ShopDetailsNavigationProp = NativeStackNavigationProp<
  UserStackParamList,
  "ShopDetails"
>;

export default function ShopDetails() {
  const router = useRouter();
  const route = useRoute<ShopDetailsRouteProp>();
  const navigation = useNavigation<ShopDetailsNavigationProp>();
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const { token } = useAuth();

  const [shop, setShop] = useState<RentalShop | null>(null);
  const [shopVehicles, setShopVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState<"all" | "car" | "bike">(
    "all",
  );

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        setLoading(true);
        const [shopData, vehiclesData] = await Promise.all([
          api.getRentalShop(id),
          api.getShopVehicles(id),
        ]);
        setShop(shopData);
        setShopVehicles(vehiclesData);
      } catch (err) {
        console.error("Failed to fetch shop details:", err);
        setError("Failed to load shop details");
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Could not load shop details",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchShopDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#0F1C23]">
        <ActivityIndicator size="large" color="#22D3EE" />
      </View>
    );
  }

  if (error || !shop) {
    return (
      <View className="flex-1 justify-center items-center bg-[#0F1C23]">
        <Text className="text-slate-400 mb-4">Shop not found</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-[#22D3EE] px-4 py-2 rounded-lg"
        >
          <Text className="font-bold text-[#0F1C23]">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
          <View className="mb-8">
            <View className="flex-row gap-4 mb-3">
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

            <TouchableOpacity
              className="flex-row items-center justify-center gap-2 bg-[#1E293B] py-4 rounded-2xl border border-slate-700"
              onPress={async () => {
                try {
                  const conv = await chatApi.getOrCreateConversation(
                    token || "",
                    shop.id,
                  );
                  router.push({
                    pathname: "/chat/[id]",
                    params: {
                      id: conv.id,
                      partnerName: conv.partnerName,
                      partnerRole: conv.partnerRole,
                      isOnline: String(conv.isOnline),
                      shopName: conv.shopName,
                    },
                  });
                } catch (e) {
                  Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Could not open conversation",
                  });
                }
              }}
            >
              <MessageCircle color="#FFFFFF" size={20} />
              <Text className="font-bold text-white text-base">
                Message Shop
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
