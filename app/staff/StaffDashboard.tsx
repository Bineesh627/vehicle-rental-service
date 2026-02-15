import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import {
  CheckCircle,
  ChevronRight,
  Clock,
  MapPin,
  MessageSquare,
  Navigation,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// Theme Colors derived from the screenshot
const COLORS = {
  background: "#111318", // Very dark background
  card: "#1A1F26", // Slightly lighter card bg
  primary: "#2DD4BF", // Teal/Aqua color for actions
  secondary: "#FB923C", // Orange for pending/pickup
  text: "#FFFFFF",
  textMuted: "#9CA3AF",
  border: "#2C3340",
};

const stats = [
  {
    label: "Assigned Today",
    value: "5",
    icon: Package,
    color: COLORS.primary,
  },
  {
    label: "Completed",
    value: "3",
    icon: CheckCircle,
    color: "#22C55E", // Green
  },
  {
    label: "Pending",
    value: "2",
    icon: Clock,
    color: COLORS.secondary,
  },
];

const initialDeliveryTasks = [
  {
    id: "1",
    type: "delivery",
    vehicle: "Toyota Camry",
    customer: "John Davis",
    phone: "+1 555-1234",
    address: "123 Main St, Downtown",
    time: "10:00 AM",
    status: "pending",
  },
  {
    id: "2",
    type: "delivery",
    vehicle: "Honda Activa",
    customer: "Sarah Miller",
    phone: "+1 555-5678",
    address: "456 Oak Ave, Midtown",
    time: "11:30 AM",
    status: "in_progress",
  },
];

const initialPickupTasks = [
  {
    id: "3",
    type: "pickup",
    vehicle: "BMW 3 Series",
    customer: "Mike Ross",
    phone: "+1 555-9012",
    address: "789 Luxury Lane, Uptown",
    time: "2:00 PM",
    status: "pending",
  },
];

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [deliveryTasks, setDeliveryTasks] = useState(initialDeliveryTasks);
  const [pickupTasks, setPickupTasks] = useState(initialPickupTasks);

  const handleLogout = () => {
    logout();
    router.replace("/Login");
  };

  const handleCall = (phone: string, customer: string) => {
    Toast.show({
      type: "info",
      text1: "Calling Customer",
      text2: `Dialing ${customer} at ${phone}...`,
    });
  };

  const handleNavigate = (address: string) => {
    Toast.show({
      type: "info",
      text1: "Opening Navigation",
      text2: `Navigating to ${address}`,
    });
  };

  const markAsDelivered = (taskId: string) => {
    setDeliveryTasks((prev) => prev.filter((t) => t.id !== taskId));
    Toast.show({
      type: "success",
      text1: "Vehicle Delivered",
      text2: "Task completed successfully!",
    });
  };

  const markAsPickedUp = (taskId: string) => {
    setPickupTasks((prev) => prev.filter((t) => t.id !== taskId));
    Toast.show({
      type: "success",
      text1: "Vehicle Picked Up",
      text2: "Task completed successfully!",
    });
  };

  const TaskCard = ({
    task,
    isDelivery,
  }: {
    task: (typeof initialDeliveryTasks)[0];
    isDelivery: boolean;
  }) => (
    <View
      className="p-5 rounded-2xl mb-4"
      style={{ backgroundColor: COLORS.card }}
    >
      {/* Header: Icon/Badge + Time */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          {/* Badge */}
          <View
            className={`flex-row items-center px-3 py-1 rounded-full ${
              isDelivery ? "bg-[#2DD4BF]/10" : "bg-orange-500/10"
            }`}
          >
            {isDelivery ? (
              <Truck
                size={14}
                color={COLORS.primary}
                style={{ marginRight: 6 }}
              />
            ) : (
              <Package
                size={14}
                color={COLORS.secondary}
                style={{ marginRight: 6 }}
              />
            )}
            <Text
              className={`text-xs font-semibold ${
                isDelivery ? "text-[#2DD4BF]" : "text-orange-500"
              }`}
            >
              {isDelivery ? "Delivery" : "Pickup"}
            </Text>
          </View>
        </View>
        <Text className="text-xs text-gray-400">{task.time}</Text>
      </View>

      {/* Main Content */}
      <View className="mb-4">
        <Text className="text-xl font-bold text-white mb-1">
          {task.vehicle}
        </Text>
        <Text className="text-sm text-gray-400">{task.customer}</Text>
      </View>

      {/* Address */}
      <View className="flex-row items-start gap-2 mb-5">
        <MapPin size={16} color="#6B7280" style={{ marginTop: 2 }} />
        <Text className="text-sm text-gray-400 flex-1">{task.address}</Text>
      </View>

      {/* Chat Button */}
      <TouchableOpacity
        className="flex-row items-center justify-center py-3 mb-4 rounded-full border"
        style={{ borderColor: COLORS.primary }}
        onPress={() => router.push("/chat/1")}
      >
        <MessageSquare
          size={16}
          color={COLORS.primary}
          style={{ marginRight: 6 }}
        />
        <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
          Chat with Customer
        </Text>
      </TouchableOpacity>

      {/* Action Buttons - Styled exactly like the screenshot */}
      <View className="flex-row gap-3">
        {/* Call Button (Outlined) */}
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center py-3 rounded-full border"
          style={{ borderColor: COLORS.primary }}
          onPress={() => handleCall(task.phone, task.customer)}
        >
          <Phone size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
          <Text style={{ color: COLORS.primary, fontWeight: "600" }}>Call</Text>
        </TouchableOpacity>

        {/* Navigate Button (Outlined) */}
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center py-3 rounded-full border"
          style={{ borderColor: COLORS.primary }}
          onPress={() => handleNavigate(task.address)}
        >
          <Navigation
            size={16}
            color={COLORS.primary}
            style={{ marginRight: 6 }}
          />
          <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
            Navigate
          </Text>
        </TouchableOpacity>

        {/* Complete Button (Solid) */}
        <TouchableOpacity
          className="flex-1 items-center justify-center py-3 rounded-full"
          style={{ backgroundColor: COLORS.primary }}
          onPress={() =>
            isDelivery ? markAsDelivered(task.id) : markAsPickedUp(task.id)
          }
        >
          <Text className="text-black font-bold">
            {isDelivery ? "Delivered" : "Picked Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
    >
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-2 pb-6">
          <View className="flex-row items-center gap-3">
            <View>
              <Text className="text-xl font-bold text-white">
                Staff Dashboard
              </Text>
              <Text className="text-sm text-gray-400">
                {user?.name || "Mike Staff"}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1">
            <TouchableOpacity
              onPress={() => router.push("/staff/StaffComplaint")}
            >
              <View className="mr-4 px-3 py-1.5 bg-[#1E293B] rounded-full border border-gray-700">
                <Text className="text-gray-300 text-xs font-medium">
                  Report Issue
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/staff/StaffProfile")}
            >
              <User size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} className="ml-4">
              <Text className="text-white font-semibold">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Stats Row */}
          <View className="flex-row gap-3 mb-8">
            {stats.map((stat, index) => (
              <View
                key={index}
                className="flex-1 pt-6 pb-4 items-center justify-between rounded-2xl border"
                style={{
                  backgroundColor: COLORS.card,
                  borderColor: COLORS.border,
                }}
              >
                <stat.icon
                  size={24}
                  color={stat.color}
                  style={{ marginBottom: 8 }}
                />
                <View className="items-center">
                  <Text className="text-2xl font-bold text-white">
                    {stat.value}
                  </Text>
                  <Text className="text-xs text-gray-400 mt-1">
                    {stat.label}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Delivery Tasks Section */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2">
                <Truck size={18} color={COLORS.primary} />
                <Text className="text-lg font-bold text-white">
                  Delivery Tasks
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/staff/AssignedTasks")}
                className="flex-row items-center"
              >
                <Text style={{ color: COLORS.primary }} className="mr-1">
                  View All
                </Text>
                <ChevronRight size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {deliveryTasks.length === 0 ? (
              <Text className="text-gray-500 text-center py-4">
                No pending deliveries
              </Text>
            ) : (
              deliveryTasks.map((task) => (
                <TaskCard key={task.id} task={task} isDelivery={true} />
              ))
            )}
          </View>

          {/* Pickup Tasks Section */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2">
                <Package size={18} color={COLORS.secondary} />
                <Text className="text-lg font-bold text-white">
                  Pickup Tasks
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/staff/AssignedTasks")}
                className="flex-row items-center"
              >
                <Text style={{ color: COLORS.primary }} className="mr-1">
                  View All
                </Text>
                <ChevronRight size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {pickupTasks.length === 0 ? (
              <Text className="text-gray-500 text-center py-4">
                No pending pickups
              </Text>
            ) : (
              pickupTasks.map((task) => (
                <TaskCard key={task.id} task={task} isDelivery={false} />
              ))
            )}
          </View>

          {/* Map Section */}
          <View
            className="rounded-3xl overflow-hidden"
            style={{ backgroundColor: "#153d38" }} // Dark greenish map bg from screenshot
          >
            <TouchableOpacity
              activeOpacity={0.9}
              className="h-48 items-center justify-center"
              onPress={() => router.push("/staff/AssignedTasks")}
            >
              <MapPin
                size={32}
                color={COLORS.primary}
                style={{ marginBottom: 10 }}
              />
              <Text className="text-base font-bold text-white">
                Task Locations Map
              </Text>
              <Text className="text-xs text-gray-400 mt-1">
                Tap to view full map
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
