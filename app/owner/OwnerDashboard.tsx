import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  Store, 
  Car, 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  ChevronRight, 
  Star, 
  User 
} from 'lucide-react-native';
import { useRouter } from "expo-router";

// --- Mocks for missing external dependencies to ensure self-contained file ---

// Mock Auth Context
const useAuth = () => ({
  user: { name: "John Owner" },
  logout: () => console.log("Logout"),
});

// --- End Mocks ---

// Theme Colors derived from screenshots
const theme = {
  background: '#121214', // Very dark background
  card: '#1c1c1e',       // Dark grey card
  cardBorder: '#2c2c2e', // Subtle border
  text: '#FFFFFF',
  textMuted: '#A1A1AA',
  primary: '#2dd4bf',    // Teal accent for buttons/active text
  secondary: '#27272a',  // List item background
  border: '#27272a',
  
  // Stat specific colors
  revenue: '#4ade80',    // Green
  bookings: '#22d3ee',   // Cyan
  vehicles: '#c084fc',   // Purple
  staff: '#fb923c',      // Orange
};

const stats = [
  { label: "Total Revenue", value: "$12,847", change: "+18%", icon: DollarSign, color: theme.revenue },
  { label: "Active Bookings", value: "34", change: "+5%", icon: Calendar, color: theme.bookings },
  { label: "Total Vehicles", value: "48", change: "+2", icon: Car, color: theme.vehicles },
  { label: "Staff Members", value: "8", change: "-", icon: Users, color: theme.staff },
];

const shops = [
  { id: "1", name: "SpeedWheels Downtown", vehicles: 15, bookings: 12, rating: 4.8 },
  { id: "2", name: "SpeedWheels Midtown", vehicles: 20, bookings: 18, rating: 4.6 },
  { id: "3", name: "SpeedWheels Airport", vehicles: 13, bookings: 4, rating: 4.9 },
];

const recentBookings = [
  { id: "1", vehicle: "Toyota Camry", customer: "John D.", status: "Active", amount: "$89" },
  { id: "2", vehicle: "Honda Activa", customer: "Sarah M.", status: "Pending Pickup", amount: "$30" },
  { id: "3", vehicle: "BMW 3 Series", customer: "Mike R.", status: "Completed", amount: "$199" },
];

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    // navigation.navigate('Login'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.storeIconContainer}>
              <Store size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Owner Dashboard</Text>
              <Text style={styles.headerSubtitle}>{user?.name}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.ghostButtonSm} 
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.ghostButtonIcon} 
              onPress={() =>  router.push("/owner/OwnerProfile")}
            >
              <User size={20} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.main}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <View key={stat.label} style={styles.statCardWrapper}>
                <View style={[styles.card, styles.statCard]}>
                  <View style={styles.statContent}>
                    <View style={styles.statHeader}>
                      <Icon size={22} color={stat.color} />
                      {stat.change !== "-" && (
                        <View style={styles.trendContainer}>
                          <TrendingUp size={14} color={stat.color} />
                          <Text style={[styles.trendText, { color: stat.color }]}>{stat.change}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* My Shops */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderContent}>
              <Text style={styles.cardTitle}>My Rental Shops</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push("/owner/ShopManagement")}
              >
                <Plus size={16} color={theme.primary} />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.shopList}>
            {shops.map((shop) => (
              <TouchableOpacity
                key={shop.id}
                style={styles.shopItem}
                onPress={() => router.push("/owner/ShopManagement")}
              >
                <View style={styles.shopInfo}>
                  <Text style={styles.shopName}>{shop.name}</Text>
                  <View style={styles.shopStats}>
                    <Text style={styles.shopStatText}>{shop.vehicles} vehicles</Text>
                    <Text style={styles.shopStatText}>{shop.bookings} bookings</Text>
                    <View style={styles.ratingContainer}>
                      <Star size={12} color="#eab308" fill="#eab308" />
                      <Text style={styles.shopStatText}>{shop.rating}</Text>
                    </View>
                  </View>
                </View>
                <ChevronRight size={16} color={theme.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Bookings */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderContent}>
              <Text style={styles.cardTitle}>Recent Bookings</Text>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() =>  router.push("/owner/BookingOverview")}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight size={16} color={theme.primary} style={styles.viewAllIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.bookingList}>
            {recentBookings.map((booking) => (
              <View key={booking.id} style={styles.bookingItem}>
                <View>
                  <Text style={styles.bookingVehicle}>{booking.vehicle}</Text>
                  <Text style={styles.bookingCustomer}>{booking.customer}</Text>
                </View>
                <View style={styles.bookingRight}>
                  <Text style={styles.bookingAmount}>{booking.amount}</Text>
                  <Text style={[
                    styles.bookingStatus,
                    booking.status === 'Active' ? styles.statusActive :
                    booking.status === 'Pending Pickup' ? styles.statusPending :
                    styles.statusMuted
                  ]}>
                    {booking.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsGrid}>
          <View style={styles.actionButtonWrapper}>
            <TouchableOpacity
              style={[styles.actionButton, styles.buttonOutline]}
              onPress={() => router.push("/owner/VehicleManagement")}
            >
              <Car size={20} color={theme.primary} />
              <Text style={styles.actionButtonText}>Manage Vehicles</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionButtonWrapper}>
            <TouchableOpacity
              style={[styles.actionButton, styles.buttonOutline]}
              onPress={() => router.push("/owner/StaffManagement")}
            >
              <Users size={20} color={theme.primary} />
              <Text style={styles.actionButtonText}>Manage Staff</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    backgroundColor: theme.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.cardBorder,
    zIndex: 40,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  storeIconContainer: {
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24, // Circle
    backgroundColor: '#a855f7', // Keep the purple brand color
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.textMuted,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ghostButtonIcon: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostButtonSm: {
    paddingHorizontal: 0,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 14,
    color: theme.text,
    fontWeight: '600',
  },
  main: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statCardWrapper: {
    width: '50%',
    padding: 8,
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    overflow: 'hidden',
  },
  statCard: {
    height: 120, // Fixed height for uniformity
  },
  statContent: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    color: theme.textMuted,
  },
  cardHeader: {
    paddingBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cardHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  shopList: {
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  shopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.secondary,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  shopStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shopStatText: {
    fontSize: 13,
    color: theme.textMuted,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  viewAllIcon: {
    marginLeft: 2,
  },
  bookingList: {
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.secondary,
  },
  bookingVehicle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.text,
  },
  bookingCustomer: {
    fontSize: 13,
    color: theme.textMuted,
    marginTop: 2,
  },
  bookingRight: {
    alignItems: 'flex-end',
  },
  bookingAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.text,
  },
  bookingStatus: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  statusActive: {
    color: theme.revenue,
  },
  statusPending: {
    color: theme.staff,
  },
  statusMuted: {
    color: theme.textMuted,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  actionButtonWrapper: {
    flex: 1,
  },
  actionButton: {
    paddingVertical: 20,
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: theme.background,
  },
  buttonOutline: {
    borderWidth: 1.5,
    borderColor: theme.primary,
  },
  actionButtonText: {
    fontSize: 15,
    color: theme.primary,
    fontWeight: '600',
  },
});