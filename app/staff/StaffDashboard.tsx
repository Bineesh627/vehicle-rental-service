import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import {
  CheckCircle,
  ChevronRight,
  Clock,
  MapPin,
  Navigation,
  Package,
  Phone,
  Truck,
  User,
  Wrench,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const stats = [
  { label: "Assigned Today", value: "5", icon: Package, color: "text-primary" },
  {
    label: "Completed",
    value: "3",
    icon: CheckCircle,
    color: "text-green-500",
  },
  { label: "Pending", value: "2", icon: Clock, color: "text-orange-500" },
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
    <View className="p-4 rounded-xl bg-secondary/50 gap-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          {isDelivery ? (
            <Truck size={16} className="text-primary" />
          ) : (
            <Package size={16} className="text-orange-500" />
          )}
          <View
            className={`px-2 py-0.5 rounded-full ${
              isDelivery ? "bg-primary/10" : "bg-orange-500/10"
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                isDelivery ? "text-primary" : "text-orange-500"
              }`}
            >
              {isDelivery ? "Delivery" : "Pickup"}
            </Text>
          </View>
        </View>
        <Text className="text-xs text-muted-foreground">{task.time}</Text>
      </View>

      <View>
        <Text className="font-semibold text-foreground text-base">
          {task.vehicle}
        </Text>
        <Text className="text-sm text-muted-foreground">{task.customer}</Text>
      </View>

      <View className="flex-row items-start gap-2">
        <MapPin size={16} className="text-muted-foreground mt-0.5" />
        <Text className="text-sm text-muted-foreground flex-1">
          {task.address}
        </Text>
      </View>

      <View className="flex-row gap-2 mt-1">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 flex-row gap-1"
          onPress={() => handleCall(task.phone, task.customer)}
        >
          <Phone size={12} className="text-foreground" />
          <Text className="text-foreground text-xs">Call</Text>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 flex-row gap-1"
          onPress={() => handleNavigate(task.address)}
        >
          <Navigation size={12} className="text-foreground" />
          <Text className="text-foreground text-xs">Navigate</Text>
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onPress={() =>
            isDelivery ? markAsDelivered(task.id) : markAsPickedUp(task.id)
          }
        >
          <Text className="text-primary-foreground text-xs font-semibold">
            {isDelivery ? "Delivered" : "Picked Up"}
          </Text>
        </Button>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background pt-8">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="border-b border-border bg-card/95 px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500">
              <Wrench size={20} className="text-white" />
            </View>
            <View>
              <Text className="text-lg font-bold text-foreground">
                Staff Dashboard
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
              onPress={() => router.push("/staff/StaffProfile")}
            >
              <User size={20} className="text-foreground" />
            </Button>
            <Button variant="ghost" size="sm" onPress={handleLogout}>
              <Text className="text-foreground">Logout</Text>
            </Button>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-4 py-6"
          contentContainerStyle={{ gap: 24, paddingBottom: 40 }}
        >
          {/* Stats */}
          <View className="flex-row gap-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-border flex-1">
                <CardContent className="p-3 items-center">
                  <stat.icon size={20} className={`mb-1 ${stat.color}`} />
                  <Text className="text-xl font-bold text-foreground">
                    {stat.value}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    {stat.label}
                  </Text>
                </CardContent>
              </Card>
            ))}
          </View>

          {/* Delivery Tasks */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border mb-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Truck size={16} className="text-primary" />
                  <CardTitle className="text-base text-foreground">
                    Delivery Tasks
                  </CardTitle>
                </View>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => router.push("/staff/AssignedTasks")}
                  className="flex-row items-center"
                >
                  <Text className="text-primary text-xs mr-1">View All</Text>
                  <ChevronRight size={16} className="text-primary" />
                </Button>
              </View>
            </CardHeader>
            <CardContent className="gap-3">
              {deliveryTasks.length === 0 ? (
                <Text className="text-sm text-muted-foreground text-center py-4">
                  No pending deliveries
                </Text>
              ) : (
                deliveryTasks.map((task) => (
                  <TaskCard key={task.id} task={task} isDelivery={true} />
                ))
              )}
            </CardContent>
          </Card>

          {/* Pickup Tasks */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border mb-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Package size={16} className="text-orange-500" />
                  <CardTitle className="text-base text-foreground">
                    Pickup Tasks
                  </CardTitle>
                </View>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => router.push("/staff/AssignedTasks")}
                  className="flex-row items-center"
                >
                  <Text className="text-primary text-xs mr-1">View All</Text>
                  <ChevronRight size={16} className="text-primary" />
                </Button>
              </View>
            </CardHeader>
            <CardContent className="gap-3">
              {pickupTasks.length === 0 ? (
                <Text className="text-sm text-muted-foreground text-center py-4">
                  No pending pickups
                </Text>
              ) : (
                pickupTasks.map((task) => (
                  <TaskCard key={task.id} task={task} isDelivery={false} />
                ))
              )}
            </CardContent>
          </Card>

          {/* Mock Map Preview */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push("/staff/AssignedTasks")}
          >
            <Card className="border-border overflow-hidden">
              <View className="h-48 bg-primary/10 items-center justify-center">
                <View className="items-center">
                  <MapPin size={32} className="text-primary mb-2" />
                  <Text className="text-sm font-medium text-foreground">
                    Task Locations Map
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    Tap to view full map
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
