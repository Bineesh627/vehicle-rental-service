import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  mockOwnerShops,
  mockOwnerVehicles,
  OwnerVehicle,
} from "@/data/ownerMockData";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Car,
  ChevronDown,
  Edit,
  MoreVertical,
  Plus,
  Power,
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

// --- Colors ---
const COLORS = {
  bg: "#0F1115",
  card: "#181B21",
  inputBg: "#121418",
  border: "#2A2E36",
  primary: "#00C9A7",
  text: "#FFFFFF",
  textMuted: "#9CA3AF",
  success: "#10B981",
  successBg: "rgba(16, 185, 129, 0.15)",
  error: "#F97316",
  errorBg: "rgba(249, 115, 22, 0.15)",
  tabBg: "#181B21",
};

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
      paddingVertical: 10,
      alignItems: "center",
      borderRadius: 25,
      backgroundColor: isActive ? "#000000" : "transparent",
      borderWidth: isActive ? 1 : 0,
      borderColor: isActive ? "#2A2E36" : "transparent",
    }}
  >
    <Text
      style={{
        textTransform: "capitalize",
        fontWeight: isActive ? "600" : "500",
        color: isActive ? "#FFFFFF" : "#6B7280",
        fontSize: 14,
      }}
    >
      {tab} ({count})
    </Text>
  </Pressable>
);

export default function VehicleManagement() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<OwnerVehicle[]>(mockOwnerVehicles);

  // Modals
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showActionsDialog, setShowActionsDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Pickers state
  const [showShopPicker, setShowShopPicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showFuelPicker, setShowFuelPicker] = useState(false);
  const [showTransPicker, setShowTransPicker] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState<OwnerVehicle | null>(null);
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
    setIsEditing(false);
    setSelectedVehicle(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsEditing(false);
    setShowFormDialog(true);
  };

  const openEditModal = (vehicle: OwnerVehicle) => {
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
    setSelectedVehicle(vehicle);
    setIsEditing(true);
    setShowFormDialog(true);
    setShowActionsDialog(false);
  };

  const handleSaveVehicle = () => {
    if (!formData.name || !formData.brand || !formData.pricePerDay || !formData.vehicleNumber) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all required fields.",
      });
      return;
    }

    if (isEditing && selectedVehicle) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === selectedVehicle.id
            ? {
                ...v,
                shopId: formData.shopId || v.shopId,
                type: formData.type,
                name: formData.name,
                brand: formData.brand,
                model: formData.model,
                vehicleNumber: formData.vehicleNumber,
                pricePerHour: parseInt(formData.pricePerHour) || 0,
                pricePerDay: parseInt(formData.pricePerDay) || 0,
                fuelType: formData.fuelType,
                transmission: formData.transmission,
                color: formData.color,
                year: formData.year,
              }
            : v
        )
      );
      Toast.show({ type: "success", text1: "Vehicle Updated" });
    } else {
      const newVehicle: OwnerVehicle = {
        id: `ov${Date.now()}`,
        shopId: formData.shopId || mockOwnerShops[0].id,
        type: formData.type,
        name: formData.name,
        brand: formData.brand,
        model: formData.model,
        vehicleNumber: formData.vehicleNumber,
        image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
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
      Toast.show({ type: "success", text1: "Vehicle Added" });
    }

    setShowFormDialog(false);
    resetForm();
  };

  const toggleAvailability = (id: string) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, isAvailable: !v.isAvailable } : v)));
    setShowActionsDialog(false);
    const vehicle = vehicles.find(v => v.id === id);
    Toast.show({
        type: "success",
        text1: !vehicle?.isAvailable ? "Marked Available" : "Marked Unavailable"
    });
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    setShowActionsDialog(false);
    Toast.show({ type: "success", text1: "Vehicle Deleted" });
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
    onSelect: (value: string) => void
  ) =>
    visible && (
      <View className="absolute inset-0 bg-black/80 justify-center items-center p-4 z-50">
        <View className="bg-[#1E2025] w-full max-w-sm rounded-xl p-4 gap-2 border border-[#2A2E36]">
          <Text className="text-lg font-bold mb-2 text-white">{title}</Text>
          <ScrollView className="max-h-60">
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                className="p-3 border-b border-[#2A2E36]"
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <Text className="text-gray-300">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Button variant="ghost" onPress={onClose}>
            <Text className="text-white">Close</Text>
          </Button>
        </View>
      </View>
    );

  // Helper Label with fixed margin (removed bottom margin to keep label close to input)
  const FormLabel = ({ text }: { text: string }) => (
    <Text className="text-sm font-semibold text-gray-200 ml-1">{text}</Text>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.bg }} edges={["top"]}>
      <View className="flex-1" style={{ backgroundColor: COLORS.bg }}>
        {/* --- Header --- */}
        <View className="px-4 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color="#FFF" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Vehicle Management</Text>
          </View>
          <TouchableOpacity
            onPress={openAddModal}
            style={{ backgroundColor: COLORS.primary }}
            className="flex-row items-center gap-1 px-4 py-2 rounded-full"
          >
            <Plus size={18} color="#000" strokeWidth={2.5} />
            <Text className="text-black font-bold text-sm">Add Vehicle</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 pt-2" contentContainerStyle={{ paddingBottom: 40 }}>
          {/* --- Tabs --- */}
          <View style={{ backgroundColor: COLORS.tabBg }} className="flex-row mb-6 p-1 rounded-full border border-[#2A2E36]">
            {["all", "car", "bike"].map((tab) => (
              <TabItem
                key={tab}
                tab={tab}
                isActive={activeTab === tab}
                count={tab === "all" ? vehicles.length : vehicles.filter((v) => v.type === tab).length}
                onPress={() => setActiveTab(tab)}
              />
            ))}
          </View>

          {/* --- List --- */}
          {filteredVehicles.length === 0 ? (
            <View className="items-center justify-center py-20 rounded-2xl border border-dashed" style={{ borderColor: COLORS.border }}>
              <Car size={48} color={COLORS.textMuted} className="mb-4" />
              <Text style={{ color: COLORS.textMuted }}>No vehicles found</Text>
            </View>
          ) : (
            <View className="gap-4">
              {filteredVehicles.map((vehicle) => (
                <View key={vehicle.id} style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }} className="rounded-3xl border p-3">
                  <View className="flex-row gap-4">
                    <Image source={{ uri: vehicle.image }} className="w-24 h-24 rounded-xl bg-gray-800" resizeMode="cover" />
                    <View className="flex-1 justify-between py-0.5">
                      <View className="flex-row justify-between items-start">
                        <View>
                          <Text className="text-lg font-bold text-white">{vehicle.name}</Text>
                          <Text className="text-xs text-blue-300/70 mt-0.5 font-medium">
                            {vehicle.brand} • {vehicle.model}
                          </Text>
                        </View>
                        <TouchableOpacity onPress={() => openActions(vehicle)} className="p-1">
                          <MoreVertical size={20} color="#6B7280" />
                        </TouchableOpacity>
                      </View>
                      <View className="flex-row items-center justify-between mt-2">
                        <Text className="text-lg font-bold text-white">
                          ${vehicle.pricePerDay}
                          <Text className="text-xs text-gray-500">/day</Text>
                        </Text>
                        <View
                          style={{ backgroundColor: vehicle.isAvailable ? COLORS.successBg : COLORS.errorBg }}
                          className="px-3 py-1 rounded-full"
                        >
                          <Text style={{ color: vehicle.isAvailable ? COLORS.success : COLORS.error }} className="text-xs font-medium">
                            {vehicle.isAvailable ? "Available" : "Unavailable"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* --- ADD/EDIT VEHICLE MODAL --- */}
        <Modal visible={showFormDialog} transparent animationType="fade" onRequestClose={() => setShowFormDialog(false)}>
          <View className="flex-1 bg-black/80 justify-center items-center p-4">
            <View
              style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
              className="w-full max-w-sm rounded-2xl p-5 border max-h-[90%]"
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-white">
                    {isEditing ? "Edit Vehicle" : "Add New Vehicle"}
                </Text>
                <TouchableOpacity onPress={() => setShowFormDialog(false)}>
                  <X size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <ScrollView 
                contentContainerStyle={{ gap: 24 }} 
                showsVerticalScrollIndicator={false}
              >
                {/* Vehicle Type - gap-1.5 keeps label close to input */}
                <View className="gap-1.5">
                  <FormLabel text="Vehicle Type *" />
                  <TouchableOpacity
                    style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.primary, borderWidth: 1 }}
                    className="flex-row items-center justify-between px-4 py-3 rounded-xl"
                    onPress={() => setShowTypePicker(true)}
                  >
                    <Text className="text-white capitalize font-medium">{formData.type}</Text>
                    <ChevronDown size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                {/* Shop */}
                <View className="gap-1.5">
                  <FormLabel text="Shop *" />
                  <TouchableOpacity
                    style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border }}
                    className="flex-row items-center justify-between px-4 py-3 rounded-xl border"
                    onPress={() => setShowShopPicker(true)}
                  >
                    <Text className={formData.shopId ? "text-white" : "text-gray-500"}>
                      {mockOwnerShops.find((s) => s.id === formData.shopId)?.name || "Select shop"}
                    </Text>
                    <ChevronDown size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                {/* Vehicle Name */}
                <View className="gap-1.5">
                  <FormLabel text="Vehicle Name *" />
                  <Input
                    value={formData.name}
                    onChangeText={(t) => handleInputChange("name", t)}
                    placeholder="e.g., Toyota Camry"
                    placeholderTextColor="#4B5563"
                    className="bg-[#121418] border-[#2A2E36] text-white rounded-xl h-12"
                  />
                </View>

                {/* Vehicle Number */}
                <View className="gap-1.5">
                  <FormLabel text="Vehicle Number *" />
                  <Input
                    value={formData.vehicleNumber}
                    onChangeText={(t) => handleInputChange("vehicleNumber", t)}
                    placeholder="e.g., TN-01-AB-1234"
                    placeholderTextColor="#4B5563"
                    className="bg-[#121418] border-[#2A2E36] text-white rounded-xl h-12"
                  />
                </View>

                {/* Brand & Model */}
                <View className="flex-row gap-3">
                  <View className="flex-1 gap-1.5">
                    <FormLabel text="Brand *" />
                    <Input
                      value={formData.brand}
                      onChangeText={(t) => handleInputChange("brand", t)}
                      placeholder="e.g., Toyota"
                      placeholderTextColor="#4B5563"
                      className="bg-[#121418] border-[#2A2E36] text-white rounded-xl h-12"
                    />
                  </View>
                  <View className="flex-1 gap-1.5">
                    <FormLabel text="Model" />
                    <Input
                      value={formData.model}
                      onChangeText={(t) => handleInputChange("model", t)}
                      placeholder="e.g., Camry"
                      placeholderTextColor="#4B5563"
                      className="bg-[#121418] border-[#2A2E36] text-white rounded-xl h-12"
                    />
                  </View>
                </View>

                {/* Year & Color */}
                <View className="flex-row gap-3">
                  <View className="flex-1 gap-1.5">
                    <FormLabel text="Year" />
                    <Input
                      value={formData.year}
                      onChangeText={(t) => handleInputChange("year", t)}
                      placeholder="e.g., 2024"
                      placeholderTextColor="#4B5563"
                      keyboardType="numeric"
                      className="bg-[#121418] border-[#2A2E36] text-white rounded-xl h-12"
                    />
                  </View>
                  <View className="flex-1 gap-1.5">
                    <FormLabel text="Color" />
                    <Input
                      value={formData.color}
                      onChangeText={(t) => handleInputChange("color", t)}
                      placeholder="e.g., White"
                      placeholderTextColor="#4B5563"
                      className="bg-[#121418] border-[#2A2E36] text-white rounded-xl h-12"
                    />
                  </View>
                </View>

                {/* Prices */}
                <View className="flex-row gap-3">
                  <View className="flex-1 gap-1.5">
                    <FormLabel text="Price/Hour ($)" />
                    <Input
                      value={formData.pricePerHour}
                      onChangeText={(t) => handleInputChange("pricePerHour", t)}
                      placeholder="15"
                      placeholderTextColor="#4B5563"
                      keyboardType="numeric"
                      className="bg-[#121418] border-[#2A2E36] text-white rounded-xl h-12"
                    />
                  </View>
                  <View className="flex-1 gap-1.5">
                    <FormLabel text="Price/Day ($) *" />
                    <Input
                      value={formData.pricePerDay}
                      onChangeText={(t) => handleInputChange("pricePerDay", t)}
                      placeholder="89"
                      placeholderTextColor="#4B5563"
                      keyboardType="numeric"
                      className="bg-[#121418] border-[#2A2E36] text-white rounded-xl h-12"
                    />
                  </View>
                </View>

                {/* Fuel & Transmission */}
                <View className="flex-row gap-3">
                  <View className="flex-1 gap-1.5">
                    <FormLabel text="Fuel Type" />
                    <TouchableOpacity
                      style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border }}
                      className="flex-row items-center justify-between px-3 py-3 rounded-xl border h-12"
                      onPress={() => setShowFuelPicker(true)}
                    >
                      <Text className="text-white text-xs">{formData.fuelType}</Text>
                      <ChevronDown size={14} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                  <View className="flex-1 gap-1.5">
                    <FormLabel text="Transmission" />
                    <TouchableOpacity
                      style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border }}
                      className="flex-row items-center justify-between px-3 py-3 rounded-xl border h-12"
                      onPress={() => setShowTransPicker(true)}
                    >
                      <Text className="text-white text-xs">{formData.transmission}</Text>
                      <ChevronDown size={14} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>

              <View className="flex-row gap-3 mt-6 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 border-[#00C9A7] bg-transparent h-12"
                  onPress={() => setShowFormDialog(false)}
                >
                  <Text style={{ color: COLORS.primary }} className="font-semibold">
                    Cancel
                  </Text>
                </Button>
                <Button
                  className="flex-1 h-12"
                  style={{ backgroundColor: COLORS.primary }}
                  onPress={handleSaveVehicle}
                >
                  <Text className="text-[#0F1115] font-bold">
                    {isEditing ? "Save Changes" : "Add Vehicle"}
                  </Text>
                </Button>
              </View>
            </View>
          </View>

          {/* Pickers */}
          {renderPicker("Select Type", [{ label: "Car", value: "car" }, { label: "Bike", value: "bike" }], showTypePicker, () => setShowTypePicker(false), (v) => handleInputChange("type", v))}
          {renderPicker("Select Shop", mockOwnerShops.map((s) => ({ label: s.name, value: s.id })), showShopPicker, () => setShowShopPicker(false), (v) => handleInputChange("shopId", v))}
          {renderPicker("Fuel Type", [{ label: "Petrol", value: "Petrol" }, { label: "Diesel", value: "Diesel" }, { label: "Electric", value: "Electric" }], showFuelPicker, () => setShowFuelPicker(false), (v) => handleInputChange("fuelType", v))}
          {renderPicker("Transmission", [{ label: "Automatic", value: "Automatic" }, { label: "Manual", value: "Manual" }], showTransPicker, () => setShowTransPicker(false), (v) => handleInputChange("transmission", v))}
        </Modal>

        {/* --- ACTIONS MODAL --- */}
        <Modal
          visible={showActionsDialog}
          transparent
          animationType="slide"
          onRequestClose={() => setShowActionsDialog(false)}
        >
          <TouchableOpacity
            className="flex-1 bg-black/80 justify-end"
            activeOpacity={1}
            onPress={() => setShowActionsDialog(false)}
          >
            <View
              style={{ backgroundColor: COLORS.card }}
              className="rounded-t-3xl p-6 gap-4 border-t border-gray-800"
            >
              <Text className="text-xl font-bold text-white text-center mb-2">
                {selectedVehicle?.name}
              </Text>

              <TouchableOpacity
                className="flex-row items-center gap-4 p-4 bg-gray-800/50 rounded-2xl"
                onPress={() => selectedVehicle && openEditModal(selectedVehicle)}
              >
                <Edit size={22} color={COLORS.text} />
                <Text className="text-white font-medium text-lg">Edit Vehicle</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center gap-4 p-4 bg-gray-800/50 rounded-2xl"
                onPress={() => selectedVehicle && toggleAvailability(selectedVehicle.id)}
              >
                <Power
                  size={22}
                  color={selectedVehicle?.isAvailable ? COLORS.error : COLORS.success}
                />
                <Text className="text-white font-medium text-lg">
                  {selectedVehicle?.isAvailable ? "Mark Unavailable" : "Mark Available"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center gap-4 p-4 bg-red-500/10 rounded-2xl"
                onPress={() => selectedVehicle && deleteVehicle(selectedVehicle.id)}
              >
                <Trash2 size={22} color="#EF4444" />
                <Text className="text-red-500 font-medium text-lg">Delete Vehicle</Text>
              </TouchableOpacity>

              <Button
                variant="ghost"
                className="mt-2"
                onPress={() => setShowActionsDialog(false)}
              >
                <Text className="text-gray-400">Cancel</Text>
              </Button>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}