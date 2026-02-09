import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

interface SavedLocation {
  id: string;
  name: string;
  address: string;
  type: "home" | "work" | "favorite" | "other";
}

const initialLocations: SavedLocation[] = [
  {
    id: "1",
    name: "Home",
    address: "123 Main Street, Downtown, City 12345",
    type: "home",
  },
  {
    id: "2",
    name: "Office",
    address: "456 Business Park, Corporate Zone, City 67890",
    type: "work",
  },
  {
    id: "3",
    name: "Gym",
    address: "789 Fitness Avenue, Sports District",
    type: "favorite",
  },
];

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

  const [locations, setLocations] = useState<SavedLocation[]>(initialLocations);
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

  const resetForm = () => {
    setFormData({ name: "", address: "", type: "other" });
    setIsEditing(false);
    setSelectedLocationId(null);
  };

  const handleSaveLocation = () => {
    if (!formData.name || !formData.address) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields.",
      });
      return;
    }

    if (isEditing && selectedLocationId) {
      setLocations((prev) =>
        prev.map((loc) =>
          loc.id === selectedLocationId ? { ...loc, ...formData } : loc,
        ),
      );
      Toast.show({
        type: "success",
        text1: "Location Updated",
        text2: `${formData.name} has been updated.`,
      });
    } else {
      const newLocation: SavedLocation = {
        id: Date.now().toString(),
        ...formData,
      };
      setLocations((prev) => [...prev, newLocation]);
      Toast.show({
        type: "success",
        text1: "Location Saved",
        text2: `${formData.name} has been added.`,
      });
    }
    setShowDialog(false);
    resetForm();
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

  const deleteLocation = (id: string) => {
    const location = locations.find((l) => l.id === id);
    setLocations((prev) => prev.filter((l) => l.id !== id));
    Toast.show({
      type: "success",
      text1: "Location Deleted",
      text2: `${location?.name} has been removed.`,
    });
    setShowOptionsModal(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-background pt-8">
      <View className="flex-1">
        {/* Header */}
        <View className="border-b border-border bg-card/95 px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Button variant="ghost" size="icon" onPress={() => router.back()}>
              <ArrowLeft size={20} className="text-foreground" />
            </Button>
            <Text className="text-lg font-bold text-foreground">
              Saved Locations
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              resetForm();
              setShowDialog(true);
            }}
            className="flex-row items-center gap-1 bg-primary px-3 py-1.5 rounded-md"
          >
            <Plus size={16} className="text-primary-foreground" />
            <Text className="text-primary-foreground text-xs font-semibold">
              Add
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 px-4 py-6"
          contentContainerStyle={{ gap: 16, paddingBottom: 40 }}
        >
          {locations.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 items-center">
                <MapPin size={48} className="text-muted-foreground mb-3" />
                <Text className="text-muted-foreground">
                  No saved locations yet
                </Text>
                <Button
                  className="mt-4 flex-row gap-1"
                  onPress={() => {
                    resetForm();
                    setShowDialog(true);
                  }}
                >
                  <Plus size={16} className="text-primary-foreground" />
                  <Text className="text-primary-foreground font-semibold">
                    Add Location
                  </Text>
                </Button>
              </CardContent>
            </Card>
          ) : (
            locations.map((location) => {
              const Icon = getLocationIcon(location.type);
              return (
                <Card key={location.id} className="border-border">
                  <CardContent className="p-4">
                    <View className="flex-row items-start justify-between">
                      <View className="flex-row items-start gap-3 flex-1">
                        <View
                          className={`h-10 w-10 rounded-xl items-center justify-center ${
                            location.type === "home"
                              ? "bg-primary/10"
                              : location.type === "work"
                                ? "bg-purple-500/10"
                                : location.type === "favorite"
                                  ? "bg-orange-500/10"
                                  : "bg-secondary"
                          }`}
                        >
                          <Icon
                            size={20}
                            className={
                              location.type === "home"
                                ? "text-primary"
                                : location.type === "work"
                                  ? "text-purple-500"
                                  : location.type === "favorite"
                                    ? "text-orange-500"
                                    : "text-muted-foreground"
                            }
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="font-medium text-foreground">
                            {location.name}
                          </Text>
                          <Text className="text-sm text-muted-foreground mt-1">
                            {location.address}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => setShowOptionsModal(location)}
                      >
                        <MoreVertical
                          size={20}
                          className="text-muted-foreground"
                        />
                      </TouchableOpacity>
                    </View>
                  </CardContent>
                </Card>
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
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <View className="bg-background w-full max-w-sm rounded-xl p-6 gap-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-foreground">
                  {isEditing ? "Edit Location" : "Add New Location"}
                </Text>
                <TouchableOpacity onPress={() => setShowDialog(false)}>
                  <X size={24} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>

              <View className="gap-4">
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Location Name *
                  </Text>
                  <Input
                    value={formData.name}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, name: text }))
                    }
                    placeholder="e.g., Home, Office"
                  />
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Address *
                  </Text>
                  <Input
                    value={formData.address}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, address: text }))
                    }
                    placeholder="Enter full address"
                  />
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Type
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowTypeModal(true)}
                    className="flex-row items-center justify-between border border-input rounded-md px-3 py-2 bg-background"
                  >
                    <Text className="text-foreground capitalize">
                      {formData.type}
                    </Text>
                    <ChevronDown size={16} className="text-muted-foreground" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row gap-2 mt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onPress={() => {
                    setShowDialog(false);
                    resetForm();
                  }}
                >
                  <Text className="text-foreground">Cancel</Text>
                </Button>
                <Button className="flex-1" onPress={handleSaveLocation}>
                  <Text className="text-primary-foreground font-semibold">
                    {isEditing ? "Save Changes" : "Save Location"}
                  </Text>
                </Button>
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
            className="flex-1 bg-black/50 justify-center items-center p-4"
            activeOpacity={1}
            onPress={() => setShowTypeModal(false)}
          >
            <View className="bg-background w-full max-w-xs rounded-xl overflow-hidden">
              {locationTypes.map((type, index) => (
                <TouchableOpacity
                  key={type.value}
                  className={`p-4 border-b border-border ${
                    index === locationTypes.length - 1 ? "border-0" : ""
                  }`}
                  onPress={() => {
                    setFormData((prev) => ({
                      ...prev,
                      type: type.value as any,
                    }));
                    setShowTypeModal(false);
                  }}
                >
                  <Text className="text-foreground text-center">
                    {type.label}
                  </Text>
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
            className="flex-1 bg-black/50 justify-end"
            activeOpacity={1}
            onPress={() => setShowOptionsModal(null)}
          >
            <View className="bg-background rounded-t-xl p-4 gap-2">
              <Text className="text-lg font-bold text-foreground mb-2 px-2">
                {showOptionsModal?.name}
              </Text>
              <TouchableOpacity
                className="flex-row items-center gap-3 p-3 rounded-lg active:bg-secondary"
                onPress={() =>
                  Toast.show({
                    type: "info",
                    text1: "Navigation",
                    text2: "Starting navigation...",
                  })
                }
              >
                <Navigation size={20} className="text-foreground" />
                <Text className="text-base text-foreground">Navigate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center gap-3 p-3 rounded-lg active:bg-secondary"
                onPress={() =>
                  showOptionsModal && openEditDialog(showOptionsModal)
                }
              >
                <Edit size={20} className="text-foreground" />
                <Text className="text-base text-foreground">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center gap-3 p-3 rounded-lg active:bg-secondary"
                onPress={() =>
                  showOptionsModal && deleteLocation(showOptionsModal.id)
                }
              >
                <Trash2 size={20} className="text-destructive" />
                <Text className="text-base text-destructive">Delete</Text>
              </TouchableOpacity>
              <Button
                variant="outline"
                className="mt-2"
                onPress={() => setShowOptionsModal(null)}
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
