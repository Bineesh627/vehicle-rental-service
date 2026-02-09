import React from "react";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from "react-native-maps";
import { StyleSheet, View, Text, Platform } from "react-native";
import { RentalShop } from "@/types"; // Ensure RentalShop type is available

interface MapViewProps {
  shops: RentalShop[];
  onShopClick: (shopId: string) => void;
}

export const NativeMapView = ({ shops, onShopClick }: MapViewProps) => {
  // Default region (could be passed in or calculated from shops)
  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={
          Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        }
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
      >
        {shops.map((shop) => (
          <Marker
            key={shop.id}
            coordinate={{
              latitude: shop.latitude || 37.78825, // Fallback if no lat provided
              longitude: shop.longitude || -122.4324, // Fallback
            }}
            title={shop.name}
            description={shop.address}
            onCalloutPress={() => onShopClick(shop.id)}
          />
        ))}
      </MapView>
      <View style={styles.overlay}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>
            {shops.length} rental shops nearby
          </Text>
        </View>
      </View>
    </View>
  );
};

// Export as MapView to match import expectations if possible, or update imports
export { NativeMapView as MapView };

const styles = StyleSheet.create({
  container: {
    height: 256, // h-64 equivalent
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: "center",
  },
  pill: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pillText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
});
