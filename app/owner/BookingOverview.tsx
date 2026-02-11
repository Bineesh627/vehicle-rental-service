import { useRouter } from "expo-router";
import { ArrowLeft, Calendar, Car, Clock, Eye, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Types
interface Booking {
  id: string;
  vehicleName: string;
  customerName: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: string;
  deliveryType: string;
  returnType: string;
}

// Theme Colors
const theme = {
  background: "#121214",
  card: "#1c1c1e",
  cardBorder: "#27272a",
  text: "#FFFFFF",
  textMuted: "#a1a1aa",
  primary: "#2dd4bf", // Teal
  primaryForeground: "#000000",
  secondary: "#27272a",
  destructive: "#ef4444",
  success: "#4ade80", // Green
  warning: "#fb923c", // Orange
  info: "#22d3ee", // Cyan
};

const mockBookings: Booking[] = [
  {
    id: "ob1",
    vehicleName: "Toyota Camry",
    customerName: "John Davis",
    customerPhone: "+1 555-1234",
    startDate: "2024-02-15T10:00:00",
    endDate: "2024-02-16T10:00:00",
    amount: 89,
    status: "active",
    deliveryType: "home-delivery",
    returnType: "schedule-pickup",
  },
  {
    id: "ob2",
    vehicleName: "Honda Civic",
    customerName: "Sarah Miller",
    customerPhone: "+1 555-5678",
    startDate: "2024-02-16T09:00:00",
    endDate: "2024-02-16T18:00:00",
    amount: 75,
    status: "pending",
    deliveryType: "self-pickup",
    returnType: "return-to-shop",
  },
  {
    id: "ob3",
    vehicleName: "BMW 3 Series",
    customerName: "Mike Ross",
    customerPhone: "+1 555-9012",
    startDate: "2024-02-10T09:00:00",
    endDate: "2024-02-12T09:00:00",
    amount: 398,
    status: "completed",
    deliveryType: "home-delivery",
    returnType: "schedule-pickup",
  },
  {
    id: "ob4",
    vehicleName: "Royal Enfield Classic",
    customerName: "Emily Chen",
    customerPhone: "+1 555-3456",
    startDate: "2024-02-08T10:00:00",
    endDate: "2024-02-08T18:00:00",
    amount: 45,
    status: "cancelled",
    deliveryType: "self-pickup",
    returnType: "return-to-shop",
  },
];

export default function BookingOverview() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredBookings = mockBookings.filter((b) => {
    if (activeTab === "all") return true;
    return b.status === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return theme.success;
      case "pending":
        return theme.warning;
      case "completed":
        return theme.primary;
      case "cancelled":
        return theme.destructive;
      default:
        return theme.textMuted;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "active":
        return "rgba(74, 222, 128, 0.1)";
      case "pending":
        return "rgba(251, 146, 60, 0.1)";
      case "completed":
        return "rgba(45, 212, 191, 0.1)";
      case "cancelled":
        return "rgba(239, 68, 68, 0.1)";
      default:
        return "rgba(255, 255, 255, 0.1)";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Overview</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{mockBookings.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: theme.success }]}>
                {mockBookings.filter((b) => b.status === "active").length}
              </Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: theme.warning }]}>
                {mockBookings.filter((b) => b.status === "pending").length}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                $
                {mockBookings
                  .filter((b) => b.status === "completed")
                  .reduce((sum, b) => sum + b.amount, 0)}
              </Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
          </View>

          {/* Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsScroll}
            contentContainerStyle={styles.tabsContainer}
          >
            {["all", "pending", "active", "completed", "cancelled"].map(
              (tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tab,
                    activeTab === tab ? styles.tabActive : styles.tabInactive,
                  ]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab
                        ? styles.tabTextActive
                        : styles.tabTextInactive,
                    ]}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </ScrollView>

          {/* Bookings List */}
          <View style={styles.bookingsList}>
            {filteredBookings.length === 0 ? (
              <View style={styles.emptyState}>
                <Calendar size={48} color={theme.textMuted} />
                <Text style={styles.emptyStateText}>No bookings found</Text>
              </View>
            ) : (
              filteredBookings.map((booking) => (
                <View key={booking.id} style={styles.bookingCard}>
                  <View style={styles.bookingHeader}>
                    <View style={styles.vehicleInfo}>
                      <Car
                        size={16}
                        color={theme.primary}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.vehicleName}>
                        {booking.vehicleName}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusBg(booking.status) },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(booking.status) },
                        ]}
                      >
                        {booking.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.bookingBody}>
                    <View style={styles.customerInfo}>
                      <Text style={styles.customerName}>
                        {booking.customerName}
                      </Text>
                      <View style={styles.dateRow}>
                        <Clock size={12} color={theme.textMuted} />
                        <Text style={styles.dateText}>
                          {formatDate(booking.startDate)} -{" "}
                          {formatDate(booking.endDate)}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.amountText,
                        { color: getStatusColor(booking.status) },
                      ]}
                    >
                      ${booking.amount}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => {
                      setSelectedBooking(booking);
                      setShowDetails(true);
                    }}
                  >
                    <Eye size={16} color={theme.primary} />
                    <Text style={styles.viewButtonText}>View</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Booking Details Modal */}
        <Modal
          visible={showDetails}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDetails(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Booking Details</Text>
                <TouchableOpacity onPress={() => setShowDetails(false)}>
                  <X size={24} color={theme.textMuted} />
                </TouchableOpacity>
              </View>

              {selectedBooking && (
                <View style={styles.detailsContainer}>
                  <View style={styles.vehicleDetailCard}>
                    <View style={styles.vehicleDetailHeader}>
                      <Car size={24} color={theme.primary} />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.detailVehicleName}>
                          {selectedBooking.vehicleName}
                        </Text>
                        <Text style={styles.detailBookingId}>
                          Booking #{selectedBooking.id}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: getStatusBg(
                              selectedBooking.status,
                            ),
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: getStatusColor(selectedBooking.status) },
                          ]}
                        >
                          {selectedBooking.status}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <View style={styles.detailBlock}>
                        <Text style={styles.detailLabel}>Customer</Text>
                        <Text style={styles.detailValue}>
                          {selectedBooking.customerName}
                        </Text>
                        <Text style={styles.detailSubValue}>
                          {selectedBooking.customerPhone}
                        </Text>
                      </View>
                      <View style={styles.detailBlock}>
                        <Text style={styles.detailLabel}>Amount</Text>
                        <Text
                          style={[
                            styles.detailValue,
                            { color: theme.success, fontSize: 18 },
                          ]}
                        >
                          ${selectedBooking.amount}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionTitle}>Schedule</Text>
                      <View style={styles.scheduleRow}>
                        <View>
                          <Text style={styles.detailLabel}>Start</Text>
                          <Text style={styles.detailValue}>
                            {formatDate(selectedBooking.startDate)}
                          </Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                          <Text style={styles.detailLabel}>End</Text>
                          <Text style={styles.detailValue}>
                            {formatDate(selectedBooking.endDate)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <View style={styles.detailBlock}>
                        <Text style={styles.detailLabel}>Delivery</Text>
                        <Text style={styles.detailValueCapitalize}>
                          {selectedBooking.deliveryType.replace("-", " ")}
                        </Text>
                      </View>
                      <View style={styles.detailBlock}>
                        <Text style={styles.detailLabel}>Return</Text>
                        <Text style={styles.detailValueCapitalize}>
                          {selectedBooking.returnType.replace("-", " ")}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
  },
  iconButton: {
    padding: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textMuted,
  },
  tabsScroll: {
    marginBottom: 16,
    flexGrow: 0,
  },
  tabsContainer: {
    gap: 8,
    paddingRight: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabActive: {
    backgroundColor: theme.card,
    borderColor: theme.cardBorder,
  },
  tabInactive: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  tabTextActive: {
    color: theme.text,
  },
  tabTextInactive: {
    color: theme.textMuted,
  },
  bookingsList: {
    gap: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.cardBorder,
  },
  emptyStateText: {
    marginTop: 12,
    color: theme.textMuted,
  },
  bookingCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    padding: 16,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  vehicleInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  bookingBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    color: theme.textMuted,
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: theme.textMuted,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 24, // High radius for pill shape
    borderWidth: 1,
    borderColor: theme.primary,
    gap: 6,
  },
  viewButtonText: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: theme.background,
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.cardBorder,
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
    color: theme.text,
  },
  detailsContainer: {
    gap: 16,
  },
  vehicleDetailCard: {
    gap: 16,
  },
  vehicleDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.cardBorder,
  },
  detailVehicleName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.text,
  },
  detailBookingId: {
    fontSize: 12,
    color: theme.textMuted,
  },
  detailRow: {
    flexDirection: "row",
    gap: 12,
  },
  detailBlock: {
    flex: 1,
    padding: 12,
    backgroundColor: theme.secondary,
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: theme.textMuted,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.text,
  },
  detailSubValue: {
    fontSize: 12,
    color: theme.textMuted,
  },
  detailValueCapitalize: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.text,
    textTransform: "capitalize",
  },
  detailSection: {
    padding: 12,
    backgroundColor: theme.secondary,
    borderRadius: 8,
  },
  detailSectionTitle: {
    fontSize: 12,
    color: theme.textMuted,
    marginBottom: 8,
  },
  scheduleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
