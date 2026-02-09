import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  Car,
  Clock,
  Eye,
  XCircle,
} from "lucide-react-native";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface OwnerBooking {
  id: string;
  vehicleName: string;
  customerName: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: "pending" | "active" | "completed" | "cancelled";
  deliveryType: "self-pickup" | "home-delivery";
  returnType: "return-to-shop" | "schedule-pickup";
}

const mockBookings: OwnerBooking[] = [
  {
    id: "ob1",
    vehicleName: "Toyota Camry",
    customerName: "John Davis",
    customerPhone: "+1 555-1234",
    startDate: "2024-02-15T10:00:00",
    endDate: "2024-02-16T10:00:00",
    amount: 89,
    status: "active",
    deliveryType: "home-delivery",
    returnType: "schedule-pickup",
  },
  {
    id: "ob2",
    vehicleName: "Honda Civic",
    customerName: "Sarah Miller",
    customerPhone: "+1 555-5678",
    startDate: "2024-02-16T09:00:00",
    endDate: "2024-02-16T18:00:00",
    amount: 75,
    status: "pending",
    deliveryType: "self-pickup",
    returnType: "return-to-shop",
  },
  {
    id: "ob3",
    vehicleName: "BMW 3 Series",
    customerName: "Mike Ross",
    customerPhone: "+1 555-9012",
    startDate: "2024-02-10T09:00:00",
    endDate: "2024-02-12T09:00:00",
    amount: 398,
    status: "completed",
    deliveryType: "home-delivery",
    returnType: "schedule-pickup",
  },
  {
    id: "ob4",
    vehicleName: "Royal Enfield Classic",
    customerName: "Emily Chen",
    customerPhone: "+1 555-3456",
    startDate: "2024-02-08T10:00:00",
    endDate: "2024-02-08T18:00:00",
    amount: 45,
    status: "cancelled",
    deliveryType: "self-pickup",
    returnType: "return-to-shop",
  },
];

export default function BookingOverview() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<OwnerBooking | null>(
    null,
  );
  const [showDetails, setShowDetails] = useState(false);

  const filteredBookings = mockBookings.filter((b) => {
    if (activeTab === "all") return true;
    return b.status === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500";
      case "pending":
        return "bg-orange-500/10 text-orange-500";
      case "completed":
        return "bg-primary/10 text-primary";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background pt-8">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="border-b border-border bg-card/95 px-4 py-3 flex-row items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onPress={() => router.push("/owner/OwnerDashboard")}
          >
            <ArrowLeft size={20} className="text-foreground" />
          </Button>
          <Text className="text-lg font-bold text-foreground">
            Booking Overview
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-4 py-6"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Stats */}
          <View className="flex-row flex-wrap gap-2 mb-6">
            <Card className="border-border flex-1 min-w-[22%]">
              <CardContent className="p-3 items-center">
                <Text className="text-lg font-bold text-foreground">
                  {mockBookings.length}
                </Text>
                <Text className="text-xs text-muted-foreground">Total</Text>
              </CardContent>
            </Card>
            <Card className="border-border flex-1 min-w-[22%]">
              <CardContent className="p-3 items-center">
                <Text className="text-lg font-bold text-green-500">
                  {mockBookings.filter((b) => b.status === "active").length}
                </Text>
                <Text className="text-xs text-muted-foreground">Active</Text>
              </CardContent>
            </Card>
            <Card className="border-border flex-1 min-w-[22%]">
              <CardContent className="p-3 items-center">
                <Text className="text-lg font-bold text-orange-500">
                  {mockBookings.filter((b) => b.status === "pending").length}
                </Text>
                <Text className="text-xs text-muted-foreground">Pending</Text>
              </CardContent>
            </Card>
            <Card className="border-border flex-1 min-w-[22%]">
              <CardContent className="p-3 items-center">
                <Text className="text-lg font-bold text-foreground">
                  $
                  {mockBookings
                    .filter((b) => b.status === "completed")
                    .reduce((sum, b) => sum + b.amount, 0)}
                </Text>
                <Text className="text-xs text-muted-foreground">Revenue</Text>
              </CardContent>
            </Card>
          </View>

          {/* Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
            contentContainerStyle={{ gap: 8 }}
          >
            {["all", "pending", "active", "completed", "cancelled"].map(
              (tab) => (
                <TouchableOpacity
                  key={tab}
                  className={`px-4 py-2 rounded-full border ${
                    activeTab === tab
                      ? "bg-primary border-primary"
                      : "bg-background border-border"
                  }`}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    className={`text-sm capitalize ${
                      activeTab === tab
                        ? "text-primary-foreground font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </ScrollView>

          {/* Bookings List */}
          <View className="gap-3">
            {filteredBookings.length === 0 ? (
              <Card className="border-border">
                <CardContent className="p-8 items-center">
                  <Calendar size={48} className="text-muted-foreground mb-3" />
                  <Text className="text-muted-foreground">
                    No bookings found
                  </Text>
                </CardContent>
              </Card>
            ) : (
              filteredBookings.map((booking) => (
                <Card key={booking.id} className="border-border">
                  <CardContent className="p-4">
                    <View className="flex-row justify-between">
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2">
                          <Car size={16} className="text-primary" />
                          <Text className="font-medium text-foreground">
                            {booking.vehicleName}
                          </Text>
                        </View>
                        <Text className="text-sm text-muted-foreground mt-1">
                          {booking.customerName}
                        </Text>
                        <View className="flex-row items-center gap-2 mt-2">
                          <Clock size={12} className="text-muted-foreground" />
                          <Text className="text-xs text-muted-foreground">
                            {formatDate(booking.startDate)} -{" "}
                            {formatDate(booking.endDate)}
                          </Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <View
                          className={`px-2 py-1 rounded-full ${getStatusColor(
                            booking.status,
                          )}`}
                        >
                          <Text
                            className={`text-xs capitalize ${
                              getStatusColor(booking.status).split(" ")[1]
                            }`}
                          >
                            {booking.status}
                          </Text>
                        </View>
                        <Text className="text-lg font-bold text-green-500 mt-2">
                          ${booking.amount}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row gap-2 mt-3 pt-3 border-t border-border">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 flex-row gap-2"
                        onPress={() => {
                          setSelectedBooking(booking);
                          setShowDetails(true);
                        }}
                      >
                        <Eye size={16} className="text-foreground" />
                        <Text>View</Text>
                      </Button>
                    </View>
                  </CardContent>
                </Card>
              ))
            )}
          </View>
        </ScrollView>

        {/* Booking Details Modal */}
        <Modal
          visible={showDetails}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDetails(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <View className="bg-background w-full max-w-sm rounded-xl p-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-foreground">
                  Booking Details
                </Text>
                <TouchableOpacity onPress={() => setShowDetails(false)}>
                  <XCircle size={24} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>

              {selectedBooking && (
                <View className="gap-4">
                  <View className="flex-row items-center justify-between p-3 rounded-lg bg-secondary">
                    <View className="flex-row items-center gap-2">
                      <Car size={20} className="text-primary" />
                      <View>
                        <Text className="font-medium text-foreground">
                          {selectedBooking.vehicleName}
                        </Text>
                        <Text className="text-xs text-muted-foreground">
                          Booking #{selectedBooking.id}
                        </Text>
                      </View>
                    </View>
                    <View
                      className={`px-2 py-1 rounded-full ${getStatusColor(
                        selectedBooking.status,
                      )}`}
                    >
                      <Text
                        className={`text-xs capitalize ${
                          getStatusColor(selectedBooking.status).split(" ")[1]
                        }`}
                      >
                        {selectedBooking.status}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row gap-3">
                    <View className="flex-1 p-3 rounded-lg bg-secondary">
                      <Text className="text-xs text-muted-foreground">
                        Customer
                      </Text>
                      <Text className="font-medium text-foreground">
                        {selectedBooking.customerName}
                      </Text>
                      <Text className="text-xs text-muted-foreground">
                        {selectedBooking.customerPhone}
                      </Text>
                    </View>
                    <View className="flex-1 p-3 rounded-lg bg-secondary">
                      <Text className="text-xs text-muted-foreground">
                        Amount
                      </Text>
                      <Text className="text-xl font-bold text-green-500">
                        ${selectedBooking.amount}
                      </Text>
                    </View>
                  </View>

                  <View className="p-3 rounded-lg bg-secondary">
                    <Text className="text-xs text-muted-foreground mb-2">
                      Schedule
                    </Text>
                    <View className="flex-row justify-between">
                      <View>
                        <Text className="text-xs text-muted-foreground">
                          Start
                        </Text>
                        <Text className="font-medium text-foreground">
                          {formatDate(selectedBooking.startDate)}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-xs text-muted-foreground">
                          End
                        </Text>
                        <Text className="font-medium text-foreground">
                          {formatDate(selectedBooking.endDate)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row gap-3">
                    <View className="flex-1 p-3 rounded-lg bg-secondary">
                      <Text className="text-xs text-muted-foreground">
                        Delivery
                      </Text>
                      <Text className="font-medium text-foreground capitalize">
                        {selectedBooking.deliveryType.replace("-", " ")}
                      </Text>
                    </View>
                    <View className="flex-1 p-3 rounded-lg bg-secondary">
                      <Text className="text-xs text-muted-foreground">
                        Return
                      </Text>
                      <Text className="font-medium text-foreground capitalize">
                        {selectedBooking.returnType.replace("-", " ")}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
