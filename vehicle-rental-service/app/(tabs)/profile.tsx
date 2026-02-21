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
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { profileApi, UserProfile, UserStats } from "@/services/api";

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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load profile and stats in parallel
        const [profileData, statsData] = await Promise.all([
          profileApi.getUserProfile(),
          profileApi.getUserStats(),
        ]);
        
        setUserProfile(profileData);
        setUserStats(statsData);
      } catch (err) {
        console.error('Failed to load profile data:', err);
        setError('Failed to load profile data');
        Toast.show({
          type: "error",
          text1: "Failed to load profile data",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProfileData();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    Toast.show({
      type: "success",
      text1: "Logged out successfully",
    });
    router.replace("/Login");
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2dd4bf" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  if (error || !userProfile) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Profile data unavailable'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header - Teal Background */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
        </View>

        {/* Profile Card - Overlapping */}
        <View style={styles.profileCardContainer}>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(userProfile.first_name || userProfile.username)}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userProfile.first_name || userProfile.username}</Text>
                <Text style={styles.profileEmail}>{userProfile.email}</Text>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userStats?.total_bookings || 0}</Text>
                <Text style={styles.statLabel}>Total Booking</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>${userStats?.total_spent || 0}</Text>
                <Text style={styles.statLabel}>Total Spent</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userStats?.saved_places || 0}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#94a3b8", // Slate-400
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444", // Red-500
    textAlign: "center",
  },
});