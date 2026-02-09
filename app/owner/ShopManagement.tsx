import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockOwnerShops, OwnerShop } from "@/data/ownerMockData";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Clock,
  Edit,
  MapPin,
  MoreVertical,
  Plus,
  Power,
  Star,
  Store,
  Trash2,
  X,
} from "lucide-react-native";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function ShopManagement() {
  const router = useRouter();
  const [shops, setShops] = useState<OwnerShop[]>(mockOwnerShops);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showActionsDialog, setShowActionsDialog] = useState(false);
  const [selectedShop, setSelectedShop] = useState<OwnerShop | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    operatingHours: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({ name: "", address: "", operatingHours: "" });
  };

  const handleAddShop = () => {
    if (!formData.name || !formData.address) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all required fields.",
      });
      return;
    }

    const newShop: OwnerShop = {
      id: `os${Date.now()}`,
      name: formData.name,
      address: formData.address,
      operatingHours: formData.operatingHours || "9:00 AM - 6:00 PM",
      status: "active",
      vehicleCount: 0,
      rating: 0,
      totalBookings: 0,
      revenue: 0,
    };

    setShops((prev) => [...prev, newShop]);
    Toast.show({
      type: "success",
      text1: "Shop Added",
      text2: `${formData.name} has been added successfully.`,
    });
    setShowAddDialog(false);
    resetForm();
  };

  const handleEditShop = () => {
    if (!selectedShop) return;

    setShops((prev) =>
      prev.map((shop) =>
        shop.id === selectedShop.id ? { ...shop, ...formData } : shop,
      ),
    );
    Toast.show({
      type: "success",
      text1: "Shop Updated",
      text2: `${formData.name} has been updated successfully.`,
    });
    setShowEditDialog(false);
    setSelectedShop(null);
    resetForm();
  };

  const openEditDialog = (shop: OwnerShop) => {
    setSelectedShop(shop);
    setFormData({
      name: shop.name,
      address: shop.address,
      operatingHours: shop.operatingHours,
    });
    setShowEditDialog(true);
    setShowActionsDialog(false);
  };

  const toggleShopStatus = (shopId: string) => {
    setShops((prev) =>
      prev.map((shop) =>
        shop.id === shopId
          ? {
              ...shop,
              status: shop.status === "active" ? "inactive" : "active",
            }
          : shop,
      ),
    );
    const shop = shops.find((s) => s.id === shopId);
    Toast.show({
      type: "success",
      text1: shop?.status === "active" ? "Shop Disabled" : "Shop Enabled",
      text2: `${shop?.name} has been ${
        shop?.status === "active" ? "disabled" : "enabled"
      }.`,
    });
    setShowActionsDialog(false);
  };

  const deleteShop = (shopId: string) => {
    const shop = shops.find((s) => s.id === shopId);
    setShops((prev) => prev.filter((s) => s.id !== shopId));
    Toast.show({
      type: "success",
      text1: "Shop Deleted",
      text2: `${shop?.name} has been deleted.`,
    });
    setShowActionsDialog(false);
  };

  const openActions = (shop: OwnerShop) => {
    setSelectedShop(shop);
    setShowActionsDialog(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-background pt-8">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="border-b border-border bg-card/95 px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onPress={() => router.push("/owner/OwnerDashboard")}
            >
              <ArrowLeft size={20} className="text-foreground" />
            </Button>
            <Text className="text-lg font-bold text-foreground">
              Shop Management
            </Text>
          </View>
          <Button size="sm" onPress={() => setShowAddDialog(true)}>
            <Plus size={16} className="text-primary-foreground mr-1" />
            <Text className="text-primary-foreground text-xs">Add Shop</Text>
          </Button>
        </View>

        <ScrollView
          className="flex-1 px-4 py-6"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {shops.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 items-center">
                <Store size={48} className="text-muted-foreground mb-3" />
                <Text className="text-muted-foreground mb-4">No shops yet</Text>
                <Button onPress={() => setShowAddDialog(true)}>
                  <Plus size={16} className="text-primary-foreground mr-1" />
                  <Text className="text-primary-foreground">
                    Add Your First Shop
                  </Text>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <View className="gap-4">
              {shops.map((shop) => (
                <Card key={shop.id} className="border-border">
                  <CardContent className="p-4">
                    <View className="flex-row items-start justify-between">
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
                          <View className="flex-row items-center gap-1 mt-1">
                            <MapPin
                              size={12}
                              className="text-muted-foreground"
                            />
                            <Text className="text-xs text-muted-foreground">
                              {shop.address}
                            </Text>
                          </View>
                          <View className="flex-row items-center gap-1 mt-1">
                            <Clock
                              size={12}
                              className="text-muted-foreground"
                            />
                            <Text className="text-xs text-muted-foreground">
                              {shop.operatingHours}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onPress={() => openActions(shop)}
                      >
                        <MoreVertical size={16} className="text-foreground" />
                      </Button>
                    </View>

                    {/* Stats */}
                    <View className="flex-row justify-between mt-4 pt-4 border-t border-border">
                      <View className="items-center">
                        <Text className="text-lg font-bold text-foreground">
                          {shop.vehicleCount}
                        </Text>
                        <Text className="text-xs text-muted-foreground">
                          Vehicles
                        </Text>
                      </View>
                      <View className="items-center">
                        <Text className="text-lg font-bold text-foreground">
                          {shop.totalBookings}
                        </Text>
                        <Text className="text-xs text-muted-foreground">
                          Bookings
                        </Text>
                      </View>
                      <View className="items-center">
                        <View className="flex-row items-center gap-1">
                          <Star
                            size={12}
                            className="text-yellow-500 fill-yellow-500"
                          />
                          <Text className="text-lg font-bold text-foreground">
                            {shop.rating || "-"}
                          </Text>
                        </View>
                        <Text className="text-xs text-muted-foreground">
                          Rating
                        </Text>
                      </View>
                      <View className="items-center">
                        <Text className="text-lg font-bold text-green-500">
                          ${shop.revenue.toLocaleString()}
                        </Text>
                        <Text className="text-xs text-muted-foreground">
                          Revenue
                        </Text>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Add Shop Modal */}
        <Modal
          visible={showAddDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAddDialog(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <View className="bg-background w-full max-w-sm rounded-xl p-6 gap-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-foreground">
                  Add New Shop
                </Text>
                <TouchableOpacity onPress={() => setShowAddDialog(false)}>
                  <X size={24} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>

              <View className="gap-4">
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Shop Name *
                  </Text>
                  <Input
                    value={formData.name}
                    onChangeText={(text) => handleInputChange("name", text)}
                    placeholder="Enter shop name"
                  />
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Address *
                  </Text>
                  <Input
                    value={formData.address}
                    onChangeText={(text) => handleInputChange("address", text)}
                    placeholder="Enter address"
                  />
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Operating Hours
                  </Text>
                  <Input
                    value={formData.operatingHours}
                    onChangeText={(text) =>
                      handleInputChange("operatingHours", text)
                    }
                    placeholder="e.g., 9:00 AM - 6:00 PM"
                  />
                </View>
              </View>

              <View className="flex-row gap-2 mt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onPress={() => {
                    setShowAddDialog(false);
                    resetForm();
                  }}
                >
                  <Text className="text-foreground">Cancel</Text>
                </Button>
                <Button className="flex-1" onPress={handleAddShop}>
                  <Text className="text-primary-foreground font-medium">
                    Add Shop
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Shop Modal */}
        <Modal
          visible={showEditDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowEditDialog(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <View className="bg-background w-full max-w-sm rounded-xl p-6 gap-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-foreground">
                  Edit Shop
                </Text>
                <TouchableOpacity onPress={() => setShowEditDialog(false)}>
                  <X size={24} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>

              <View className="gap-4">
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Shop Name *
                  </Text>
                  <Input
                    value={formData.name}
                    onChangeText={(text) => handleInputChange("name", text)}
                    placeholder="Enter shop name"
                  />
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Address *
                  </Text>
                  <Input
                    value={formData.address}
                    onChangeText={(text) => handleInputChange("address", text)}
                    placeholder="Enter address"
                  />
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Operating Hours
                  </Text>
                  <Input
                    value={formData.operatingHours}
                    onChangeText={(text) =>
                      handleInputChange("operatingHours", text)
                    }
                    placeholder="e.g., 9:00 AM - 6:00 PM"
                  />
                </View>
              </View>

              <View className="flex-row gap-2 mt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onPress={() => {
                    setShowEditDialog(false);
                    resetForm();
                  }}
                >
                  <Text className="text-foreground">Cancel</Text>
                </Button>
                <Button className="flex-1" onPress={handleEditShop}>
                  <Text className="text-primary-foreground font-medium">
                    Save Changes
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        {/* Actions Modal */}
        <Modal
          visible={showActionsDialog}
          transparent
          animationType="slide"
          onRequestClose={() => setShowActionsDialog(false)}
        >
          <TouchableOpacity
            className="flex-1 bg-black/50 justify-end"
            activeOpacity={1}
            onPress={() => setShowActionsDialog(false)}
          >
            <View className="bg-background rounded-t-xl p-6 gap-4">
              <Text className="text-lg font-bold text-foreground text-center">
                {selectedShop?.name}
              </Text>

              <TouchableOpacity
                className="flex-row items-center gap-3 p-3 bg-secondary rounded-xl"
                onPress={() => selectedShop && openEditDialog(selectedShop)}
              >
                <Edit size={20} className="text-foreground" />
                <Text className="text-foreground font-medium">Edit Shop</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center gap-3 p-3 bg-secondary rounded-xl"
                onPress={() =>
                  selectedShop && toggleShopStatus(selectedShop.id)
                }
              >
                <Power size={20} className="text-foreground" />
                <Text className="text-foreground font-medium">
                  {selectedShop?.status === "active"
                    ? "Disable Shop"
                    : "Enable Shop"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center gap-3 p-3 bg-destructive/10 rounded-xl"
                onPress={() => selectedShop && deleteShop(selectedShop.id)}
              >
                <Trash2 size={20} className="text-destructive" />
                <Text className="text-destructive font-medium">
                  Delete Shop
                </Text>
              </TouchableOpacity>

              <Button
                variant="outline"
                className="mt-2"
                onPress={() => setShowActionsDialog(false)}
              >
                <Text className="text-foreground">Cancel</Text>
              </Button>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
