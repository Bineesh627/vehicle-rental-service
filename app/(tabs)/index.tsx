import { LocationSearch } from "@/components/LocationSearch";
import { MapView } from "@/components/MapView";
import { ShopCard } from "@/components/ShopCard";
import { VehicleFilter } from "@/components/VehicleFilter";
import { rentalShops } from "@/data/mockData";
import { UserStackParamList } from "@/navigation/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Bell, MapPin } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  UserStackParamList,
  "Tabs"
>;

export default function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
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
    navigation.navigate("ShopDetails", { id: shopId });
  };

  const filteredShops = rentalShops.filter((shop) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "car") return shop.vehicleCount.cars > 0;
    if (activeFilter === "bike") return shop.vehicleCount.bikes > 0;
    return true;
  });

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-border bg-card">
        <View>
          <View className="flex-row items-center gap-1.5">
            <MapPin color="#6b7280" size={16} />
            <Text className="text-sm text-muted-foreground">Your Location</Text>
          </View>
          <Text className="text-lg font-bold text-foreground">{location}</Text>
        </View>
        <TouchableOpacity className="relative rounded-xl bg-secondary p-3">
          <Bell color="#000" size={20} />
          <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-accent" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-4 py-6">
          {/* Search */}
          <View className="mb-6">
            <LocationSearch
              value={location}
              onChange={setLocation}
              onCurrentLocation={handleCurrentLocation}
            />
          </View>

          {/* Map */}
          <View className="mb-6">
            <MapView shops={filteredShops} onShopClick={handleShopClick} />
          </View>

          {/* Filter */}
          <View className="mb-6">
            <VehicleFilter
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </View>

          {/* Section title */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-foreground">
              Nearby Rentals
            </Text>
            <Text className="text-sm text-muted-foreground">
              {filteredShops.length} shops
            </Text>
          </View>

          {/* Shop list */}
          <View>
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
