import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// FIX 1: Use safe-area-context instead of react-native's SafeAreaView
import { UserStackParamList } from "@/navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Smartphone,
  Truck,
  Wallet,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Ensure these paths are correct in your project
import { Button } from "@/components/ui/button";
import { DeliveryLocationSelector } from "@/components/user/DeliveryLocationSelector";
import { rentalShops, vehicles } from "@/data/mockData";
import { useRouter } from "expo-router";

type PaymentMethod = "card" | "upi" | "wallet";
type DeliveryOption = "self" | "delivery";
type PickupOption = "self" | "pickup";

// FIX 2: Changed to default export function
export default function Booking() {
  const navigation = useNavigation();
  const router = useRouter();
  const route = useRoute<RouteProp<UserStackParamList, "Booking">>();

  const { id, type } = route.params;
  const bookingType = type === "day" ? "day" : "hour";

  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [duration, setDuration] = useState(bookingType === "day" ? 1 : 4);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>("self");
  const [pickupOption, setPickupOption] = useState<PickupOption>("self");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [showDeliverySelector, setShowDeliverySelector] = useState(false);
  const [showPickupSelector, setShowPickupSelector] = useState(false);

  const vehicle = vehicles.find((v) => v.id === id);
  const shop = vehicle
    ? rentalShops.find((s) => s.id === vehicle.shopId)
    : null;

  if (!vehicle || !shop) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.mutedText}>Vehicle not found</Text>
      </View>
    );
  }

  const pricePerUnit =
    bookingType === "day" ? vehicle.pricePerDay : vehicle.pricePerHour;
  const deliveryFee = deliveryOption === "delivery" ? 10 : 0;
  const pickupFee = pickupOption === "pickup" ? 10 : 0;
  const serviceFee = 5;
  const totalPrice =
    pricePerUnit * duration + deliveryFee + pickupFee + serviceFee;

  const dates = ["Today", "Tomorrow", "Wed, 5 Feb", "Thu, 6 Feb"];
  const times = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "2:00 PM",
    "4:00 PM",
  ];

  const handleConfirmBooking = () => {
    if (deliveryOption === "delivery" && !deliveryAddress) {
      Alert.alert("Error", "Please set a delivery location");
      return;
    }
    if (pickupOption === "pickup" && !pickupAddress) {
      Alert.alert("Error", "Please set a pickup location");
      return;
    }

    Alert.alert(
      "Booking confirmed!",
      `Your ${vehicle.name} is booked for ${duration} ${bookingType === "day" ? (duration === 1 ? "day" : "days") : duration === 1 ? "hour" : "hours"}`,
      [{ text: "OK", onPress: () => router.replace("/(tabs)/bookings") }],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Vehicle</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Vehicle summary */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Image
              source={{ uri: vehicle.images[0] }}
              style={styles.vehicleImage}
            />
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>{vehicle.name}</Text>
              <Text style={styles.mutedText}>{vehicle.model}</Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color="#6B7280" />
                <Text style={styles.locationText}>{shop.name}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Date selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Select Date</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipContainer}
          >
            {dates.map((date) => (
              <TouchableOpacity
                key={date}
                onPress={() => setSelectedDate(date)}
                style={[
                  styles.chip,
                  selectedDate === date
                    ? styles.chipActive
                    : styles.chipInactive,
                ]}
              >
                <Text
                  style={
                    selectedDate === date
                      ? styles.chipTextActive
                      : styles.chipTextInactive
                  }
                >
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Select Time</Text>
          </View>
          <View style={styles.grid}>
            {times.map((time) => (
              <TouchableOpacity
                key={time}
                onPress={() => setSelectedTime(time)}
                style={[
                  styles.gridItem,
                  selectedTime === time
                    ? styles.chipActive
                    : styles.chipInactive,
                ]}
              >
                <Text
                  style={
                    selectedTime === time
                      ? styles.chipTextActive
                      : styles.chipTextInactive
                  }
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            {bookingType === "day" ? (
              <Calendar size={20} color="#2563EB" />
            ) : (
              <Clock size={20} color="#2563EB" />
            )}
            <Text style={styles.sectionTitle}>
              Duration ({bookingType === "day" ? "days" : "hours"})
            </Text>
          </View>
          <View style={styles.durationControl}>
            <TouchableOpacity
              onPress={() => setDuration(Math.max(1, duration - 1))}
              style={styles.counterButton}
            >
              <Text style={styles.counterButtonText}>−</Text>
            </TouchableOpacity>
            <View style={styles.durationDisplay}>
              <Text style={styles.durationValue}>{duration}</Text>
              <Text style={styles.mutedText}>
                {bookingType === "day"
                  ? duration === 1
                    ? "day"
                    : "days"
                  : duration === 1
                    ? "hour"
                    : "hours"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setDuration(duration + 1)}
              style={styles.counterButton}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentContainer}>
            {[
              {
                id: "card" as const,
                icon: CreditCard,
                label: "Credit / Debit Card",
              },
              { id: "upi" as const, icon: Smartphone, label: "UPI Payment" },
              { id: "wallet" as const, icon: Wallet, label: "Digital Wallet" },
            ].map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => setPaymentMethod(method.id)}
                style={[
                  styles.paymentOption,
                  paymentMethod === method.id
                    ? styles.paymentOptionActive
                    : styles.paymentOptionInactive,
                ]}
              >
                <View
                  style={[
                    styles.paymentIconBox,
                    paymentMethod === method.id
                      ? styles.bgPrimary
                      : styles.bgSecondary,
                  ]}
                >
                  <method.icon
                    size={20}
                    color={paymentMethod === method.id ? "#FFF" : "#6B7280"}
                  />
                </View>
                <Text style={styles.paymentLabel}>{method.label}</Text>
                <View
                  style={[
                    styles.radioOuter,
                    paymentMethod === method.id
                      ? styles.borderPrimary
                      : styles.borderGray,
                  ]}
                >
                  {paymentMethod === method.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Delivery Option */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Truck size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Vehicle Delivery</Text>
          </View>
          <View style={styles.grid}>
            <TouchableOpacity
              onPress={() => setDeliveryOption("self")}
              style={[
                styles.gridItemHalf,
                deliveryOption === "self"
                  ? styles.chipActive
                  : styles.chipInactive,
              ]}
            >
              <Text
                style={
                  deliveryOption === "self"
                    ? styles.chipTextActive
                    : styles.chipTextInactive
                }
              >
                Self Pickup
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDeliveryOption("delivery");
                if (!deliveryAddress) setShowDeliverySelector(true);
              }}
              style={[
                styles.gridItemHalf,
                deliveryOption === "delivery"
                  ? styles.chipActive
                  : styles.chipInactive,
              ]}
            >
              <Text
                style={
                  deliveryOption === "delivery"
                    ? styles.chipTextActive
                    : styles.chipTextInactive
                }
              >
                Home Delivery (+$10)
              </Text>
            </TouchableOpacity>
          </View>

          {deliveryOption === "delivery" && (
            <TouchableOpacity
              onPress={() => setShowDeliverySelector(true)}
              style={styles.locationSelectorBtn}
            >
              <MapPin size={20} color="#2563EB" />
              <Text style={styles.locationSelectorText}>
                {deliveryAddress || "Set delivery location..."}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Pickup Option */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Package size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Vehicle Return</Text>
          </View>
          <View style={styles.grid}>
            <TouchableOpacity
              onPress={() => setPickupOption("self")}
              style={[
                styles.gridItemHalf,
                pickupOption === "self"
                  ? styles.chipActive
                  : styles.chipInactive,
              ]}
            >
              <Text
                style={
                  pickupOption === "self"
                    ? styles.chipTextActive
                    : styles.chipTextInactive
                }
              >
                Return to Shop
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setPickupOption("pickup");
                if (!pickupAddress) setShowPickupSelector(true);
              }}
              style={[
                styles.gridItemHalf,
                pickupOption === "pickup"
                  ? styles.chipActive
                  : styles.chipInactive,
              ]}
            >
              <Text
                style={
                  pickupOption === "pickup"
                    ? styles.chipTextActive
                    : styles.chipTextInactive
                }
              >
                Schedule Pickup (+$10)
              </Text>
            </TouchableOpacity>
          </View>

          {pickupOption === "pickup" && (
            <TouchableOpacity
              onPress={() => setShowPickupSelector(true)}
              style={styles.locationSelectorBtn}
            >
              <MapPin size={20} color="#2563EB" />
              <Text style={styles.locationSelectorText}>
                {pickupAddress || "Set pickup location..."}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Price summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.mutedText}>
              ${pricePerUnit} × {duration}{" "}
              {bookingType === "day"
                ? duration === 1
                  ? "day"
                  : "days"
                : duration === 1
                  ? "hour"
                  : "hours"}
            </Text>
            <Text style={styles.summaryValue}>${pricePerUnit * duration}</Text>
          </View>
          {deliveryFee > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.mutedText}>Delivery fee</Text>
              <Text style={styles.summaryValue}>${deliveryFee}</Text>
            </View>
          )}
          {pickupFee > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.mutedText}>Pickup fee</Text>
              <Text style={styles.summaryValue}>${pickupFee}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.mutedText}>Service fee</Text>
            <Text style={styles.summaryValue}>${serviceFee}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totalPrice}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom action */}
      <View style={styles.bottomBar}>
        <Button className="w-full" onPress={handleConfirmBooking}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Confirm Booking • ${totalPrice}
          </Text>
        </Button>
      </View>

      <DeliveryLocationSelector
        visible={showDeliverySelector}
        type="delivery"
        currentAddress={deliveryAddress}
        onSelect={(address) => {
          setDeliveryAddress(address);
          setShowDeliverySelector(false);
        }}
        onClose={() => setShowDeliverySelector(false)}
      />

      <DeliveryLocationSelector
        visible={showPickupSelector}
        type="pickup"
        currentAddress={pickupAddress}
        onSelect={(address) => {
          setPickupAddress(address);
          setShowPickupSelector(false);
        }}
        onClose={() => setShowPickupSelector(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
    color: "#111827",
  },
  backButton: { padding: 10, borderRadius: 12, backgroundColor: "#F3F4F6" },
  scrollContent: { padding: 16 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  row: { flexDirection: "row", gap: 16 },
  vehicleImage: {
    width: 100,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },
  vehicleInfo: { flex: 1 },
  vehicleName: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  mutedText: { fontSize: 14, color: "#6B7280" },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  locationText: { fontSize: 12, color: "#6B7280" },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  chipContainer: { flexDirection: "row", gap: 8 },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginRight: 8,
  },
  chipActive: { backgroundColor: "#2563EB" },
  chipInactive: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  chipTextActive: { color: "#FFF", fontWeight: "600", fontSize: 14 },
  chipTextInactive: { color: "#6B7280", fontWeight: "500", fontSize: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  gridItem: {
    width: "31%",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  gridItemHalf: {
    width: "48%",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  durationControl: { flexDirection: "row", alignItems: "center", gap: 16 },
  counterButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
  },
  counterButtonText: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  durationDisplay: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  durationValue: { fontSize: 24, fontWeight: "bold", color: "#2563EB" },
  paymentContainer: { gap: 8 },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFF",
  },
  paymentOptionActive: { borderColor: "#2563EB", backgroundColor: "#EFF6FF" },
  paymentOptionInactive: { borderColor: "#E5E7EB" },
  paymentIconBox: { padding: 8, borderRadius: 8, marginRight: 12 },
  bgPrimary: { backgroundColor: "#2563EB" },
  bgSecondary: { backgroundColor: "#F3F4F6" },
  paymentLabel: { flex: 1, fontWeight: "500", color: "#111827" },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  borderPrimary: { borderColor: "#2563EB", backgroundColor: "#2563EB" },
  borderGray: { borderColor: "#E5E7EB" },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#FFF" },
  locationSelectorBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    marginTop: 12,
  },
  locationSelectorText: { marginLeft: 12, fontSize: 14, color: "#111827" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryValue: { fontWeight: "500", color: "#111827" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 12 },
  totalLabel: { fontSize: 18, fontWeight: "600", color: "#111827" },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "#2563EB" },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
});
