import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import {
  Activity,
  CheckCircle,
  ChevronRight,
  Clock,
  Shield,
  Store,
  TrendingUp,
  User,
  Users,
  XCircle,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const stats = [
  {
    label: "Total Users",
    value: "2,847",
    change: "+12%",
    icon: Users,
    color: "text-primary",
  },
  {
    label: "Rental Shops",
    value: "156",
    change: "+8%",
    icon: Store,
    color: "text-purple-500",
  },
  {
    label: "Active Bookings",
    value: "423",
    change: "+23%",
    icon: Activity,
    color: "text-green-500",
  },
  {
    label: "Pending Approvals",
    value: "12",
    change: "-",
    icon: Clock,
    color: "text-orange-500",
  },
];

const initialPendingOwners = [
  {
    id: "1",
    name: "John's Auto Rental",
    email: "john@autorental.com",
    date: "2024-02-01",
  },
  {
    id: "2",
    name: "City Bikes Hub",
    email: "info@citybikes.com",
    date: "2024-02-02",
  },
  {
    id: "3",
    name: "Premium Rides Co",
    email: "contact@premiumrides.com",
    date: "2024-02-03",
  },
];

const recentActivity = [
  {
    type: "user",
    message: "New user registered: Sarah M.",
    time: "5 mins ago",
  },
  { type: "booking", message: "Booking #4521 completed", time: "12 mins ago" },
  { type: "shop", message: "SpeedWheels updated pricing", time: "1 hour ago" },
  {
    type: "alert",
    message: "High traffic detected in Downtown area",
    time: "2 hours ago",
  },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [pendingOwners, setPendingOwners] = useState(initialPendingOwners);

  const handleLogout = () => {
    logout();
    router.replace("/Login");
  };

  const approveOwner = (ownerId: string) => {
    const owner = pendingOwners.find((o) => o.id === ownerId);
    setPendingOwners((prev) => prev.filter((o) => o.id !== ownerId));
    Toast.show({
      type: "success",
      text1: "Owner Approved",
      text2: `${owner?.name} has been approved successfully.`,
    });
  };

  const rejectOwner = (ownerId: string) => {
    const owner = pendingOwners.find((o) => o.id === ownerId);
    setPendingOwners((prev) => prev.filter((o) => o.id !== ownerId));
    Toast.show({
      type: "error",
      text1: "Owner Rejected",
      text2: `${owner?.name} has been rejected.`,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background pt-8">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="border-b border-border bg-card/95 px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive">
              <Shield size={20} className="text-destructive-foreground" />
            </View>
            <View>
              <Text className="text-lg font-bold text-foreground">
                Admin Panel
              </Text>
              <Text className="text-xs text-muted-foreground">
                {user?.name}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onPress={() => router.push("/admin/AdminProfile")}
            >
              <User className="text-foreground" size={24} />
            </Button>
            <Button variant="ghost" size="sm" onPress={handleLogout}>
              <Text className="text-foreground">Logout</Text>
            </Button>
          </View>
        </View>

        <ScrollView
          className="px-4 py-6"
          contentContainerStyle={{ gap: 24, paddingBottom: 40 }}
        >
          {/* Stats Grid */}
          <View className="flex-row flex-wrap gap-4">
            {stats.map((stat) => (
              <Card
                key={stat.label}
                className="border-border min-w-[45%] flex-1"
              >
                <CardContent className="p-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <stat.icon size={20} className={stat.color} />
                    {stat.change !== "-" && (
                      <View className="flex-row items-center gap-1">
                        <TrendingUp size={12} className="text-green-500" />
                        <Text className="text-xs font-medium text-green-500">
                          {stat.change}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    {stat.label}
                  </Text>
                </CardContent>
              </Card>
            ))}
          </View>

          {/* Pending Approvals */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border mb-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Clock size={16} className="text-orange-500" />
                  <CardTitle className="text-base text-foreground">
                    Pending Owner Approvals
                  </CardTitle>
                </View>
                <TouchableOpacity
                  onPress={() => router.push("/admin/OwnerManagement")}
                  className="flex-row items-center"
                >
                  <Text className="text-primary text-sm mr-1">View All</Text>
                  <ChevronRight size={16} className="text-primary" />
                </TouchableOpacity>
              </View>
            </CardHeader>
            <CardContent className="gap-3">
              {pendingOwners.length === 0 ? (
                <Text className="text-sm text-muted-foreground text-center py-4">
                  No pending approvals
                </Text>
              ) : (
                pendingOwners.map((owner) => (
                  <View
                    key={owner.id}
                    className="flex-row items-center justify-between p-3 rounded-xl bg-secondary/50"
                  >
                    <View>
                      <Text className="font-medium text-foreground text-sm">
                        {owner.name}
                      </Text>
                      <Text className="text-xs text-muted-foreground">
                        {owner.email}
                      </Text>
                    </View>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        className="h-8 w-8 items-center justify-center rounded-full bg-green-500/10"
                        onPress={() => approveOwner(owner.id)}
                      >
                        <CheckCircle size={16} className="text-green-500" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="h-8 w-8 items-center justify-center rounded-full bg-destructive/10"
                        onPress={() => rejectOwner(owner.id)}
                      >
                        <XCircle size={16} className="text-destructive" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border mb-3">
              <View className="flex-row items-center gap-2">
                <Activity size={16} className="text-primary" />
                <CardTitle className="text-base text-foreground">
                  Recent Activity
                </CardTitle>
              </View>
            </CardHeader>
            <CardContent className="gap-3">
              {recentActivity.map((activity, index) => (
                <View
                  key={index}
                  className="flex-row items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                >
                  <View
                    className={`mt-1 h-2 w-2 rounded-full ${
                      activity.type === "alert" ? "bg-orange-500" : "bg-primary"
                    }`}
                  />
                  <View className="flex-1">
                    <Text className="text-sm text-foreground">
                      {activity.message}
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      {activity.time}
                    </Text>
                  </View>
                </View>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <View className="flex-row gap-4">
            <Button
              variant="outline"
              className="flex-1 h-auto py-4 flex-col gap-2 items-center"
              onPress={() => router.push("/admin/UserManagement")}
            >
              <Users size={24} className="text-foreground" />
              <Text className="text-sm text-foreground">Manage Users</Text>
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-auto py-4 flex-col gap-2 items-center"
              onPress={() => router.push("/admin/ShopMonitoring")}
            >
              <Store size={24} className="text-foreground" />
              <Text className="text-sm text-foreground">View Shops</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
