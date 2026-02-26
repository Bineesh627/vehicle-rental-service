import { useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  MessageSquare,
  Navigation,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { staffApi, chatApi, StaffTask } from "@/services/api";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import React from "react";

// Theme Colors matching the screenshots
const COLORS = {
  background: "#111318",
  card: "#1A1F26",
  primary: "#2DD4BF", // Teal/Aqua
  secondary: "#FB923C", // Orange
  text: "#FFFFFF",
  textMuted: "#9CA3AF",
  border: "#2C3340",
  success: "#22C55E",
};

export default function AssignedTasks() {
  const router = useRouter();
  const [tasks, setTasks] = useState<StaffTask[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useAuth();

  const fetchTasks = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const data = await staffApi.getAssignedTasks();
      // Only set tasks if the network request actually returns valid data
      if (Array.isArray(data)) setTasks(data);
    } catch (error) {
      console.error(error);
      // We don't want to show a toast on every silent background poll failure
      if (showRefresh) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to fetch tasks",
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Fetch immediately on focus
      fetchTasks();

      // Then poll every 5 seconds
      const pollInterval = setInterval(() => {
        fetchTasks(false);
      }, 5000);

      return () => clearInterval(pollInterval);
    }, []),
  );

  const onRefresh = () => {
    fetchTasks(true);
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "All") return task.status !== "completed";
    if (activeTab === "Delivery")
      return task.type === "delivery" && task.status !== "completed";
    if (activeTab === "Pickup")
      return task.type === "pickup" && task.status !== "completed";
    if (activeTab === "Done") return task.status === "completed";
    return true;
  });

  const startTask = async (taskId: string) => {
    try {
      await staffApi.updateTaskStatus(taskId, "in_progress");
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: "in_progress" } : t,
        ),
      );
      Toast.show({
        type: "success",
        text1: "Task Started",
        text2: "Navigate to the location.",
      });
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to start task",
      });
    }
  };

  const completeTask = async (taskId: string) => {
    try {
      await staffApi.updateTaskStatus(taskId, "completed");
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: "completed" } : t)),
      );
      Toast.show({
        type: "success",
        text1: "Task Completed",
        text2: "Great job!",
      });
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to complete task",
      });
    }
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleNavigate = (address: string) => {
    // In a real app, open maps
    Toast.show({
      type: "info",
      text1: "Opening Maps",
      text2: `Navigating to ${address}`,
    });
  };

  // Helper to render the stats boxes at the top
  const StatBox = ({
    label,
    value,
    color = "white",
  }: {
    label: string;
    value: number;
    color?: string;
  }) => (
    <View
      className="flex-1 items-center justify-center py-4 rounded-2xl border"
      style={{
        backgroundColor: COLORS.card,
        borderColor: COLORS.border,
      }}
    >
      <Text
        className="text-xl font-bold mb-1"
        style={{ color: color === "primary" ? COLORS.primary : "white" }}
      >
        {value}
      </Text>
      <Text className="text-xs text-gray-400">{label}</Text>
    </View>
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
    >
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 py-4 mb-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-full mr-3"
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white flex-1">
            Assigned Tasks
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/staff/StaffComplaint")}
            className="px-3 py-1.5 bg-[#1E293B] rounded-full border border-gray-700"
          >
            <Text className="text-gray-300 text-xs font-medium">Report</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        >
          {loading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              className="mt-10"
            />
          ) : (
            <>
              {/* Stats Row */}
              <View className="flex-row gap-3 mb-6">
                <StatBox
                  label="Pending"
                  value={tasks.filter((t) => t.status === "pending").length}
                />
                <StatBox
                  label="Active"
                  value={tasks.filter((t) => t.status === "in_progress").length}
                  color="primary"
                />
                <StatBox
                  label="Deliveries"
                  value={tasks.filter((t) => t.type === "delivery").length}
                />
                <StatBox
                  label="Pickups"
                  value={tasks.filter((t) => t.type === "pickup").length}
                />
              </View>

              {/* Custom Tabs */}
              <View
                className="flex-row p-1 rounded-xl mb-6"
                style={{ backgroundColor: COLORS.card }}
              >
                {["All", "Delivery", "Pickup", "Done"].map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <TouchableOpacity
                      key={tab}
                      onPress={() => setActiveTab(tab)}
                      className="flex-1 items-center justify-center py-2.5 rounded-lg"
                      style={{
                        backgroundColor: isActive
                          ? COLORS.background
                          : "transparent",
                      }}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          isActive ? "text-white" : "text-gray-500"
                        }`}
                      >
                        {tab}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Task List */}
              <View className="gap-4">
                {filteredTasks.map((task) => {
                  const isDelivery = task.type === "delivery";
                  const isPending = task.status === "pending";
                  const isCompleted = task.status === "completed";

                  return (
                    <View
                      key={task.id}
                      className="p-4 rounded-3xl border"
                      style={{
                        backgroundColor: COLORS.card,
                        borderColor: COLORS.border,
                      }}
                    >
                      {/* Top Row: Icon + Title + Status/Time */}
                      <View className="flex-row justify-between mb-4">
                        <View className="flex-row gap-3 flex-1 mr-2">
                          {/* Icon Circle */}
                          <View
                            className="h-10 w-10 rounded-full items-center justify-center"
                            style={{
                              backgroundColor: isDelivery
                                ? "rgba(45, 212, 191, 0.1)"
                                : "rgba(251, 146, 60, 0.1)",
                            }}
                          >
                            {isDelivery ? (
                              <Truck size={20} color={COLORS.primary} />
                            ) : (
                              <Package size={20} color={COLORS.secondary} />
                            )}
                          </View>

                          {/* Title Info */}
                          <View>
                            <Text className="text-xs uppercase text-gray-500 font-bold mb-0.5">
                              {task.type}
                            </Text>
                            <Text className="text-white font-bold text-lg mb-1">
                              {task.vehicleName}
                            </Text>
                          </View>
                        </View>

                        {/* Status & Time */}
                        <View className="items-end">
                          <View
                            className="px-2 py-1 rounded-md mb-1"
                            style={{
                              backgroundColor:
                                task.status === "in_progress"
                                  ? "rgba(45, 212, 191, 0.1)"
                                  : "rgba(251, 146, 60, 0.1)",
                            }}
                          >
                            <Text
                              className="text-xs font-bold capitalize"
                              style={{
                                color:
                                  task.status === "in_progress"
                                    ? COLORS.primary
                                    : COLORS.secondary,
                              }}
                            >
                              {task.status.replace("_", " ")}
                            </Text>
                          </View>
                          <View className="flex-row items-center gap-1">
                            <Clock size={12} color={COLORS.textMuted} />
                            <Text className="text-xs text-gray-400">
                              {task.scheduledTime}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Customer & Address Info */}
                      <View className="mb-6 gap-3">
                        <View className="flex-row items-center gap-3">
                          <User size={18} color={COLORS.textMuted} />
                          <Text className="text-base text-gray-300">
                            {task.customerName || "Unknown Customer"}
                          </Text>
                        </View>
                        <View className="flex-row items-start gap-3 pr-4">
                          <MapPin
                            size={18}
                            color={COLORS.textMuted}
                            style={{ marginTop: 2 }}
                          />
                          <Text className="text-sm text-gray-400 leading-5">
                            {task.address ||
                              "No address provided (Self Pickup)"}
                          </Text>
                        </View>
                      </View>

                      {/* Chat Button */}
                      <TouchableOpacity
                        className="flex-row items-center justify-center py-3 mb-4 rounded-full border"
                        style={{ borderColor: COLORS.primary }}
                        onPress={async () => {
                          try {
                            const conv =
                              await chatApi.getOrCreateBookingConversation(
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
                            Toast.show({
                              type: "error",
                              text1: "Chat Error",
                              text2: "Could not open conversation",
                            });
                          }
                        }}
                      >
                        <MessageSquare
                          size={16}
                          color={COLORS.primary}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={{ color: COLORS.primary, fontWeight: "600" }}
                        >
                          Chat with Customer
                        </Text>
                      </TouchableOpacity>

                      {/* Action Buttons */}
                      {!isCompleted && (
                        <View className="flex-row gap-3">
                          <TouchableOpacity
                            className="flex-1 flex-row items-center justify-center py-3 rounded-full border"
                            style={{ borderColor: COLORS.primary }}
                            onPress={() =>
                              handleCall(task.customerPhone || "0000000000")
                            }
                          >
                            <Phone
                              size={16}
                              color={COLORS.primary}
                              style={{ marginRight: 6 }}
                            />
                            <Text
                              style={{
                                color: COLORS.primary,
                                fontWeight: "600",
                              }}
                            >
                              Call
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            className="flex-1 flex-row items-center justify-center py-3 rounded-full border"
                            style={{ borderColor: COLORS.primary }}
                            onPress={() => handleNavigate(task.address || "")}
                          >
                            <Navigation
                              size={16}
                              color={COLORS.primary}
                              style={{ marginRight: 6 }}
                            />
                            <Text
                              style={{
                                color: COLORS.primary,
                                fontWeight: "600",
                              }}
                            >
                              Navigate
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            className="flex-1 items-center justify-center py-3 rounded-full"
                            style={{ backgroundColor: COLORS.primary }}
                            onPress={() =>
                              isPending
                                ? startTask(task.id)
                                : completeTask(task.id)
                            }
                          >
                            <Text className="text-black font-bold">
                              {isPending
                                ? "Start"
                                : isDelivery
                                  ? "Delivered"
                                  : "Picked Up"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}

                      {isCompleted && (
                        <View className="flex-row items-center justify-center py-3 bg-green-500/10 rounded-xl">
                          <CheckCircle
                            size={18}
                            color={COLORS.success}
                            style={{ marginRight: 8 }}
                          />
                          <Text
                            style={{ color: COLORS.success, fontWeight: "600" }}
                          >
                            Task Completed
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
