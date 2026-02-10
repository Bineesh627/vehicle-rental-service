import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import {
  Bell,
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
  MapPin,
  Settings,
  Shield,
  User,
} from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const menuItems = [
  { icon: User, label: "Edit Profile", path: "EditProfile" },
  { icon: FileText, label: "KYC Verification", path: "KYCVerification" },
  { icon: MapPin, label: "Saved Locations", path: "SavedLocations" },
  { icon: CreditCard, label: "Payment Methods", path: "PaymentMethods" },
  { icon: Bell, label: "Notifications", path: "Notifications" },
  { icon: Settings, label: "Settings", path: "Settings" },
  { icon: HelpCircle, label: "Help & Support", path: "HelpSupport" },
  { icon: Shield, label: "Privacy & Security", path: "PrivacySecurity" },
];

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    await logout();
    Toast.show({
      type: "success",
      text1: "Logged out successfully",
    });
    router.replace("/Login");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header - Teal Background */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Profile</Text>
            {/* Dark mode toggle removed */}
          </View>
        </View>

        {/* Profile Card - Overlapping */}
        <View style={styles.profileCardContainer}>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>John Doe</Text>
                <Text style={styles.profileEmail}>john.doe@example.com</Text>
                {/* Rating container removed */}
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Total Booking</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>$456</Text>
                <Text style={styles.statLabel}>Total Spent</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>Saved Places</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <View style={styles.menuList}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => router.push(`/user/${item.path}` as any)}
                style={[
                  styles.menuItem,
                  index === menuItems.length - 1 && styles.menuItemLast,
                ]}
              >
                <View style={styles.menuIconContainer}>
                  <item.icon color="#2dd4bf" size={20} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <ChevronRight color="#64748b" size={20} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <LogOut color="#ef4444" size={20} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // Dark background
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: "#2dd4bf", // Teal Header
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80, // Extra padding for overlap
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Changed to center since button is gone
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a", // Dark text on Teal
  },
  profileCardContainer: {
    paddingHorizontal: 16,
    marginTop: -60, // Overlap effect
  },
  profileCard: {
    backgroundColor: "#1e293b", // Slate-800
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#334155",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 20,
    backgroundColor: "#f97316", // Orange-500
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center", // Added to vertically center name/email
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  profileEmail: {
    fontSize: 14,
    color: "#94a3b8", // Slate-400
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  statItem: {
    flex: 1,
    backgroundColor: "#283445", // Slightly lighter/different slate for boxes
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2dd4bf", // Teal
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#94a3b8", // Slate-400
  },
  menuContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  menuList: {
    backgroundColor: "#1e293b", // Slate-800
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#334155",
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#334155", // Slate-700
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconContainer: {
    height: 40,
    width: 40,
    borderRadius: 12,
    backgroundColor: "#334155", // Slate-700
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
  },
  logoutContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ef4444", // Red-500
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
  },
  versionText: {
    textAlign: "center",
    color: "#64748b", // Slate-500
    marginTop: 24,
    fontSize: 12,
  },
});