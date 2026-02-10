import React, { useState } from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert 
} from "react-native";
import { MapPin, Navigation, X, Check } from "lucide-react-native";

// Assuming you have RN-compatible versions of these
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 

interface DeliveryLocationSelectorProps {
  visible: boolean; // Changed from conditional render to prop
  type: 'delivery' | 'pickup';
  currentAddress?: string;
  onSelect: (address: string) => void;
  onClose: () => void;
}

const savedLocations = [
  { id: "1", name: "Home", address: "123 Main Street, Apt 4B" },
  { id: "2", name: "Work", address: "456 Business Park, Suite 200" },
  { id: "3", name: "Gym", address: "789 Fitness Lane" },
];

export const DeliveryLocationSelector = ({ 
  visible,
  type, 
  currentAddress = "", 
  onSelect, 
  onClose 
}: DeliveryLocationSelectorProps) => {
  const [address, setAddress] = useState(currentAddress);

  const handleCurrentLocation = () => {
    setAddress("Current Location (GPS)");
    Alert.alert("Location", "Using your current location");
  };

  const handleConfirm = () => {
    if (!address) {
      Alert.alert("Error", "Please enter or select a location");
      return;
    }
    onSelect(address);
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={20} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {type === 'delivery' ? 'Set Delivery Location' : 'Set Pickup Location'}
          </Text>
          <View style={{ width: 32 }} /> 
        </View>

        {/* Mock Map */}
        <View style={styles.mapContainer}>
          <View style={styles.mapContent}>
            <MapPin size={48} color="#2563EB" />
            <Text style={styles.mapText}>Drag to set location</Text>
          </View>
          
          <TouchableOpacity 
            onPress={handleCurrentLocation}
            style={styles.gpsButton}
          >
            <Navigation size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Search Input */}
          <View style={styles.inputWrapper}>
            <MapPin size={20} color="#6B7280" style={styles.inputIcon} />
            <Input
              placeholder="Enter address..."
              value={address}
              onChangeText={setAddress} // Assuming your Input accepts onChangeText
              style={styles.inputOverride}
            />
          </View>

          {/* Saved Locations */}
          <View style={styles.savedSection}>
            <Text style={styles.sectionTitle}>Saved Locations</Text>
            {savedLocations.map((loc) => (
              <TouchableOpacity
                key={loc.id}
                onPress={() => setAddress(loc.address)}
                style={[
                  styles.locationItem,
                  address === loc.address ? styles.locationItemActive : styles.locationItemInactive
                ]}
              >
                <View style={styles.locationIcon}>
                  <MapPin size={16} color="#2563EB" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locName}>{loc.name}</Text>
                  <Text style={styles.locAddress}>{loc.address}</Text>
                </View>
                {address === loc.address && (
                  <Check size={20} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Confirm Button */}
          <Button 
            className="w-full mt-auto" 
            onPress={handleConfirm}
          >
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              Confirm {type === 'delivery' ? 'Delivery' : 'Pickup'} Location
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  closeBtn: { padding: 8, backgroundColor: "#F3F4F6", borderRadius: 8 },
  mapContainer: {
    height: 224,
    backgroundColor: "#EFF6FF",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  mapContent: { alignItems: "center" },
  mapText: { fontSize: 14, color: "#6B7280", marginTop: 8 },
  gpsButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  content: { padding: 16, flex: 1 },
  inputWrapper: { position: "relative", marginBottom: 24 },
  inputIcon: { position: "absolute", left: 12, top: 12, zIndex: 10 },
  inputOverride: { paddingLeft: 40 }, // Style prop to push text for icon
  savedSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: "500", color: "#6B7280", marginBottom: 12 },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 12,
  },
  locationItemActive: { borderColor: "#2563EB", backgroundColor: "#EFF6FF" },
  locationItemInactive: { borderColor: "#E5E7EB", backgroundColor: "#FFF" },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  locName: { fontWeight: "500", color: "#111827" },
  locAddress: { fontSize: 12, color: "#6B7280" },
});