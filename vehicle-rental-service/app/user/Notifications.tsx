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
} from "lucide-react-native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

interface Notification {
  id: string;
  type: "booking" | "payment" | "promo" | "alert" | "success";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Booking Confirmed",
    message: "Your Toyota Camry booking for Feb 20 has been confirmed!",
    time: "2 hours ago",
    isRead: false,
  },
  {
    id: "2",
    type: "payment",
    title: "Payment Successful",
    message: "Payment of $89 received for booking #B4521",
    time: "5 hours ago",
    isRead: false,
  },
  {
    id: "3",
    type: "promo",
    title: "Weekend Special! 🎉",
    message: "Get 20% off on all car rentals this weekend. Use code: WEEKEND20",
    time: "1 day ago",
    isRead: true,
  },
  {
    id: "4",
    type: "booking",
    title: "Upcoming Ride Reminder",
    message: "Your BMW 3 Series rental starts tomorrow at 9:00 AM",
    time: "1 day ago",
    isRead: true,
  },
  {
    id: "5",
    type: "alert",
    title: "Document Expiring Soon",
    message: "Your driving license will expire in 30 days. Please update it.",
    time: "3 days ago",
    isRead: true,
  },
];

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

export default function Notifications() {
  const router = useRouter();

  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    Toast.show({
      type: "success",
      text1: "All notifications marked as read",
    });
  };
  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    Toast.show({
      type: "success",
      text1: "Notification deleted",
    });
  };
  const clearAll = () => {
    setNotifications([]);
    Toast.show({
      type: "success",
      text1: "All notifications cleared",
    });
  };

  return (
    <View style={styles.container}>
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
          {notifications.length > 0 && (
            <TouchableOpacity onPress={markAllAsRead}>
              <Text style={styles.markReadText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.content}
        >
          {/* Clear All Button */}
          {notifications.length > 0 && (
            <View style={styles.clearAllContainer}>
              <TouchableOpacity onPress={clearAll}>
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Notifications List */}
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
                        !notification.isRead && styles.cardUnread,
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
                                  !notification.isRead && styles.titleBold,
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
                            <Text
                              style={styles.message}
                              numberOfLines={2}
                            >
                              {notification.message}
                            </Text>
                            <Text style={styles.time}>{notification.time}</Text>
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
});