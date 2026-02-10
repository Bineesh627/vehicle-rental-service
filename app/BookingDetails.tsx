import { Button } from "@/components/ui/button";
import { bookings } from "@/data/mockData";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { format } from "date-fns";
import {
  ArrowLeft,
  Bike,
  Calendar,
  Car,
  Clock,
  MapPin,
  Navigation,
  Phone,
} from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { UserStackParamList } from "../navigation/types";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function BookingDetails() {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();
  const { id } = (route.params as { id: string }) || {};

  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Booking not found</Text>
      </View>
    );
  }

  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "upcoming":
        return { bg: styles.statusBgUpcoming, text: styles.statusTextUpcoming };
      case "completed":
        return {
          bg: styles.statusBgCompleted,
          text: styles.statusTextCompleted,
        };
      case "cancelled":
        return {
          bg: styles.statusBgCancelled,
          text: styles.statusTextCancelled,
        };
      case "active":
        return { bg: styles.statusBgActive, text: styles.statusTextActive };
      default:
        return { bg: styles.statusBgUpcoming, text: styles.statusTextUpcoming };
    }
  };

  const statusStyle = getStatusStyles(booking.status);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={20} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Details</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
          {/* Status banner */}
          <View style={[styles.statusBanner, statusStyle.bg]}>
            <Text style={[styles.statusText, statusStyle.text]}>
              {booking.status === "upcoming"
                ? "🗓️ Upcoming Booking"
                : booking.status === "completed"
                  ? "✅ Completed"
                  : booking.status === "active"
                    ? "🚗 Active Rental"
                    : "❌ Cancelled"}
            </Text>
          </View>

          {/* Vehicle info */}
          <View style={styles.card}>
            <View style={styles.vehicleCardContent}>
              <Image
                source={{ uri: booking.vehicle.images[0] }}
                style={styles.vehicleImage}
              />
              <View style={styles.vehicleInfo}>
                <View style={styles.vehicleTypeContainer}>
                  {booking.vehicle.type === "car" ? (
                    <Car size={16} color="#1CBFA1" />
                  ) : (
                    <Bike size={16} color="#1CBFA1" />
                  )}
                  <Text style={styles.vehicleTypeLabel}>
                    {booking.vehicle.type.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.vehicleName}>{booking.vehicle.name}</Text>
                <Text style={styles.vehicleModel}>{booking.vehicle.model}</Text>
                <View style={styles.tagsContainer}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>
                      {booking.vehicle.transmission}
                    </Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>
                      {booking.vehicle.fuelType}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Date & Time */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            <View style={styles.scheduleContainer}>
              <View style={styles.scheduleRow}>
                <View style={styles.iconBoxPrimary}>
                  <Calendar size={20} color="#1CBFA1" />
                </View>
                <View style={styles.scheduleTextContainer}>
                  <Text style={styles.label}>Pickup Date</Text>
                  <Text style={styles.value}>
                    {format(startDate, "EEEE, MMMM d, yyyy")}
                  </Text>
                </View>
              </View>
              <View style={styles.scheduleRow}>
                <View style={styles.iconBoxPrimary}>
                  <Clock size={20} color="#1CBFA1" />
                </View>
                <View style={styles.scheduleTextContainer}>
                  <Text style={styles.label}>Pickup Time</Text>
                  <Text style={styles.value}>
                    {format(startDate, "h:mm a")}
                  </Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.scheduleRow}>
                <View style={styles.iconBoxSecondary}>
                  <Calendar size={20} color="#64748b" />
                </View>
                <View style={styles.scheduleTextContainer}>
                  <Text style={styles.label}>Return Date</Text>
                  <Text style={styles.value}>
                    {format(endDate, "EEEE, MMMM d, yyyy")}
                  </Text>
                </View>
              </View>
              <View style={styles.scheduleRow}>
                <View style={styles.iconBoxSecondary}>
                  <Clock size={20} color="#64748b" />
                </View>
                <View style={styles.scheduleTextContainer}>
                  <Text style={styles.label}>Return Time</Text>
                  <Text style={styles.value}>{format(endDate, "h:mm a")}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Pickup Location */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Pickup Location</Text>
            <View style={styles.shopContainer}>
              <Image
                source={{ uri: booking.shop.image }}
                style={styles.shopImage}
              />
              <View style={styles.shopInfo}>
                <Text style={styles.shopName}>{booking.shop.name}</Text>
                <View style={styles.addressRow}>
                  <MapPin size={14} color="#64748b" />
                  <Text style={styles.addressText} numberOfLines={1}>
                    {booking.shop.address}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.actionButtonsRow}>
              <View style={styles.actionButtonWrapper}>
                <Button variant="outline" size="sm" className="w-full flex-row">
                  <Phone size={16} color="#0f172a" style={{ marginRight: 8 }} />
                  <Text style={styles.actionButtonText}>Call Shop</Text>
                </Button>
              </View>
              <View style={styles.actionButtonGap} />
              <View style={styles.actionButtonWrapper}>
                <Button variant="outline" size="sm" className="w-full flex-row">
                  <Navigation
                    size={16}
                    color="#0f172a"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.actionButtonText}>Directions</Text>
                </Button>
              </View>
            </View>
          </View>

          {/* Payment Summary */}
          <View style={[styles.card, styles.lastCard]}>
            <Text style={styles.sectionTitle}>Payment Summary</Text>
            <View style={styles.paymentContainer}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Rental charges</Text>
                <Text style={styles.paymentValue}>
                  ${booking.totalPrice - 5}
                </Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Service fee</Text>
                <Text style={styles.paymentValue}>$5</Text>
              </View>
              <View style={[styles.divider, styles.paymentDivider]} />
              <View style={styles.paymentRow}>
                <Text style={styles.totalLabel}>Total Paid</Text>
                <Text style={styles.totalValue}>${booking.totalPrice}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom action */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          {booking.status === "upcoming" && (
            <>
              <View style={styles.footerButtonWrapper}>
                <Button variant="outline" className="w-full">
                  <Text style={styles.footerButtonTextOutline}>
                    Cancel Booking
                  </Text>
                </Button>
              </View>
              <View style={styles.actionButtonGap} />
              <View style={styles.footerButtonWrapper}>
                <Button className="w-full">
                  <Text style={styles.footerButtonTextPrimary}>
                    Modify Booking
                  </Text>
                </Button>
              </View>
            </>
          )}
          {booking.status === "completed" && (
            <Button
              className="w-full"
              onPress={() =>
                navigation.navigate("VehicleDetails", {
                  id: booking.vehicleId,
                })
              }
            >
              <Text style={styles.footerButtonTextPrimary}>Book Again</Text>
            </Button>
          )}
          {booking.status === "cancelled" && (
            <Button
              className="w-full"
              onPress={() =>
                navigation.navigate("VehicleDetails", {
                  id: booking.vehicleId,
                })
              }
            >
              <Text style={styles.footerButtonTextPrimary}>Rebook Vehicle</Text>
            </Button>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC", // --background
  },
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFBFC",
  },
  notFoundText: {
    color: "#64748b", // --muted-foreground
    fontSize: 16,
  },
  header: {
    backgroundColor: "rgba(255, 255, 255, 0.95)", // bg-card/95
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0", // --border
    zIndex: 40,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  backButton: {
    backgroundColor: "#F1F5F9", // --secondary
    padding: 10,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#020817", // --foreground
  },
  scrollContent: {
    paddingBottom: 100, // Space for fixed footer
  },
  mainContent: {
    padding: 16,
    gap: 24,
  },
  statusBanner: {
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 18,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  // Status Colors
  statusBgUpcoming: { backgroundColor: "rgba(28, 191, 161, 0.1)" }, // bg-primary/10
  statusTextUpcoming: { color: "#1CBFA1" }, // text-primary
  statusBgCompleted: { backgroundColor: "rgba(34, 197, 94, 0.1)" }, // bg-success/10
  statusTextCompleted: { color: "#22c55e" }, // text-success
  statusBgCancelled: { backgroundColor: "rgba(239, 68, 68, 0.1)" }, // bg-destructive/10
  statusTextCancelled: { color: "#ef4444" }, // text-destructive
  statusBgActive: { backgroundColor: "rgba(245, 158, 11, 0.1)" }, // bg-warning/10
  statusTextActive: { color: "#f59e0b" }, // text-warning

  card: {
    backgroundColor: "#FFFFFF", // bg-card
    borderRadius: 16,
    padding: 16, // p-4 or p-5
    // Shadow
    shadowColor: "#1CBFA1", // --shadow-card based color
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 6,
  },
  lastCard: {
    marginBottom: 0,
  },
  vehicleCardContent: {
    flexDirection: "row",
    gap: 16,
  },
  vehicleImage: {
    height: 112, // h-28
    width: 144, // w-36
    borderRadius: 12, // rounded-xl
    resizeMode: "cover",
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  vehicleTypeLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b", // text-muted-foreground
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#020817", // text-foreground
  },
  vehicleModel: {
    fontSize: 14,
    color: "#64748b", // text-muted-foreground
  },
  tagsContainer: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#F1F5F9", // bg-secondary
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    color: "#020817",
  },
  sectionTitle: {
    fontSize: 16, // text-base/lg
    fontWeight: "600",
    color: "#020817",
    marginBottom: 16,
  },
  scheduleContainer: {
    gap: 16,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  iconBoxPrimary: {
    backgroundColor: "rgba(28, 191, 161, 0.1)", // bg-primary/10
    padding: 12,
    borderRadius: 12,
  },
  iconBoxSecondary: {
    backgroundColor: "#F1F5F9", // bg-secondary
    padding: 12,
    borderRadius: 12,
  },
  scheduleTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
    color: "#64748b", // text-muted-foreground
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#020817", // text-foreground
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0", // bg-border
    marginVertical: 4,
  },
  shopContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  shopImage: {
    height: 64, // h-16
    width: 64, // w-16
    borderRadius: 12, // rounded-xl
    resizeMode: "cover",
  },
  shopInfo: {
    flex: 1,
    justifyContent: "center",
  },
  shopName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#020817",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#64748b",
    flex: 1,
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  actionButtonWrapper: {
    flex: 1,
  },
  actionButtonGap: {
    width: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
  },
  paymentContainer: {
    gap: 12,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#020817",
  },
  paymentDivider: {
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#020817",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1CBFA1", // text-primary
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)", // bg-card/95
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  footerButtonWrapper: {
    flex: 1,
  },
  footerButtonTextOutline: {
    fontSize: 16,
    color: "#0f172a",
    textAlign: "center",
    fontWeight: "500",
  },
  footerButtonTextPrimary: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "500",
  },
});
