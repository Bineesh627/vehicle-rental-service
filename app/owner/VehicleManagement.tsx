import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  mockOwnerShops,
  mockOwnerVehicles,
  OwnerVehicle,
} from "@/data/ownerMockData";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Bike,
  Car,
  DollarSign,
  Edit,
  Fuel,
  MoreVertical,
  Plus,
  Power,
  Settings2,
  Trash2,
  X,
} from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const TabItem = ({
  tab,
  isActive,
  count,
  onPress,
}: {
  tab: string;
  isActive: boolean;
  count: number;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={{
      flex: 1,
      paddingVertical: 8,
      alignItems: "center",
      borderRadius: 8,
      backgroundColor: isActive ? "hsl(var(--background))" : "transparent",
      shadowColor: isActive ? "#000" : undefined,
      shadowOffset: isActive ? { width: 0, height: 1 } : undefined,
      shadowOpacity: isActive ? 0.05 : undefined,
      shadowRadius: isActive ? 2 : undefined,
      elevation: isActive ? 2 : undefined,
    }}
  >
    <Text
      style={{
        textTransform: "capitalize",
        fontWeight: "500",
        color: isActive
          ? "hsl(var(--foreground))"
          : "hsl(var(--muted-foreground))",
      }}
    >
      {tab} ({count})
    </Text>
  </Pressable>
);

export default function VehicleManagement() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<OwnerVehicle[]>(mockOwnerVehicles);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showActionsDialog, setShowActionsDialog] = useState(false);

  // Pickers state
  const [showShopPicker, setShowShopPicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showFuelPicker, setShowFuelPicker] = useState(false);
  const [showTransPicker, setShowTransPicker] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState<OwnerVehicle | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("all");
  const [formData, setFormData] = useState({
    shopId: "",
    type: "car" as "car" | "bike",
    name: "",
    brand: "",
    model: "",
    vehicleNumber: "",
    pricePerHour: "",
    pricePerDay: "",
    fuelType: "Petrol",
    transmission: "Automatic",
    seating: "5",
    color: "",
    year: "",
  });

  const filteredVehicles = vehicles.filter((v) => {
    if (activeTab === "all") return true;
    return v.type === activeTab;
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      shopId: "",
      type: "car",
      name: "",
      brand: "",
      model: "",
      vehicleNumber: "",
      pricePerHour: "",
      pricePerDay: "",
      fuelType: "Petrol",
      transmission: "Automatic",
      seating: "5",
      color: "",
      year: "",
    });
  };

  const handleAddVehicle = () => {
    if (
      !formData.name ||
      !formData.brand ||
      !formData.pricePerDay ||
      !formData.vehicleNumber
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          "Please fill in all required fields per day price and vehicle number.",
      });
      return;
    }

    const newVehicle: OwnerVehicle = {
      id: `ov${Date.now()}`,
      shopId: formData.shopId || mockOwnerShops[0].id,
      type: formData.type,
      name: formData.name,
      brand: formData.brand,
      model: formData.model,
      vehicleNumber: formData.vehicleNumber,
      image:
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
      pricePerHour: parseInt(formData.pricePerHour) || 0,
      pricePerDay: parseInt(formData.pricePerDay) || 0,
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      seating: formData.type === "car" ? parseInt(formData.seating) : undefined,
      isAvailable: true,
      features: [],
      color: formData.color || undefined,
      year: formData.year || undefined,
    };

    setVehicles((prev) => [...prev, newVehicle]);
    Toast.show({
      type: "success",
      text1: "Vehicle Added",
      text2: `${formData.name} has been added successfully.`,
    });
    setShowAddDialog(false);
    resetForm();
  };

  const handleEditVehicle = () => {
    if (!selectedVehicle) return;

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === selectedVehicle.id
          ? {
              ...v,
              name: formData.name,
              brand: formData.brand,
              model: formData.model,
              pricePerHour: parseInt(formData.pricePerHour) || 0,
              pricePerDay: parseInt(formData.pricePerDay) || 0,
              fuelType: formData.fuelType,
              transmission: formData.transmission,
            }
          : v,
      ),
    );
    Toast.show({
      type: "success",
      text1: "Vehicle Updated",
      text2: `${formData.name} has been updated successfully.`,
    });
    setShowEditDialog(false);
    setSelectedVehicle(null);
    resetForm();
  };

  const openEditDialog = (vehicle: OwnerVehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      shopId: vehicle.shopId,
      type: vehicle.type,
      name: vehicle.name,
      brand: vehicle.brand,
      model: vehicle.model,
      vehicleNumber: vehicle.vehicleNumber,
      pricePerHour: vehicle.pricePerHour.toString(),
      pricePerDay: vehicle.pricePerDay.toString(),
      fuelType: vehicle.fuelType,
      transmission: vehicle.transmission,
      seating: vehicle.seating?.toString() || "5",
      color: vehicle.color || "",
      year: vehicle.year || "",
    });
    setShowEditDialog(true);
    setShowActionsDialog(false);
  };

  const toggleAvailability = (vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId ? { ...v, isAvailable: !v.isAvailable } : v,
      ),
    );
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    Toast.show({
      type: "success",
      text1: vehicle?.isAvailable ? "Vehicle Unavailable" : "Vehicle Available",
      text2: `${vehicle?.name} is now ${
        vehicle?.isAvailable ? "unavailable" : "available"
      }.`,
    });
    setShowActionsDialog(false);
  };

  const deleteVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    Toast.show({
      type: "success",
      text1: "Vehicle Deleted",
      text2: `${vehicle?.name} has been deleted.`,
    });
    setShowActionsDialog(false);
  };

  const openActions = (vehicle: OwnerVehicle) => {
    setSelectedVehicle(vehicle);
    setShowActionsDialog(true);
  };

  const renderPicker = (
    title: string,
    options: { label: string; value: string }[],
    visible: boolean,
    onClose: () => void,
    onSelect: (value: string) => void,
  ) =>
    visible && (
      <View className="absolute inset-0 bg-black/50 justify-center items-center p-4 z-50">
        <View className="bg-background w-full max-w-sm rounded-xl p-4 gap-2">
          <Text className="text-lg font-bold mb-2 text-foreground">
            {title}
          </Text>
          <ScrollView className="max-h-60">
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                className="p-3 border-b border-border"
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <Text className="text-foreground">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Button variant="ghost" onPress={onClose}>
            <Text className="text-foreground">Close</Text>
          </Button>
        </View>
      </View>
    );

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
              Vehicle Management
            </Text>
          </View>
          <Button size="sm" onPress={() => setShowAddDialog(true)}>
            <Plus size={16} className="text-primary-foreground mr-1" />
            <Text className="text-primary-foreground text-xs">Add Vehicle</Text>
          </Button>
        </View>

        <ScrollView
          className="flex-1 px-4 py-6"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Tabs */}
          <View className="flex-row mb-4 bg-secondary/50 p-1 rounded-xl">
            {["all", "car", "bike"].map((tab) => (
              <TabItem
                key={tab}
                tab={tab}
                isActive={activeTab === tab}
                count={
                  tab === "all"
                    ? vehicles.length
                    : vehicles.filter((v) => v.type === tab).length
                }
                onPress={() => setActiveTab(tab)}
              />
            ))}
          </View>

          {/* Vehicle List */}
          {filteredVehicles.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 items-center">
                <Car size={48} className="text-muted-foreground mb-3" />
                <Text className="text-muted-foreground mb-4">
                  No vehicles yet
                </Text>
                <Button onPress={() => setShowAddDialog(true)}>
                  <Plus size={16} className="text-primary-foreground mr-1" />
                  <Text className="text-primary-foreground">
                    Add Your First Vehicle
                  </Text>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <View className="gap-4">
              {filteredVehicles.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className="border-border overflow-hidden"
                >
                  <CardContent className="p-0">
                    <View className="flex-row">
                      <Image
                        source={{ uri: vehicle.image }}
                        className="w-28 h-32"
                        resizeMode="cover"
                      />
                      <View className="flex-1 p-3">
                        <View className="flex-row items-start justify-between">
                          <View className="flex-1">
                            <View className="flex-row items-center gap-2">
                              {vehicle.type === "car" ? (
                                <Car size={16} className="text-primary" />
                              ) : (
                                <Bike size={16} className="text-primary" />
                              )}
                              <Text className="font-medium text-foreground">
                                {vehicle.name}
                              </Text>
                            </View>
                            <Text className="text-xs text-muted-foreground mt-1">
                              {vehicle.brand} • {vehicle.model}
                            </Text>
                            <Text className="text-xs font-medium text-primary mt-1">
                              {vehicle.vehicleNumber}
                            </Text>
                          </View>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onPress={() => openActions(vehicle)}
                          >
                            <MoreVertical
                              size={16}
                              className="text-foreground"
                            />
                          </Button>
                        </View>

                        <View className="flex-row items-center gap-3 mt-2">
                          <View className="flex-row items-center gap-1">
                            <Fuel size={12} className="text-muted-foreground" />
                            <Text className="text-xs text-muted-foreground">
                              {vehicle.fuelType}
                            </Text>
                          </View>
                          <View className="flex-row items-center gap-1">
                            <Settings2
                              size={12}
                              className="text-muted-foreground"
                            />
                            <Text className="text-xs text-muted-foreground">
                              {vehicle.transmission}
                            </Text>
                          </View>
                        </View>

                        <View className="flex-row items-center justify-between mt-2">
                          <View className="flex-row items-center gap-1">
                            <DollarSign size={12} className="text-green-500" />
                            <Text className="text-sm font-bold text-foreground">
                              ${vehicle.pricePerDay}
                            </Text>
                            <Text className="text-xs text-muted-foreground">
                              /day
                            </Text>
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
                              {vehicle.isAvailable
                                ? "Available"
                                : "Unavailable"}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Add Vehicle Modal */}
        <Modal
          visible={showAddDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAddDialog(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <View className="bg-background w-full max-w-sm rounded-xl p-6 gap-4 max-h-[80%]">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-foreground">
                  Add New Vehicle
                </Text>
                <TouchableOpacity onPress={() => setShowAddDialog(false)}>
                  <X size={24} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>

              <ScrollView className="gap-4">
                <View className="gap-2 mb-4">
                  <Text className="text-sm font-medium text-foreground">
                    Vehicle Type *
                  </Text>
                  <TouchableOpacity
                    className="flex h-12 w-full flex-row items-center justify-between rounded-xl border border-input bg-background px-3 py-2"
                    onPress={() => setShowTypePicker(true)}
                  >
                    <Text className="text-foreground capitalize">
                      {formData.type}
                    </Text>
                    <Settings2 size={16} className="text-muted-foreground" />
                  </TouchableOpacity>
                </View>

                {/* Other Inputs */}
                <View className="gap-2 mb-4">
                  <Text className="text-sm font-medium text-foreground">
                    Vehicle Name *
                  </Text>
                  <Input
                    value={formData.name}
                    onChangeText={(text) => handleInputChange("name", text)}
                    placeholder="e.g., Toyota Camry"
                  />
                </View>

                {/* More inputs simplified for brevity, assuming standard inputs */}
                <View className="gap-2 mb-4">
                  <Text className="text-sm font-medium text-foreground">
                    Vehicle Number *
                  </Text>
                  <Input
                    value={formData.vehicleNumber}
                    onChangeText={(text) =>
                      handleInputChange("vehicleNumber", text)
                    }
                    placeholder="e.g., TN-01-AB-1234"
                  />
                </View>

                <View className="flex-row gap-3 mb-4">
                  <View className="flex-1 gap-2">
                    <Text className="text-sm font-medium text-foreground">
                      Brand *
                    </Text>
                    <Input
                      value={formData.brand}
                      onChangeText={(t) => handleInputChange("brand", t)}
                    />
                  </View>
                  <View className="flex-1 gap-2">
                    <Text className="text-sm font-medium text-foreground">
                      Model
                    </Text>
                    <Input
                      value={formData.model}
                      onChangeText={(t) => handleInputChange("model", t)}
                    />
                  </View>
                </View>

                <View className="flex-row gap-3 mb-4">
                  <View className="flex-1 gap-2">
                    <Text className="text-sm font-medium text-foreground">
                      Price/Day *
                    </Text>
                    <Input
                      value={formData.pricePerDay}
                      onChangeText={(t) => handleInputChange("pricePerDay", t)}
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="flex-1 gap-2">
                    <Text className="text-sm font-medium text-foreground">
                      Price/Hour
                    </Text>
                    <Input
                      value={formData.pricePerHour}
                      onChangeText={(t) => handleInputChange("pricePerHour", t)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View className="gap-2 mb-4">
                  <Text className="text-sm font-medium text-foreground">
                    Shop *
                  </Text>
                  <TouchableOpacity
                    className="flex h-12 w-full flex-row items-center justify-between rounded-xl border border-input bg-background px-3 py-2"
                    onPress={() => setShowShopPicker(true)}
                  >
                    <Text
                      className={
                        formData.shopId
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {mockOwnerShops.find((s) => s.id === formData.shopId)
                        ?.name || "Select shop"}
                    </Text>
                    <Settings2 size={16} className="text-muted-foreground" />
                  </TouchableOpacity>
                </View>
              </ScrollView>

              <View className="flex-row gap-2 mt-2 pt-2 border-t border-border">
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
                <Button className="flex-1" onPress={handleAddVehicle}>
                  <Text className="text-primary-foreground font-medium">
                    Add Vehicle
                  </Text>
                </Button>
              </View>
            </View>
          </View>
          {/* Pickers */}
          {renderPicker(
            "Select Type",
            [
              { label: "Car", value: "car" },
              { label: "Bike", value: "bike" },
            ],
            showTypePicker,
            () => setShowTypePicker(false),
            (v) => handleInputChange("type", v),
          )}

          {renderPicker(
            "Select Shop",
            mockOwnerShops.map((s) => ({ label: s.name, value: s.id })),
            showShopPicker,
            () => setShowShopPicker(false),
            (v) => handleInputChange("shopId", v),
          )}
        </Modal>

        {/* Edit Vehicle Modal (Simplified, similar structure to Add) */}
        <Modal
          visible={showEditDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowEditDialog(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <View className="bg-background w-full max-w-sm rounded-xl p-6 gap-4 max-h-[80%]">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-foreground">
                  Edit Vehicle
                </Text>
                <TouchableOpacity onPress={() => setShowEditDialog(false)}>
                  <X size={24} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>
              <ScrollView className="gap-4">
                <View className="gap-2 mb-4">
                  <Text className="text-sm font-medium text-foreground">
                    Vehicle Name
                  </Text>
                  <Input
                    value={formData.name}
                    onChangeText={(t) => handleInputChange("name", t)}
                  />
                </View>
                {/* ... other inputs ... */}
              </ScrollView>
              <View className="flex-row gap-2 mt-2 pt-2 border-t border-border">
                <Button
                  variant="outline"
                  className="flex-1"
                  onPress={() => setShowEditDialog(false)}
                >
                  <Text className="text-foreground">Cancel</Text>
                </Button>
                <Button className="flex-1" onPress={handleEditVehicle}>
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
                {selectedVehicle?.name}
              </Text>

              <TouchableOpacity
                className="flex-row items-center gap-3 p-3 bg-secondary rounded-xl"
                onPress={() =>
                  selectedVehicle && openEditDialog(selectedVehicle)
                }
              >
                <Edit size={20} className="text-foreground" />
                <Text className="text-foreground font-medium">
                  Edit Vehicle
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center gap-3 p-3 bg-secondary rounded-xl"
                onPress={() =>
                  selectedVehicle && toggleAvailability(selectedVehicle.id)
                }
              >
                <Power size={20} className="text-foreground" />
                <Text className="text-foreground font-medium">
                  {selectedVehicle?.isAvailable
                    ? "Mark Unavailable"
                    : "Mark Available"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center gap-3 p-3 bg-destructive/10 rounded-xl"
                onPress={() =>
                  selectedVehicle && deleteVehicle(selectedVehicle.id)
                }
              >
                <Trash2 size={20} className="text-destructive" />
                <Text className="text-destructive font-medium">
                  Delete Vehicle
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
