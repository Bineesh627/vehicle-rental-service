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
  AlertCircle,
  CarFront,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { staffApi, StaffTask, StaffComplaint } from "@/services/api";
import { chatApi } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Theme Colors derived from the screenshot
const COLORS = {
  background: "#111318", // Very dark background
  card: "#1A1F26", // Slightly lighter card bg
  primary: "#2DD4BF", // Teal/Aqua color for actions
  secondary: "#FB923C", // Orange for pending/pickup
  text: "#FFFFFF",
  textMuted: "#9CA3AF",
  border: "#2C3340",
  danger: "#EF4444", // Red for logout
};

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [deliveryTasks, setDeliveryTasks] = useState<StaffTask[]>([]);
  const [pickupTasks, setPickupTasks] = useState<StaffTask[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [complaints, setComplaints] = useState<StaffComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = async () => {
    try {
      const [data, complaintsData] = await Promise.all([
        staffApi.getAssignedTasks(),
        staffApi.getAssignedComplaints(),
      ]);
      const active = data.filter((t) => t.status !== "completed");
      setCompletedCount(data.filter((t) => t.status === "completed").length);
      setDeliveryTasks(active.filter((t) => t.type === "delivery"));
      setPickupTasks(active.filter((t) => t.type === "pickup"));
      setComplaints(complaintsData.filter((c) => c.status !== "resolved"));
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch tasks",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load tasks on screen focus
  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  const currentStats = [
    {
      label: "Assigned Today",
      value: (deliveryTasks.length + pickupTasks.length + completedCount).toString(),
      icon: Package,
      color: COLORS.primary,
    },
    {
      label: "Completed",
      value: completedCount.toString(),
      icon: CheckCircle,
      color: "#22C55E", // Green
    },
    {
      label: "Pending",
      value: (deliveryTasks.length + pickupTasks.length).toString(),
      icon: Clock,
      color: COLORS.secondary,
    },
  ];

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

  const markAsDelivered = async (taskId: string) => {
    try {
      await staffApi.updateTaskStatus(taskId, "completed");
      setDeliveryTasks((prev) => prev.filter((t) => t.id !== taskId));
      setCompletedCount((c) => c + 1);
      Toast.show({
        type: "success",
        text1: "Vehicle Delivered",
        text2: "Task completed successfully!",
      });
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to mark as delivered",
      });
    }
  };

  const markAsPickedUp = async (taskId: string) => {
    try {
      await staffApi.updateTaskStatus(taskId, "completed");
      setPickupTasks((prev) => prev.filter((t) => t.id !== taskId));
      setCompletedCount((c) => c + 1);
      Toast.show({
        type: "success",
        text1: "Vehicle Picked Up",
        text2: "Task completed successfully!",
      });
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to mark as picked up",
      });
    }
  };

  const TaskCard = ({
    task,
    isDelivery,
  }: {
    task: StaffTask;
    isDelivery: boolean;
  }) => (
    <View
      className="p-5 rounded-2xl mb-4"
      style={{ backgroundColor: COLORS.card }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View
            className={`flex-row items-center px-3 py-1 rounded-full ${
              isDelivery ? "bg-[#2DD4BF]/10" : "bg-orange-500/10"
            }`}
          >
            {isDelivery ? (
              <Truck size={14} color={COLORS.primary} style={{ marginRight: 6 }} />
            ) : (
              <Package size={14} color={COLORS.secondary} style={{ marginRight: 6 }} />
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
        <Text className="text-xs text-gray-400">{task.scheduledTime}</Text>
      </View>

      <View className="mb-4">
        <Text className="text-xl font-bold text-white mb-1">
          {task.vehicleName}
        </Text>
        <Text className="text-sm text-gray-400">
          {task.customerName || "Unknown Customer"}
        </Text>
      </View>

      <View className="flex-row items-start gap-2 mb-5">
        <MapPin size={16} color="#6B7280" style={{ marginTop: 2 }} />
        <Text className="text-sm text-gray-400 flex-1">
          {task.address || "No address provided (Self Pickup)"}
        </Text>
      </View>

      <TouchableOpacity
        className="flex-row items-center justify-center py-3 mb-4 rounded-full border"
        style={{ borderColor: COLORS.primary }}
        onPress={async () => {
          try {
            const token = await AsyncStorage.getItem("auth_token");
            const conv = await chatApi.getOrCreateBookingConversation(
              token || "",
              task.bookingId.toString(),
            );
            router.push({
              pathname: "/chat/[id]",
              params: {
                id: conv.id,
                partnerName: conv.partnerName,
                partnerRole: conv.partnerRole,
                isOnline: String(conv.isOnline),
                shopName: conv.shopName,
              },
            });
          } catch (e) {
            Toast.show({ type: "error", text1: "Chat Error", text2: "Could not open conversation" });
          }
        }}
      >
        <MessageSquare size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
        <Text style={{ color: COLORS.primary, fontWeight: "600" }}>Chat with Customer</Text>
      </TouchableOpacity>

      <View className="flex-row gap-3">
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center py-3 rounded-full border"
          style={{ borderColor: COLORS.primary }}
          onPress={() => handleCall(task.customerPhone || "0000000000", task.customerName || "Customer")}
        >
          <Phone size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
          <Text style={{ color: COLORS.primary, fontWeight: "600" }}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center py-3 rounded-full border"
          style={{ borderColor: COLORS.primary }}
          onPress={() => handleNavigate(task.address || "")}
        >
          <Navigation size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
          <Text style={{ color: COLORS.primary, fontWeight: "600" }}>Navigate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center justify-center py-3 rounded-full"
          style={{ backgroundColor: COLORS.primary }}
          onPress={() => (isDelivery ? markAsDelivered(task.id) : markAsPickedUp(task.id))}
        >
          <Text className="text-black font-bold">{isDelivery ? "Delivered" : "Picked Up"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ComplaintCard = ({ complaint }: { complaint: StaffComplaint }) => (
    <View className="p-5 rounded-2xl mb-4" style={{ backgroundColor: COLORS.card }}>
      <View className="flex-row items-center justify-between mb-3">
        <View
          className="flex-row items-center gap-2 px-3 py-1 rounded-full"
          style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
        >
          <AlertCircle size={13} color="#EF4444" style={{ marginRight: 4 }} />
          <Text className="text-xs font-semibold" style={{ color: "#EF4444" }}>Complaint</Text>
        </View>
        <View
          className="px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${complaint.status === "assigned" ? "#F59E0B" : "#22C55E"}20` }}
        >
          <Text
            className="text-xs font-semibold capitalize"
            style={{ color: complaint.status === "assigned" ? "#F59E0B" : "#22C55E" }}
          >
            {complaint.status}
          </Text>
        </View>
      </View>

      <Text className="text-lg font-bold text-white mb-1">{complaint.subject}</Text>
      <Text className="text-sm text-gray-400 mb-3" numberOfLines={2}>{complaint.description}</Text>

      <View className="flex-row items-center gap-2 mb-1">
        <User size={13} color="#6B7280" />
        <Text className="text-xs text-gray-400">{complaint.customer_name}</Text>
      </View>
      <View className="flex-row items-center gap-2 mb-4">
        <MapPin size={13} color="#6B7280" />
        <Text className="text-xs text-gray-400">{complaint.shop_name}</Text>
      </View>

      <TouchableOpacity
        className="flex-row items-center justify-center py-3 rounded-full"
        style={{ backgroundColor: COLORS.primary }}
        onPress={() =>
          router.push({
            pathname: "/staff/ComplaintDetail",
            params: {
              id: complaint.id,
              subject: complaint.subject,
              description: complaint.description,
              status: complaint.status,
              customer_name: complaint.customer_name,
              shop_name: complaint.shop_name,
              booking_id: complaint.booking_id ?? "",
              created_at: complaint.created_at,
            },
          })
        }
      >
        <Text className="font-bold text-black">View Details</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-5 pt-2 pb-6">
          <View className="flex-row items-center gap-3">
            <View
              className="h-12 w-12 rounded-xl items-center justify-center shadow-lg shadow-cyan-500/50"
              style={{ backgroundColor: "#22D3EE" }}
            >
              <CarFront color="#0F1C23" size={28} strokeWidth={2.5} />
            </View>
            <View>
              <Text className="text-2xl font-bold mb-0.5" style={{ color: "#22D3EE" }}>
                Rent<Text className="text-white">X</Text>plore
              </Text>
              <Text className="text-sm text-gray-400 font-medium">
                {user?.name || "Staff Member"} (Staff)
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            {/* Profile Button with Rounded Rectangle Border */}
            <TouchableOpacity 
              onPress={() => router.push("/staff/StaffProfile")}
              style={{ 
                borderWidth: 1.5, 
                borderColor: COLORS.border, 
                borderRadius: 12, 
                padding: 6 
              }}
            >
              <User size={24} color="white" />
            </TouchableOpacity>

            {/* Logout Button - Red with Border */}
            <TouchableOpacity 
              onPress={handleLogout}
              style={{ 
                borderWidth: 1.5, 
                borderColor: COLORS.danger, 
                borderRadius: 12, 
                paddingHorizontal: 12, 
                paddingVertical: 6,
                marginLeft: 4
              }}
            >
              <Text style={{ color: COLORS.danger, fontWeight: "bold" }}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        >
          {/* Stats Row */}
          <View className="flex-row gap-3 mb-8">
            {currentStats.map((stat, index) => (
              <View
                key={index}
                className="flex-1 pt-6 pb-4 items-center justify-between rounded-2xl border"
                style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
              >
                <stat.icon size={24} color={stat.color} style={{ marginBottom: 8 }} />
                <View className="items-center px-1">
                  <Text className="text-2xl font-bold text-white">{stat.value}</Text>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    className="text-xs text-gray-400 mt-1"
                  >
                    {stat.label}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Delivery Tasks */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2">
                <Truck size={18} color={COLORS.primary} />
                <Text className="text-lg font-bold text-white">Delivery Tasks</Text>
              </View>
              <TouchableOpacity onPress={() => router.push("/staff/AssignedTasks")} className="flex-row items-center">
                <Text style={{ color: COLORS.primary }} className="mr-1">View All</Text>
                <ChevronRight size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            {deliveryTasks.length === 0 ? <Text className="text-gray-500 text-center py-4">No pending deliveries</Text> : deliveryTasks.map((t) => <TaskCard key={t.id} task={t} isDelivery={true} />)}
          </View>

          {/* Pickup Tasks */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2">
                <Package size={18} color={COLORS.secondary} />
                <Text className="text-lg font-bold text-white">Pickup Tasks</Text>
              </View>
              <TouchableOpacity onPress={() => router.push("/staff/AssignedTasks")} className="flex-row items-center">
                <Text style={{ color: COLORS.primary }} className="mr-1">View All</Text>
                <ChevronRight size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            {pickupTasks.length === 0 ? <Text className="text-gray-500 text-center py-4">No pending pickups</Text> : pickupTasks.map((t) => <TaskCard key={t.id} task={t} isDelivery={false} />)}
          </View>

          {/* Complaints */}
          {complaints.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2">
                  <AlertCircle size={18} color="#EF4444" />
                  <Text className="text-lg font-bold text-white">Assigned Complaints</Text>
                </View>
                <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(239,68,68,0.15)" }}>
                  <Text className="text-xs font-bold" style={{ color: "#EF4444" }}>{complaints.length}</Text>
                </View>
              </View>
              {complaints.map((c) => <ComplaintCard key={c.id} complaint={c} />)}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}