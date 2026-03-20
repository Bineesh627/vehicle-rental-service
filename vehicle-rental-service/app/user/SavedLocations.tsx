import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Briefcase,
  ChevronDown,
  Edit,
  Home,
  MapPin,
  MoreVertical,
  Navigation,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { profileManagementApi, SavedLocation } from "@/services/api";

const getLocationIcon = (type: string) => {
  switch (type) {
    case "home":
      return Home;
    case "work":
      return Briefcase;
    case "favorite":
      return Star;
    default:
      return MapPin;
  }
};

const locationTypes = [
  { label: "Home", value: "home" },
  { label: "Work", value: "work" },
  { label: "Favorite", value: "favorite" },
  { label: "Other", value: "other" },
];

export default function SavedLocations() {
  const router = useRouter();

  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  );
  const [showOptionsModal, setShowOptionsModal] =
    useState<SavedLocation | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "other" as "home" | "work" | "favorite" | "other",
  });

  // Load saved locations on screen focus
  useFocusEffect(
    React.useCallback(() => {
      const loadLocations = async () => {
        try {
          setLoading(true);
          const data = await profileManagementApi.getSavedLocations();
          setLocations(data);
        } catch (error) {
          console.error("Failed to load saved locations:", error);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Failed to load saved locations",
          });
        } finally {
          setLoading(false);
        }
      };

      loadLocations();
    }, []),
  );

  const resetForm = () => {
    setFormData({ name: "", address: "", type: "other" });
    setIsEditing(false);
    setSelectedLocationId(null);
  };

  const handleSaveLocation = async () => {
    if (!formData.name || !formData.address) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields.",
      });
      return;
    }

    try {
      setLoading(true);

      if (isEditing && selectedLocationId) {
        const updatedLocation = await profileManagementApi.updateSavedLocation(
          selectedLocationId,
          formData,
        );
        setLocations((prev) =>
          prev.map((loc) =>
            loc.id === selectedLocationId ? updatedLocation : loc,
          ),
        );
        Toast.show({
          type: "success",
          text1: "Location Updated",
          text2: `${formData.name} has been updated.`,
        });
      } else {
        const newLocation =
          await profileManagementApi.createSavedLocation(formData);
        setLocations((prev) => [...prev, newLocation]);
        Toast.show({
          type: "success",
          text1: "Location Saved",
          text2: `${formData.name} has been added.`,
        });
      }

      setShowDialog(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save location:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save location",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (location: SavedLocation) => {
    setFormData({
      name: location.name,
      address: location.address,
      type: location.type,
    });
    setIsEditing(true);
    setSelectedLocationId(location.id);
    setShowDialog(true);
    setShowOptionsModal(null);
  };

  const deleteLocation = async (id: string) => {
    const location = locations.find((l) => l.id === id);

    try {
      setLoading(true);
      await profileManagementApi.deleteSavedLocation(id);
      setLocations((prev) => prev.filter((l) => l.id !== id));
      Toast.show({
        type: "success",
        text1: "Location Deleted",
        text2: `${location?.name} has been removed.`,
      });
      setShowOptionsModal(null);
    } catch (error) {
      console.error("Failed to delete location:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete location",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2dd4bf" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Saved Locations</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              resetForm();
              setShowDialog(true);
            }}
            style={styles.addButton}
          >
            <Plus size={16} color="#0f172a" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
        >
          {locations.length === 0 ? (
            <View style={styles.emptyState}>
              <MapPin size={48} color="#64748b" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyText}>No saved locations yet</Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => {
                  resetForm();
                  setShowDialog(true);
                }}
              >
                <Plus size={16} color="#0f172a" />
                <Text style={styles.emptyButtonText}>Add Location</Text>
              </TouchableOpacity>
            </View>
          ) : (
            locations.map((location) => {
              const Icon = getLocationIcon(location.type);
              const iconColor =
                location.type === "home"
                  ? "#2dd4bf" // Teal
                  : location.type === "work"
                    ? "#a855f7" // Purple
                    : location.type === "favorite"
                      ? "#f97316" // Orange
                      : "#94a3b8"; // Slate

              const iconBg =
                location.type === "home"
                  ? "rgba(45, 212, 191, 0.1)"
                  : location.type === "work"
                    ? "rgba(168, 85, 247, 0.1)"
                    : location.type === "favorite"
                      ? "rgba(249, 115, 22, 0.1)"
                      : "#334155";

              return (
                <View key={location.id} style={styles.card}>
                  <View style={styles.cardContent}>
                    <View style={styles.cardLeft}>
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: iconBg },
                        ]}
                      >
                        <Icon size={20} color={iconColor} />
                      </View>
                      <View style={styles.textContainer}>
                        <Text style={styles.locationName}>{location.name}</Text>
                        <Text style={styles.locationAddress}>
                          {location.address}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => setShowOptionsModal(location)}
                      style={styles.moreButton}
                    >
                      <MoreVertical size={20} color="#94a3b8" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Add/Edit Dialog */}
        <Modal
          visible={showDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDialog(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {isEditing ? "Edit Location" : "Add New Location"}
                </Text>
                <TouchableOpacity onPress={() => setShowDialog(false)}>
                  <X size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Location Name *</Text>
                  <TextInput
                    value={formData.name}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, name: text }))
                    }
                    placeholder="e.g., Home, Office"
                    placeholderTextColor="#64748b"
                    style={styles.input}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Address *</Text>
                  <TextInput
                    value={formData.address}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, address: text }))
                    }
                    placeholder="Enter full address"
                    placeholderTextColor="#64748b"
                    style={styles.input}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Type</Text>
                  <TouchableOpacity
                    onPress={() => setShowTypeModal(true)}
                    style={styles.selectInput}
                  >
                    <Text style={styles.selectValue}>{formData.type}</Text>
                    <ChevronDown size={16} color="#94a3b8" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowDialog(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveLocation}
                >
                  <Text style={styles.saveButtonText}>
                    {isEditing ? "Save Changes" : "Save Location"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Type Selection Modal */}
        <Modal
          visible={showTypeModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTypeModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowTypeModal(false)}
          >
            <View style={styles.typeModalContainer}>
              {locationTypes.map((type, index) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeOption,
                    index === locationTypes.length - 1 && styles.noBorder,
                  ]}
                  onPress={() => {
                    setFormData((prev) => ({
                      ...prev,
                      type: type.value as any,
                    }));
                    setShowTypeModal(false);
                  }}
                >
                  <Text style={styles.typeOptionText}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Options Modal */}
        <Modal
          visible={!!showOptionsModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowOptionsModal(null)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowOptionsModal(null)}
          >
            <View style={styles.optionsModalContainer}>
              <Text style={styles.optionsTitle}>{showOptionsModal?.name}</Text>

              <TouchableOpacity
                style={styles.optionItem}
                onPress={() =>
                  Toast.show({
                    type: "info",
                    text1: "Navigation",
                    text2: "Starting navigation...",
                  })
                }
              >
                <Navigation size={20} color="#ffffff" />
                <Text style={styles.optionText}>Navigate</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionItem}
                onPress={() =>
                  showOptionsModal && openEditDialog(showOptionsModal)
                }
              >
                <Edit size={20} color="#ffffff" />
                <Text style={styles.optionText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionItem}
                onPress={() =>
                  showOptionsModal && deleteLocation(showOptionsModal.id)
                }
              >
                <Trash2 size={20} color="#ef4444" />
                <Text style={[styles.optionText, { color: "#ef4444" }]}>
                  Delete
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeOptionsButton}
                onPress={() => setShowOptionsModal(null)}
              >
                <Text style={styles.closeOptionsText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // Dark background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2dd4bf", // Teal
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    gap: 4,
  },
  addButtonText: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#1e293b", // Slate-800
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 16,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24, // Circle
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: "#94a3b8", // Slate-400
  },
  moreButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "#1e293b",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 16,
    marginBottom: 16,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2dd4bf",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  emptyButtonText: {
    color: "#0f172a",
    fontWeight: "600",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    backgroundColor: "#1e293b",
    width: "100%",
    maxWidth: 360,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#0f172a",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#334155",
  },
  selectInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  selectValue: {
    color: "#ffffff",
    textTransform: "capitalize",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#2dd4bf",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#0f172a",
    fontWeight: "600",
  },
  // Type Modal
  typeModalContainer: {
    backgroundColor: "#1e293b",
    width: "100%",
    maxWidth: 280,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  typeOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    alignItems: "center",
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  typeOptionText: {
    color: "#ffffff",
    fontSize: 16,
  },
  // Options Modal
  optionsModalContainer: {
    backgroundColor: "#1e293b",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#0f172a",
  },
  optionText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500",
  },
  closeOptionsButton: {
    marginTop: 8,
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  closeOptionsText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 16,
    marginTop: 8,
  },
});
