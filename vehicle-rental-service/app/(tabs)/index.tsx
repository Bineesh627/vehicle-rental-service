import { MapView } from "@/components/MapView";
import { ShopCard } from "@/components/ShopCard";
import { rentalShops } from "@/data/mockData";
import { UserStackParamList } from "@/navigation/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";
import { Bell, MapPin, MessageCircle, Send } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  UserStackParamList,
  "Tabs"
>;

export default function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const router = useRouter();
  const [location, setLocation] = useState("Current Location");
  const [activeFilter, setActiveFilter] = useState<"all" | "car" | "bike">(
    "all",
  );
  const insets = useSafeAreaInsets();

  const handleCurrentLocation = () => {
    setLocation("Current Location");
    Toast.show({
      type: "success",
      text1: "Location updated",
    });
  };

  const handleShopClick = (shopId: string) => {
    navigation.navigate("ShopDetails", { id: shopId }); // Assuming ShopDetails is mapped in UserNavigator
  };

  const filteredShops = rentalShops.filter((shop) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "car") return shop.vehicleCount.cars > 0;
    if (activeFilter === "bike") return shop.vehicleCount.bikes > 0;
    return true;
  });

  return (
    <View className="flex-1 bg-[#0F1C23]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <View>
          <View className="flex-row items-center gap-2 mb-1">
            <MapPin color="#94A3B8" size={14} />
            <Text className="text-sm text-slate-400">Your Location</Text>
          </View>
          <Text className="text-xl font-bold text-white">{location}</Text>
        </View>
        <View className="flex-row gap-3">
          <TouchableOpacity
            className="relative rounded-full bg-[#1E293B] p-3 border border-slate-700"
            onPress={() => router.push("/chat" as any)}
          >
            <MessageCircle color="#FFFFFF" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            className="relative rounded-full bg-[#1E293B] p-3 border border-slate-700"
            onPress={() => router.push(`/user/Notifications` as any)}
          >
            <Bell color="#FFFFFF" size={20} />
            <View className="absolute right-3 top-2 h-2.5 w-2.5 rounded-full bg-[#F97316] border border-[#1E293B]" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 py-4 gap-6">
          {/* Search Bar */}
          <View className="flex-row items-center bg-[#16202C] rounded-2xl border border-slate-800 h-14 px-4 gap-3">
            <MapPin color="#22D3EE" size={20} />
            <TextInput
              value={location}
              onChangeText={setLocation}
              className="flex-1 text-white text-base"
              placeholder="Search location"
              placeholderTextColor="#64748B"
            />
            <View className="bg-[#1E293B] p-3 rounded-full border border-slate-700">
              <Send color="#22D3EE" size={18} />
            </View>
          </View>

          {/* Map Widget */}
          <MapView shops={filteredShops} onShopClick={() => {}} />

          {/* Filters */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setActiveFilter("all")}
              className={`px-6 py-2.5 rounded-full ${activeFilter === "all" ? "bg-[#22D3EE]" : "bg-[#1E293B] border border-slate-700"}`}
            >
              <Text
                className={`font-semibold ${activeFilter === "all" ? "text-[#0F1C23]" : "text-slate-400"}`}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveFilter("car")}
              className={`px-6 py-2.5 rounded-full flex-row items-center gap-2 ${activeFilter === "car" ? "bg-[#22D3EE]" : "bg-[#1E293B] border border-slate-700"}`}
            >
              <Text
                className={`font-semibold ${activeFilter === "car" ? "text-[#0F1C23]" : "text-slate-400"}`}
              >
                Cars
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveFilter("bike")}
              className={`px-6 py-2.5 rounded-full flex-row items-center gap-2 ${activeFilter === "bike" ? "bg-[#22D3EE]" : "bg-[#1E293B] border border-slate-700"}`}
            >
              <Text
                className={`font-semibold ${activeFilter === "bike" ? "text-[#0F1C23]" : "text-slate-400"}`}
              >
                Bikes
              </Text>
            </TouchableOpacity>
          </View>

          {/* Shop List */}
          <View>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-white">
                Nearby Rentals
              </Text>
              <Text className="text-sm text-slate-400">
                {filteredShops.length} shops
              </Text>
            </View>

            {filteredShops.map((shop) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                onClick={() => handleShopClick(shop.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
