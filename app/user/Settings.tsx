import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Bell,
  Car,
  Clock,
  CreditCard,
  Gift,
  Mail,
  MessageSquare,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function Settings() {
  const router = useRouter();

  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    bookingUpdates: true,
    paymentAlerts: true,
    promotions: true,
    reminders: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    Toast.show({
      type: "success",
      text1: "Settings Updated",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background pt-8">
      <View className="flex-1">
        {/* Header */}
        <View className="border-b border-border bg-card/95 px-4 py-3 flex-row items-center gap-3">
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <ArrowLeft size={20} className="text-foreground" />
          </Button>
          <Text className="text-lg font-bold text-foreground">Settings</Text>
        </View>

        <ScrollView
          className="flex-1 px-4 py-6"
          contentContainerStyle={{ gap: 24, paddingBottom: 40 }}
        >
          {/* Notification Channels */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border mb-3">
              <View className="flex-row items-center gap-2">
                <Bell size={16} className="text-foreground" />
                <CardTitle className="text-base text-foreground">
                  Notification Channels
                </CardTitle>
              </View>
            </CardHeader>
            <CardContent className="gap-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="h-10 w-10 rounded-xl bg-primary/10 items-center justify-center">
                    <Bell size={20} className="text-primary" />
                  </View>
                  <View>
                    <Text className="font-medium text-foreground">
                      Push Notifications
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      Receive push notifications on your device
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.pushNotifications}
                  onValueChange={() => toggleSetting("pushNotifications")}
                />
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="h-10 w-10 rounded-xl bg-purple-500/10 items-center justify-center">
                    <Mail size={20} className="text-purple-500" />
                  </View>
                  <View>
                    <Text className="font-medium text-foreground">
                      Email Notifications
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      Receive updates via email
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.emailNotifications}
                  onValueChange={() => toggleSetting("emailNotifications")}
                />
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="h-10 w-10 rounded-xl bg-green-500/10 items-center justify-center">
                    <MessageSquare size={20} className="text-green-500" />
                  </View>
                  <View>
                    <Text className="font-medium text-foreground">
                      SMS Notifications
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      Receive SMS alerts
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.smsNotifications}
                  onValueChange={() => toggleSetting("smsNotifications")}
                />
              </View>
            </CardContent>
          </Card>

          {/* Notification Types */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border mb-3">
              <CardTitle className="text-base text-foreground">
                Notification Types
              </CardTitle>
              <Text className="text-xs text-muted-foreground mt-1">
                Choose what you want to be notified about
              </Text>
            </CardHeader>
            <CardContent className="gap-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="h-10 w-10 rounded-xl bg-primary/10 items-center justify-center">
                    <Car size={20} className="text-primary" />
                  </View>
                  <View>
                    <Text className="font-medium text-foreground">
                      Booking Updates
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      Status changes, confirmations
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.bookingUpdates}
                  onValueChange={() => toggleSetting("bookingUpdates")}
                />
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="h-10 w-10 rounded-xl bg-green-500/10 items-center justify-center">
                    <CreditCard size={20} className="text-green-500" />
                  </View>
                  <View>
                    <Text className="font-medium text-foreground">
                      Payment Alerts
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      Payment confirmations, refunds
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.paymentAlerts}
                  onValueChange={() => toggleSetting("paymentAlerts")}
                />
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="h-10 w-10 rounded-xl bg-purple-500/10 items-center justify-center">
                    <Gift size={20} className="text-purple-500" />
                  </View>
                  <View>
                    <Text className="font-medium text-foreground">
                      Promotions & Offers
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      Deals, discounts, special offers
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.promotions}
                  onValueChange={() => toggleSetting("promotions")}
                />
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="h-10 w-10 rounded-xl bg-orange-500/10 items-center justify-center">
                    <Clock size={20} className="text-orange-500" />
                  </View>
                  <View>
                    <Text className="font-medium text-foreground">
                      Ride Reminders
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      Upcoming bookings, returns
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.reminders}
                  onValueChange={() => toggleSetting("reminders")}
                />
              </View>
            </CardContent>
          </Card>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
