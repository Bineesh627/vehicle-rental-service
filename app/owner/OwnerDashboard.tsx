import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import {
  Calendar,
  Car,
  ChevronRight,
  DollarSign,
  Plus,
  Star,
  Store,
  TrendingUp,
  User,
  Users,
} from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const stats = [
  {
    label: "Total Revenue",
    value: "$12,847",
    change: "+18%",
    icon: DollarSign,
    color: "text-green-500",
  },
  {
    label: "Active Bookings",
    value: "34",
    change: "+5%",
    icon: Calendar,
    color: "text-primary",
  },
  {
    label: "Total Vehicles",
    value: "48",
    change: "+2",
    icon: Car,
    color: "text-purple-500",
  },
  {
    label: "Staff Members",
    value: "8",
    change: "-",
    icon: Users,
    color: "text-orange-500",
  },
];

const shops = [
  {
    id: "1",
    name: "SpeedWheels Downtown",
    vehicles: 15,
    bookings: 12,
    rating: 4.8,
  },
  {
    id: "2",
    name: "SpeedWheels Midtown",
    vehicles: 20,
    bookings: 18,
    rating: 4.6,
  },
  {
    id: "3",
    name: "SpeedWheels Airport",
    vehicles: 13,
    bookings: 4,
    rating: 4.9,
  },
];

const recentBookings = [
  {
    id: "1",
    vehicle: "Toyota Camry",
    customer: "John D.",
    status: "Active",
    amount: "$89",
  },
  {
    id: "2",
    vehicle: "Honda Activa",
    customer: "Sarah M.",
    status: "Pending Pickup",
    amount: "$30",
  },
  {
    id: "3",
    vehicle: "BMW 3 Series",
    customer: "Mike R.",
    status: "Completed",
    amount: "$199",
  },
];

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/Login");
  };

  return (
    <SafeAreaView className="flex-1 bg-background pt-8">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="border-b border-border bg-card/95 px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500">
              <Store size={20} className="text-white" />
            </View>
            <View>
              <Text className="text-lg font-bold text-foreground">
                Owner Dashboard
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
              onPress={() => router.push("/owner/OwnerProfile")}
            >
              <User size={24} className="text-foreground" />
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

          {/* My Shops */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border mb-3">
              <View className="flex-row items-center justify-between">
                <CardTitle className="text-base text-foreground">
                  My Rental Shops
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 gap-1"
                  onPress={() => router.push("/owner/ShopManagement")}
                >
                  <Plus size={16} className="text-primary" />
                  <Text className="text-primary text-xs">Add</Text>
                </Button>
              </View>
            </CardHeader>
            <CardContent className="gap-3">
              {shops.map((shop) => (
                <TouchableOpacity
                  key={shop.id}
                  className="flex-row items-center justify-between p-3 rounded-xl bg-secondary/50"
                  onPress={() => router.push("/owner/ShopManagement")}
                >
                  <View className="flex-1">
                    <Text className="font-medium text-foreground text-sm">
                      {shop.name}
                    </Text>
                    <View className="flex-row items-center gap-3 mt-1">
                      <Text className="text-xs text-muted-foreground">
                        {shop.vehicles} vehicles
                      </Text>
                      <Text className="text-xs text-muted-foreground">
                        {shop.bookings} bookings
                      </Text>
                      <View className="flex-row items-center gap-1">
                        <Star
                          size={12}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        <Text className="text-xs text-muted-foreground">
                          {shop.rating}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </TouchableOpacity>
              ))}
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border mb-3">
              <View className="flex-row items-center justify-between">
                <CardTitle className="text-base text-foreground">
                  Recent Bookings
                </CardTitle>
                <TouchableOpacity
                  onPress={() => router.push("/owner/BookingOverview")}
                  className="flex-row items-center"
                >
                  <Text className="text-primary text-sm mr-1">View All</Text>
                  <ChevronRight size={16} className="text-primary" />
                </TouchableOpacity>
              </View>
            </CardHeader>
            <CardContent className="gap-3">
              {recentBookings.map((booking) => (
                <View
                  key={booking.id}
                  className="flex-row items-center justify-between p-3 rounded-xl bg-secondary/50"
                >
                  <View>
                    <Text className="font-medium text-foreground text-sm">
                      {booking.vehicle}
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      {booking.customer}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-semibold text-foreground text-sm">
                      {booking.amount}
                    </Text>
                    <Text
                      className={`text-xs ${
                        booking.status === "Active"
                          ? "text-green-500"
                          : booking.status === "Pending Pickup"
                            ? "text-orange-500"
                            : "text-muted-foreground"
                      }`}
                    >
                      {booking.status}
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
              onPress={() => router.push("/owner/VehicleManagement")}
            >
              <Car size={24} className="text-foreground" />
              <Text className="text-sm text-foreground">Manage Vehicles</Text>
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-auto py-4 flex-col gap-2 items-center"
              onPress={() => router.push("/owner/StaffManagement")}
            >
              <Users size={24} className="text-foreground" />
              <Text className="text-sm text-foreground">Manage Staff</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
