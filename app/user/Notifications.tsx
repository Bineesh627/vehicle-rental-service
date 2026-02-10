import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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

const getIconColor = (type: string) => {
  switch (type) {
    case "booking":
      return "bg-primary/10 text-primary";
    case "payment":
      return "bg-green-500/10 text-green-500";
    case "promo":
      return "bg-purple-500/10 text-purple-500";
    case "alert":
      return "bg-orange-500/10 text-orange-500";
    case "success":
      return "bg-green-500/10 text-green-500";
    default:
      return "bg-secondary text-muted-foreground";
  }
};

export default function Notifications() {
  const router = useRouter();

  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
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
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="border-b border-border bg-card/95 px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onPress={() => router.navigate("profile" as never)}
            >
              <ArrowLeft size={20} className="text-foreground" />
            </Button>
            <View>
              <Text className="text-lg font-bold text-foreground">
                Notifications
              </Text>
              {unreadCount > 0 && (
                <Text className="text-xs text-muted-foreground">
                  {unreadCount} unread
                </Text>
              )}
            </View>
          </View>
          {notifications.length > 0 && (
            <TouchableOpacity onPress={markAllAsRead}>
              <Text className="text-sm font-medium text-primary">
                Mark all read
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          className="flex-1 px-4 py-6"
          contentContainerStyle={{ gap: 16, paddingBottom: 40 }}
        >
          {/* Clear All Button */}
          {notifications.length > 0 && (
            <View className="flex-row justify-end">
              <TouchableOpacity onPress={clearAll}>
                <Text className="text-sm font-medium text-destructive">
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 items-center">
                <BellOff size={48} className="text-muted-foreground mb-3" />
                <Text className="font-medium text-foreground">
                  No notifications yet
                </Text>
                <Text className="text-sm text-muted-foreground mt-1">
                  We'll notify you when something arrives
                </Text>
              </CardContent>
            </Card>
          ) : (
            <View className="gap-3">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const colorClass = getIconColor(notification.type);
                const [bgColor, textColor] = colorClass.split(" ");
                // Manual extraction of bg color and text color classes needs mapping or just use string manipulation logic if tailored classes
                // For simplified NativeWind, we might need to adjust logic or pass specific style props.
                // Assuming standard NativeWind working:

                return (
                  <TouchableOpacity
                    key={notification.id}
                    onPress={() => markAsRead(notification.id)}
                  >
                    <Card
                      className={`border-border ${
                        !notification.isRead
                          ? "bg-primary/5 border-primary/20"
                          : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <View className="flex-row items-start gap-3">
                          <View
                            className={`h-10 w-10 rounded-xl items-center justify-center shrink-0 ${bgColor}`}
                          >
                            <Icon size={20} className={textColor} />
                          </View>
                          <View className="flex-1">
                            <View className="flex-row items-start justify-between gap-2">
                              <View className="flex-1">
                                <Text
                                  className={`font-medium text-foreground ${
                                    !notification.isRead ? "font-bold" : ""
                                  }`}
                                >
                                  {notification.title}
                                </Text>
                                <Text
                                  className="text-sm text-muted-foreground mt-0.5"
                                  numberOfLines={2}
                                >
                                  {notification.message}
                                </Text>
                                <Text className="text-xs text-muted-foreground mt-1">
                                  {notification.time}
                                </Text>
                              </View>
                              <TouchableOpacity
                                className="h-8 w-8 items-center justify-center"
                                onPress={(e) => {
                                  e.stopPropagation(); // Might not work as expected on Touchables if nested, but here it's fine
                                  deleteNotification(notification.id);
                                }}
                              >
                                <Trash2
                                  size={16}
                                  className="text-muted-foreground"
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </CardContent>
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
