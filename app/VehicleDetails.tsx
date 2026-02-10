import { Button } from "@/components/ui/button";
import { rentalShops, vehicles } from "@/data/mockData";
import { UserStackParamList } from "@/navigation/types";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  ArrowLeft,
  Bike,
  Calendar,
  Car,
  Check,
  Clock,
  Fuel,
  Heart,
  Settings2,
  Share2,
  Users,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function VehicleDetails() {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();
  const { id } = (route.params as { id: string }) || {};
  const insets = useSafeAreaInsets();

  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [pricingType, setPricingType] = useState<"hour" | "day">("hour");

  const vehicle = vehicles.find((v) => v.id === id);
  const shop = vehicle
    ? rentalShops.find((s) => s.id === vehicle.shopId)
    : null;

  if (!vehicle || !shop) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Vehicle not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Gallery */}
        <View style={styles.imageGalleryContainer}>
          <Image
            source={{ uri: vehicle.images[activeImageIndex] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          {/* Gradient Overlay Simulation */}
          <View style={styles.gradientOverlay} />

          {/* Header actions */}
          <View
            style={[styles.headerActionsContainer, { paddingTop: insets.top }]}
          >
            <View style={styles.headerActionsContent}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.iconButton}
              >
                <ArrowLeft size={20} color="#ffffff" />
              </TouchableOpacity>
              <View style={styles.headerRightActions}>
                <TouchableOpacity
                  onPress={() => setIsFavorite(!isFavorite)}
                  style={styles.iconButton}
                >
                  <Heart
                    size={20}
                    color={isFavorite ? "#ef4444" : "#ffffff"}
                    fill={isFavorite ? "#ef4444" : "transparent"}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Share2 size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Image indicators */}
          {vehicle.images.length > 1 && (
            <View style={styles.indicatorsContainer}>
              {vehicle.images.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setActiveImageIndex(index)}
                  style={[
                    styles.indicator,
                    index === activeImageIndex
                      ? styles.indicatorActive
                      : styles.indicatorInactive,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Type badge */}
          <View style={[styles.typeBadgeContainer, { top: insets.top + 60 }]}>
            <View style={styles.typeBadge}>
              {vehicle.type === "car" ? (
                <Car size={16} color="#ffffff" />
              ) : (
                <Bike size={16} color="#ffffff" />
              )}
              <Text style={styles.typeBadgeText}>{vehicle.type}</Text>
            </View>
          </View>
        </View>

        {/* Vehicle Info */}
        <View style={styles.infoSectionContainer}>
          <View style={styles.card}>
            <View style={styles.availabilityBadgeContainer}>
              <View
                style={[
                  styles.availabilityBadge,
                  vehicle.isAvailable
                    ? styles.badgeSuccess
                    : styles.badgeDestructive,
                ]}
              >
                <Text
                  style={[
                    styles.availabilityText,
                    vehicle.isAvailable
                      ? styles.textSuccess
                      : styles.textDestructive,
                  ]}
                >
                  {vehicle.isAvailable ? "Available" : "Currently Booked"}
                </Text>
              </View>
              <Text style={styles.vehicleTitle}>{vehicle.name}</Text>
              <Text style={styles.vehicleModel}>{vehicle.model}</Text>
              {vehicle.vehicleNumber && (
                <Text style={styles.vehicleNumber}>
                  {vehicle.vehicleNumber}
                </Text>
              )}
            </View>

            {/* Specs */}
            {/* Specs */}
            <View style={styles.specsGrid}>
              <View style={styles.specItem}>
                <Fuel size={20} color="#22d3ee" style={styles.specIcon} />
                <Text
                  style={styles.specValue}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {vehicle.fuelType}
                </Text>
                <Text
                  style={styles.specLabel}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  Fuel
                </Text>
              </View>
              <View style={styles.specItem}>
                <Settings2 size={20} color="#22d3ee" style={styles.specIcon} />
                <Text
                  style={styles.specValue}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {vehicle.transmission}
                </Text>
                <Text
                  style={styles.specLabel}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  Transmission
                </Text>
              </View>
              {vehicle.seating && (
                <View style={styles.specItem}>
                  <Users size={20} color="#22d3ee" style={styles.specIcon} />
                  <Text
                    style={styles.specValue}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {vehicle.seating} Seats
                  </Text>
                  <Text
                    style={styles.specLabel}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    Capacity
                  </Text>
                </View>
              )}
            </View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.featuresList}>
                {vehicle.features.map((feature) => (
                  <View key={feature} style={styles.featureBadge}>
                    <Check size={14} color="#22d3ee" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Shop info */}
            <View style={styles.shopInfoContainer}>
              <Text style={styles.shopLabel}>Available at</Text>
              <Text style={styles.shopName}>{shop.name}</Text>
              <Text style={styles.shopAddress}>{shop.address}</Text>
            </View>
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.pricingSection}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Pricing</Text>
            <View style={styles.pricingOptionsContainer}>
              <TouchableOpacity
                onPress={() => setPricingType("hour")}
                style={[
                  styles.pricingOption,
                  pricingType === "hour"
                    ? styles.pricingOptionActive
                    : styles.pricingOptionInactive,
                ]}
              >
                <Clock
                  size={20}
                  color={pricingType === "hour" ? "#22d3ee" : "#94a3b8"}
                  style={styles.pricingIcon}
                />
                <Text
                  style={[
                    styles.pricingPrice,
                    pricingType === "hour"
                      ? styles.textPrimary
                      : styles.textForeground,
                  ]}
                >
                  ${vehicle.pricePerHour}
                </Text>
                <Text style={styles.pricingPeriod}>per hour</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPricingType("day")}
                style={[
                  styles.pricingOption,
                  pricingType === "day"
                    ? styles.pricingOptionActive
                    : styles.pricingOptionInactive,
                ]}
              >
                <Calendar
                  size={20}
                  color={pricingType === "day" ? "#22d3ee" : "#94a3b8"}
                  style={styles.pricingIcon}
                />
                <Text
                  style={[
                    styles.pricingPrice,
                    pricingType === "day"
                      ? styles.textPrimary
                      : styles.textForeground,
                  ]}
                >
                  ${vehicle.pricePerDay}
                </Text>
                <Text style={styles.pricingPeriod}>per day</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom action */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.footerLabel}>
              {pricingType === "hour" ? "Per hour" : "Per day"}
            </Text>
            <View style={styles.footerPriceContainer}>
              <Text style={styles.footerPriceValue}>
                $
                {pricingType === "hour"
                  ? vehicle.pricePerHour
                  : vehicle.pricePerDay}
              </Text>
              <Text style={styles.footerPriceValue}>
                {pricingType === "hour" ? "/hr" : "/day"}
              </Text>
            </View>
          </View>
          <View style={styles.footerButtonContainer}>
            <Button
              size="lg"
              disabled={!vehicle.isAvailable}
              onPress={() =>
                navigation.navigate("Booking", {
                  id: vehicle.id,
                  type: pricingType,
                })
              }
              className="w-full"
            >
              <Text style={styles.buttonText}>
                {vehicle.isAvailable ? "Book Now" : "Not Available"}
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // Dark background
  },
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
  },
  notFoundText: {
    color: "#94a3b8", // Slate-400
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  imageGalleryContainer: {
    height: 300,
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    backgroundColor: "transparent",
    // In a real app we'd use LinearGradient here to fade to #0f172a
  },
  headerActionsContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 20,
    // Top padding will be applied via inline style using insets
  },
  headerActionsContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  iconButton: {
    backgroundColor: "rgba(15, 23, 42, 0.6)", // Dark transparent
    padding: 10,
    borderRadius: 50, // Circular
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
  },
  headerRightActions: {
    flexDirection: "row",
    gap: 12,
  },
  indicatorsContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  indicator: {
    height: 6,
    borderRadius: 9999,
  },
  indicatorActive: {
    width: 24,
    backgroundColor: "#22d3ee", // Cyan-400
  },
  indicatorInactive: {
    width: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  typeBadgeContainer: {
    position: "absolute",
    left: 16,
    // Top position will be adjusted dynamically or relative to header
    zIndex: 15,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(15, 23, 42, 0.8)", // Dark backdrop
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
  },
  typeBadgeText: {
    fontSize: 14,
    fontWeight: "500",
    textTransform: "capitalize",
    color: "#ffffff",
  },
  infoSectionContainer: {
    paddingHorizontal: 16,
    marginTop: -30,
    zIndex: 10,
    position: "relative",
  },
  card: {
    backgroundColor: "#1e293b", // Slate-800
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  availabilityBadgeContainer: {
    alignItems: "flex-start",
    marginBottom: 12,
  },
  availabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    marginBottom: 8,
  },
  badgeSuccess: {
    backgroundColor: "rgba(34, 211, 238, 0.15)", // Cyan tint
  },
  badgeDestructive: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: "600",
  },
  textSuccess: {
    color: "#22d3ee", // Cyan-400
  },
  textDestructive: {
    color: "#ef4444",
  },
  vehicleTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  vehicleModel: {
    fontSize: 16,
    color: "#94a3b8", // Slate-400
  },
  vehicleNumber: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
    marginTop: 4,
  },
  specsGrid: {
    marginTop: 24,
    flexDirection: "row",
    gap: 12,
  },
  specItem: {
    flex: 1,
    backgroundColor: "#0f172a", // Darker slot
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155", // Slate-700
  },
  specIcon: {
    marginBottom: 8,
  },
  specValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    marginTop: 4,
  },
  specLabel: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
  },
  featuresContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 16,
  },
  featuresList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  featureBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#334155", // Slate-700
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  featureText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#22d3ee", // Cyan-400
  },
  shopInfoContainer: {
    marginTop: 24,
    backgroundColor: "#0f172a", // Dark details
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 16,
  },
  shopLabel: {
    fontSize: 12,
    color: "#94a3b8",
  },
  shopName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginTop: 4,
  },
  shopAddress: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 2,
  },
  pricingSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  pricingOptionsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  pricingOption: {
    flex: 1,
    backgroundColor: "#1e293b", // Slate-800
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#334155",
  },
  pricingOptionActive: {
    borderColor: "#22d3ee", // Cyan-400
    backgroundColor: "rgba(34, 211, 238, 0.05)",
  },
  pricingOptionInactive: {
    borderColor: "#334155",
    backgroundColor: "#1e293b",
  },
  pricingIcon: {
    marginBottom: 8,
  },
  pricingPrice: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  textPrimary: {
    color: "#22d3ee",
  },
  textForeground: {
    color: "#ffffff",
  },
  pricingPeriod: {
    fontSize: 14,
    color: "#94a3b8",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1e293b", // Slate-800
    borderTopWidth: 1,
    borderTopColor: "#334155",
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    maxWidth: 448,
    alignSelf: "center",
    width: "100%",
  },
  footerLabel: {
    fontSize: 14,
    color: "#94a3b8",
  },
  footerPriceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  footerPriceValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#22d3ee", // Cyan-400
    marginTop: 4,
  },
  footerButtonContainer: {
    flex: 1,
  },
  buttonText: {
    color: "#0f172a", // Dark text on Cyan button
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
