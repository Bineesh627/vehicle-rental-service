import { useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  BellOff,
  Car,
  CheckCircle,
  CreditCard,
  Gift,
  Trash2,
  RefreshCw,
} from "lucide-react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  notificationsApi,
  type Notification as AppNotification,
} from "@/services/api";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "booking":
      return Car;
    case "payment":
      return CreditCard;
    case "promo":
      return Gift;
    case "alert":
      return AlertCircle;
    case "success":
      return CheckCircle;
    default:
      return Bell;
  }
};

const getIconStyles = (type: string) => {
  switch (type) {
    case "booking":
      return { bg: "rgba(45, 212, 191, 0.1)", color: "#2dd4bf" }; // Teal
    case "payment":
      return { bg: "rgba(34, 197, 94, 0.1)", color: "#22c55e" }; // Green
    case "promo":
      return { bg: "rgba(168, 85, 247, 0.1)", color: "#a855f7" }; // Purple
    case "alert":
      return { bg: "rgba(249, 115, 22, 0.1)", color: "#f97316" }; // Orange
    case "success":
      return { bg: "rgba(34, 197, 94, 0.1)", color: "#22c55e" }; // Green
    default:
      return { bg: "#334155", color: "#94a3b8" }; // Slate
  }
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  }
};

export default function Notifications() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");
      } catch (error) {
        console.log(" [Notifications] Error checking auth:", error);
      }
    };
    checkAuth();
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const loadNotifications = useCallback(async () => {
    try {
      setError(null);
      const data = await notificationsApi.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.log(" [Notifications Component] Error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load notifications";
      setError(errorMessage);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
        position: "bottom",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotifications();
  }, [loadNotifications]);

  const markAsRead = async (id: string) => {
    try {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );

      // API call
      await notificationsApi.markNotificationRead(id);
    } catch (err) {
      // Revert optimistic update on error
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: false } : n)),
      );

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to mark notification as read";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
        position: "bottom",
      });
    }
  };
  const deleteNotification = async (id: string) => {
    try {
      // Optimistic update - remove from UI
      setNotifications((prev) => prev.filter((n) => n.id !== id));

      // API call to delete from backend
      await notificationsApi.deleteNotification(id);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Notification deleted",
        position: "bottom",
      });
    } catch (err) {
      // Revert optimistic update on error
      await loadNotifications(); // Reload from server

      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete notification";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
        position: "bottom",
      });
    }
  };

  const markAllAsRead = async () => {
    // Prevent multiple rapid clicks
    if (isProcessing) return;

    const allRead = notifications.every((n) => n.is_read);
    if (allRead) {
      Toast.show({
        type: "info",
        text1: "All notifications already read",
        position: "bottom",
      });
      return;
    }

    try {
      setIsProcessing(true);

      // Optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

      // API call
      await notificationsApi.markAllNotificationsRead();

      Toast.show({
        type: "success",
        text1: "All notifications marked as read",
        position: "bottom",
      });
    } catch (err) {
      // Revert optimistic update on error
      await loadNotifications(); // Reload from server

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to mark all notifications as read";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
        position: "bottom",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && !refreshing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2dd4bf" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Notifications</Text>
              {unreadCount > 0 && (
                <Text style={styles.unreadCount}>{unreadCount} unread</Text>
              )}
            </View>
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={markAllAsRead}
              style={[
                styles.markReadButton,
                isProcessing && styles.buttonDisabled,
              ]}
              disabled={isProcessing}
            >
              <Text
                style={[
                  styles.markReadText,
                  isProcessing && styles.textDisabled,
                ]}
              >
                {isProcessing ? "Marking..." : "Mark All Read"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#2dd4bf"
            />
          }
        >
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <BellOff size={48} color="#64748b" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptySubtitle}>
                We'll notify you when something arrives
              </Text>
            </View>
          ) : (
            <View style={styles.listContainer}>
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const { bg, color } = getIconStyles(notification.type);

                return (
                  <TouchableOpacity
                    key={notification.id}
                    onPress={() => markAsRead(notification.id)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.card,
                        !notification.is_read && styles.cardUnread,
                      ]}
                    >
                      <View style={styles.cardContent}>
                        <View style={styles.cardHeader}>
                          <View
                            style={[
                              styles.iconContainer,
                              { backgroundColor: bg },
                            ]}
                          >
                            <Icon size={20} color={color} />
                          </View>
                          <View style={styles.textContainer}>
                            <View style={styles.titleRow}>
                              <Text
                                style={[
                                  styles.title,
                                  !notification.is_read && styles.titleBold,
                                ]}
                              >
                                {notification.title}
                              </Text>
                              <TouchableOpacity
                                onPress={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                style={styles.deleteButton}
                              >
                                <Trash2 size={16} color="#94a3b8" />
                              </TouchableOpacity>
                            </View>
                            <Text style={styles.message} numberOfLines={2}>
                              {notification.message}
                            </Text>
                            <Text style={styles.time}>
                              {formatTime(notification.created_at)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // Dark background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  unreadCount: {
    fontSize: 12,
    color: "#94a3b8", // Slate-400
  },
  markReadButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  markReadText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  clearAllContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ef4444", // Red-500
  },
  listContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: "#1e293b", // Slate-800
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    overflow: "hidden",
  },
  cardUnread: {
    backgroundColor: "rgba(45, 212, 191, 0.05)", // Slight Teal tint
    borderColor: "rgba(45, 212, 191, 0.2)",
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12, // Slightly rounded square
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500",
    flex: 1,
    marginRight: 8,
  },
  titleBold: {
    fontWeight: "700",
  },
  message: {
    fontSize: 14,
    color: "#94a3b8", // Slate-400
    lineHeight: 20,
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: "#64748b", // Slate-500
  },
  deleteButton: {
    padding: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  textDisabled: {
    opacity: 0.7,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "#1e293b",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#ffffff",
  },
});
