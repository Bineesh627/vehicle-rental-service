import React, { useState } from "react";

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
import {
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// --- MOCK IMPLEMENTATIONS REMOVED ---

// --- MOCK IMPLEMENTATIONS END ---

// =====================================================================
// 📱 COMPONENT CODE
// =====================================================================

// Mock Data
interface Shop {
  id: string;
  name: string;
  address: string;
  operatingHours: string;
  status: string;
  vehicleCount: number;
  totalBookings: number;
  rating: number;
  revenue: number;
}

const mockOwnerShops: Shop[] = [
  {
    id: "1",
    name: "SpeedWheels Downtown",
    address: "123 Main Street, Downtown",
    operatingHours: "8:00 AM - 10:00 PM",
    status: "active",
    vehicleCount: 15,
    totalBookings: 234,
    rating: 4.8,
    revenue: 18500,
  },
  {
    id: "2",
    name: "SpeedWheels Midtown",
    address: "456 Oak Avenue, Midtown",
    operatingHours: "7:00 AM - 9:00 PM",
    status: "active",
    vehicleCount: 20,
    totalBookings: 189,
    rating: 4.6,
    revenue: 15200,
  },
  {
    id: "3",
    name: "SpeedWheels Airport",
    address: "789 Airport Road, Terminal 2",
    operatingHours: "6:00 AM - 11:00 PM",
    status: "active",
    vehicleCount: 13,
    totalBookings: 156,
    rating: 4.9,
    revenue: 12100,
  },
];

// Theme Colors
const theme = {
  background: "#121214",
  card: "#1c1c1e",
  cardBorder: "#27272a",
  text: "#FFFFFF",
  textMuted: "#a1a1aa",
  primary: "#2dd4bf", // Teal/Cyan for buttons
  primaryForeground: "#000000", // Dark text on teal button
  secondary: "#27272a",
  destructive: "#ef4444",
  success: "#4ade80",
  rating: "#eab308",
  iconBg: "#581c87", // Darker purple for bg
  iconColor: "#a855f7", // Lighter purple for icon
};

export default function ShopManagement() {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>(mockOwnerShops);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showActionsDialog, setShowActionsDialog] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
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

    const newShop = {
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

  const openEditDialog = (shop: Shop) => {
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

  const openActions = (shop: Shop) => {
    setSelectedShop(shop);
    setShowActionsDialog(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Shop Management</Text>
          </View>
          <TouchableOpacity
            style={styles.addShopButton}
            onPress={() => setShowAddDialog(true)}
          >
            <Plus size={16} color={theme.primaryForeground} />
            <Text style={styles.addShopButtonText}>Add Shop</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {shops.length === 0 ? (
            <View style={styles.emptyStateCard}>
              <View style={styles.emptyStateContent}>
                <Store
                  size={48}
                  color={theme.textMuted}
                  style={styles.emptyStateIcon}
                />
                <Text style={styles.emptyStateText}>No shops yet</Text>
                <TouchableOpacity
                  style={styles.addShopButton}
                  onPress={() => setShowAddDialog(true)}
                >
                  <Plus size={16} color={theme.primaryForeground} />
                  <Text style={styles.addShopButtonText}>
                    Add Your First Shop
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.shopList}>
              {shops.map((shop) => (
                <View key={shop.id} style={styles.shopCard}>
                  <View style={styles.shopCardContent}>
                    <View style={styles.shopHeader}>
                      <View style={styles.shopHeaderLeft}>
                        <View style={styles.shopIconContainer}>
                          <Store size={24} color={theme.iconColor} />
                        </View>
                        <View style={styles.shopHeaderText}>
                          <View style={styles.shopNameRow}>
                            <Text style={styles.shopName}>{shop.name}</Text>
                            <View
                              style={[
                                styles.statusBadge,
                                shop.status === "active"
                                  ? styles.statusBadgeActive
                                  : styles.statusBadgeInactive,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.statusText,
                                  shop.status === "active"
                                    ? styles.statusTextActive
                                    : styles.statusTextInactive,
                                ]}
                              >
                                {shop.status}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.shopDetailRow}>
                            <MapPin size={12} color={theme.textMuted} />
                            <Text style={styles.shopDetailText}>
                              {shop.address}
                            </Text>
                          </View>
                          <View style={styles.shopDetailRow}>
                            <Clock size={12} color={theme.textMuted} />
                            <Text style={styles.shopDetailText}>
                              {shop.operatingHours}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.iconButtonSm}
                        onPress={() => openActions(shop)}
                      >
                        <MoreVertical size={20} color={theme.text} />
                      </TouchableOpacity>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                          {shop.vehicleCount}
                        </Text>
                        <Text style={styles.statLabel}>Vehicles</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                          {shop.totalBookings}
                        </Text>
                        <Text style={styles.statLabel}>Bookings</Text>
                      </View>
                      <View style={styles.statItem}>
                        <View style={styles.ratingRow}>
                          <Star
                            size={14}
                            color={theme.rating}
                            fill={theme.rating}
                          />
                          <Text style={styles.statValue}>
                            {shop.rating || "-"}
                          </Text>
                        </View>
                        <Text style={styles.statLabel}>Rating</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.revenueValue}>
                          ${shop.revenue.toLocaleString()}
                        </Text>
                        <Text style={styles.statLabel}>Revenue</Text>
                      </View>
                    </View>
                  </View>
                </View>
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
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Shop</Text>
                <TouchableOpacity onPress={() => setShowAddDialog(false)}>
                  <X size={24} color={theme.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Shop Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => handleInputChange("name", text)}
                    placeholder="Enter shop name"
                    placeholderTextColor={theme.textMuted}
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Address *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.address}
                    onChangeText={(text) => handleInputChange("address", text)}
                    placeholder="Enter address"
                    placeholderTextColor={theme.textMuted}
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Operating Hours</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.operatingHours}
                    onChangeText={(text) =>
                      handleInputChange("operatingHours", text)
                    }
                    placeholder="e.g., 9:00 AM - 6:00 PM"
                    placeholderTextColor={theme.textMuted}
                  />
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.buttonOutline}
                  onPress={() => {
                    setShowAddDialog(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.buttonOutlineText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonPrimary}
                  onPress={handleAddShop}
                >
                  <Text style={styles.buttonPrimaryText}>Add Shop</Text>
                </TouchableOpacity>
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
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Shop</Text>
                <TouchableOpacity onPress={() => setShowEditDialog(false)}>
                  <X size={24} color={theme.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Shop Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => handleInputChange("name", text)}
                    placeholder="Enter shop name"
                    placeholderTextColor={theme.textMuted}
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Address *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.address}
                    onChangeText={(text) => handleInputChange("address", text)}
                    placeholder="Enter address"
                    placeholderTextColor={theme.textMuted}
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Operating Hours</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.operatingHours}
                    onChangeText={(text) =>
                      handleInputChange("operatingHours", text)
                    }
                    placeholder="e.g., 9:00 AM - 6:00 PM"
                    placeholderTextColor={theme.textMuted}
                  />
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.buttonOutline}
                  onPress={() => {
                    setShowEditDialog(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.buttonOutlineText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonPrimary}
                  onPress={handleEditShop}
                >
                  <Text style={styles.buttonPrimaryText}>Save Changes</Text>
                </TouchableOpacity>
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
            style={styles.modalOverlayBottom}
            activeOpacity={1}
            onPress={() => setShowActionsDialog(false)}
          >
            <View style={styles.actionSheetContent}>
              <Text style={styles.actionSheetTitle}>{selectedShop?.name}</Text>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => selectedShop && openEditDialog(selectedShop)}
              >
                <Edit size={20} color={theme.text} />
                <Text style={styles.actionButtonText}>Edit Shop</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() =>
                  selectedShop && toggleShopStatus(selectedShop.id)
                }
              >
                <Power size={20} color={theme.text} />
                <Text style={styles.actionButtonText}>
                  {selectedShop?.status === "active"
                    ? "Disable Shop"
                    : "Enable Shop"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButtonDestructive}
                onPress={() => selectedShop && deleteShop(selectedShop.id)}
              >
                <Trash2 size={20} color={theme.destructive} />
                <Text style={styles.actionButtonTextDestructive}>
                  Delete Shop
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonOutline}
                onPress={() => setShowActionsDialog(false)}
              >
                <Text style={styles.buttonOutlineText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.cardBorder,
    backgroundColor: theme.background,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
  },
  iconButton: {
    padding: 8,
  },
  addShopButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addShopButtonText: {
    color: theme.primaryForeground,
    fontSize: 12,
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  shopList: {
    gap: 16,
  },
  shopCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    overflow: "hidden",
  },
  shopCardContent: {
    padding: 16,
  },
  shopHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  shopHeaderLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    flex: 1,
  },
  shopIconContainer: {
    height: 48,
    width: 48,
    borderRadius: 12,
    backgroundColor: "rgba(168, 85, 247, 0.1)", // Purple with opacity
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.2)",
  },
  shopHeaderText: {
    flex: 1,
    gap: 4,
  },
  shopNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  shopName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusBadgeActive: {
    backgroundColor: "rgba(74, 222, 128, 0.1)", // Green opacity
  },
  statusBadgeInactive: {
    backgroundColor: "rgba(239, 68, 68, 0.1)", // Red opacity
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  statusTextActive: {
    color: theme.success,
  },
  statusTextInactive: {
    color: theme.destructive,
  },
  shopDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  shopDetailText: {
    fontSize: 12,
    color: theme.textMuted,
  },
  iconButtonSm: {
    padding: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.cardBorder,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 2,
  },
  revenueValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.success,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textMuted,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  emptyStateCard: {
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    padding: 32,
    alignItems: "center",
  },
  emptyStateContent: {
    alignItems: "center",
    gap: 16,
  },
  emptyStateText: {
    color: theme.textMuted,
    fontSize: 16,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalOverlayBottom: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.background,
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    gap: 20,
    borderWidth: 1,
    borderColor: theme.cardBorder,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
  },
  formContainer: {
    gap: 16,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.text,
  },
  input: {
    backgroundColor: theme.secondary,
    borderRadius: 8,
    padding: 12,
    color: theme.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: theme.cardBorder,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  buttonOutline: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonOutlineText: {
    color: theme.text,
    fontWeight: "500",
  },
  buttonPrimary: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: theme.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimaryText: {
    color: theme.primaryForeground,
    fontWeight: "600",
  },
  actionSheetContent: {
    backgroundColor: theme.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: theme.cardBorder,
  },
  actionSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
    textAlign: "center",
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: theme.secondary,
  },
  actionButtonDestructive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.text,
  },
  actionButtonTextDestructive: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.destructive,
  },
});
