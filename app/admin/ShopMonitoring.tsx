import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminShop, mockAdminShops } from "@/data/adminMockData";
import { vehicles } from "@/data/mockData";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Car,
  ChevronRight,
  MapPin,
  Search,
  Star,
  Store,
  X,
} from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShopMonitoring() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShop, setSelectedShop] = useState<AdminShop | null>(null);
  const [showShopDetails, setShowShopDetails] = useState(false);

  const filteredShops = mockAdminShops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const viewShopDetails = (shop: AdminShop) => {
    setSelectedShop(shop);
    setShowShopDetails(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-background pt-8">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="border-b border-border bg-card/95 px-4 py-3 flex-row items-center gap-3">
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <ArrowLeft className="text-foreground" size={24} />
          </Button>
          <Text className="text-lg font-bold text-foreground">
            Shop Monitoring
          </Text>
        </View>

        <ScrollView
          className="px-4 py-6"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Search */}
          <View className="relative mb-4">
            <View className="absolute left-3 top-3 z-10">
              <Search size={16} className="text-muted-foreground" />
            </View>
            <Input
              placeholder="Search shops..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="pl-10 text-foreground"
            />
          </View>

          {/* Stats */}
          <View className="flex-row gap-3 mb-4">
            <Card className="flex-1 border-border">
              <CardContent className="p-3 items-center">
                <Text className="text-xl font-bold text-foreground">
                  {mockAdminShops.length}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  Total Shops
                </Text>
              </CardContent>
            </Card>
            <Card className="flex-1 border-border">
              <CardContent className="p-3 items-center">
                <Text className="text-xl font-bold text-green-500">
                  {mockAdminShops.filter((s) => s.status === "active").length}
                </Text>
                <Text className="text-xs text-muted-foreground">Active</Text>
              </CardContent>
            </Card>
            <Card className="flex-1 border-border">
              <CardContent className="p-3 items-center">
                <Text className="text-xl font-bold text-foreground">
                  {mockAdminShops.reduce((sum, s) => sum + s.vehicleCount, 0)}
                </Text>
                <Text className="text-xs text-muted-foreground">Vehicles</Text>
              </CardContent>
            </Card>
          </View>

          {/* Shop List */}
          <View className="gap-3">
            {filteredShops.map((shop) => (
              <Card key={shop.id} className="border-border bg-card">
                <TouchableOpacity onPress={() => viewShopDetails(shop)}>
                  <CardContent className="p-4">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-3 flex-1">
                        <View className="h-12 w-12 rounded-xl bg-purple-500/10 items-center justify-center">
                          <Store size={24} className="text-purple-500" />
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-center gap-2">
                            <Text className="font-medium text-foreground">
                              {shop.name}
                            </Text>
                            <View
                              className={`px-2 py-0.5 rounded-full ${
                                shop.status === "active"
                                  ? "bg-green-500/10"
                                  : "bg-destructive/10"
                              }`}
                            >
                              <Text
                                className={`text-xs ${
                                  shop.status === "active"
                                    ? "text-green-500"
                                    : "text-destructive"
                                }`}
                              >
                                {shop.status}
                              </Text>
                            </View>
                          </View>
                          <View className="flex-row items-center gap-2 mt-1">
                            <MapPin
                              size={12}
                              className="text-muted-foreground"
                            />
                            <Text
                              className="text-xs text-muted-foreground"
                              numberOfLines={1}
                            >
                              {shop.address}
                            </Text>
                          </View>
                          <View className="flex-row items-center gap-3 mt-1">
                            <View className="flex-row items-center gap-1">
                              <Car
                                size={12}
                                className="text-muted-foreground"
                              />
                              <Text className="text-xs text-muted-foreground">
                                {shop.vehicleCount} vehicles
                              </Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                              <Star
                                size={12}
                                className="text-yellow-500 fill-yellow-500"
                              />
                              <Text className="text-xs text-muted-foreground">
                                {shop.rating}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <ChevronRight
                        size={20}
                        className="text-muted-foreground"
                      />
                    </View>
                  </CardContent>
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        </ScrollView>

        {/* Shop Details Modal */}
        <Modal
          visible={showShopDetails}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowShopDetails(false)}
        >
          <View className="flex-1 justify-end bg-black/60">
            <View
              className={`bg-background rounded-t-3xl h-[85%] ${Platform.OS === "ios" ? "pb-8" : "pb-4"}`}
            >
              <View className="flex-row items-center justify-between p-4 border-b border-border">
                <Text className="text-lg font-bold text-foreground">
                  Shop Details
                </Text>
                <TouchableOpacity
                  onPress={() => setShowShopDetails(false)}
                  className="p-2"
                >
                  <X size={24} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>

              <ScrollView className="p-4">
                {selectedShop && (
                  <View className="gap-4">
                    <View className="flex-row items-center gap-3">
                      <View className="h-16 w-16 rounded-xl bg-purple-500/10 items-center justify-center">
                        <Store size={32} className="text-purple-500" />
                      </View>
                      <View>
                        <Text className="font-semibold text-foreground text-lg">
                          {selectedShop.name}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          {selectedShop.ownerName}
                        </Text>
                      </View>
                    </View>

                    <View className="p-3 rounded-lg bg-secondary flex-row items-start gap-2">
                      <MapPin
                        size={16}
                        className="text-muted-foreground mt-0.5"
                      />
                      <Text className="text-sm text-foreground flex-1">
                        {selectedShop.address}
                      </Text>
                    </View>

                    <View className="flex-row flex-wrap gap-3">
                      <View className="flex-1 min-w-[45%] p-3 rounded-lg bg-secondary">
                        <Text className="text-xs text-muted-foreground">
                          Status
                        </Text>
                        <Text
                          className={`font-medium ${
                            selectedShop.status === "active"
                              ? "text-green-500"
                              : "text-destructive"
                          }`}
                        >
                          {selectedShop.status}
                        </Text>
                      </View>
                      <View className="flex-1 min-w-[45%] p-3 rounded-lg bg-secondary">
                        <Text className="text-xs text-muted-foreground">
                          Rating
                        </Text>
                        <View className="flex-row items-center gap-1">
                          <Star
                            size={16}
                            className="text-yellow-500 fill-yellow-500"
                          />
                          <Text className="font-medium text-foreground">
                            {selectedShop.rating}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-1 min-w-[45%] p-3 rounded-lg bg-secondary">
                        <Text className="text-xs text-muted-foreground">
                          Vehicles
                        </Text>
                        <Text className="font-medium text-foreground">
                          {selectedShop.vehicleCount}
                        </Text>
                      </View>
                      <View className="flex-1 min-w-[45%] p-3 rounded-lg bg-secondary">
                        <Text className="text-xs text-muted-foreground">
                          Total Bookings
                        </Text>
                        <Text className="font-medium text-foreground">
                          {selectedShop.totalBookings}
                        </Text>
                      </View>
                    </View>

                    {/* Vehicles in Shop */}
                    <Card className="border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Vehicles</CardTitle>
                      </CardHeader>
                      <CardContent className="gap-2">
                        {vehicles.slice(0, 3).map((vehicle) => (
                          <View
                            key={vehicle.id}
                            className="flex-row items-center justify-between p-2 rounded-lg bg-secondary/50"
                          >
                            <View className="flex-row items-center gap-2">
                              <Car
                                size={16}
                                className="text-muted-foreground"
                              />
                              <View>
                                <Text className="text-sm font-medium text-foreground">
                                  {vehicle.name}
                                </Text>
                                <Text className="text-xs text-muted-foreground">
                                  ${vehicle.pricePerDay}/day
                                </Text>
                              </View>
                            </View>
                            <View
                              className={`px-2 py-0.5 rounded-full ${
                                vehicle.isAvailable
                                  ? "bg-green-500/10"
                                  : "bg-orange-500/10"
                              }`}
                            >
                              <Text
                                className={`text-xs ${
                                  vehicle.isAvailable
                                    ? "text-green-500"
                                    : "text-orange-500"
                                }`}
                              >
                                {vehicle.isAvailable ? "Available" : "Booked"}
                              </Text>
                            </View>
                          </View>
                        ))}
                      </CardContent>
                    </Card>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
