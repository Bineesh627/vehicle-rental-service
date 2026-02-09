import { Button } from "@/components/ui/button";
import { bookings } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { UserStackParamList } from "@/navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { format } from "date-fns";
import {
  ArrowLeft,
  Bike,
  Calendar,
  Car,
  Clock,
  MapPin,
  Navigation,
  Phone,
} from "lucide-react-native";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type BookingDetailsRouteProp = RouteProp<UserStackParamList, "BookingDetails">;
type BookingDetailsNavigationProp = NativeStackNavigationProp<
  UserStackParamList,
  "BookingDetails"
>;

export default function BookingDetails() {
  const route = useRoute<BookingDetailsRouteProp>();
  const navigation = useNavigation<BookingDetailsNavigationProp>();
  const { id } = route.params;

  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted-foreground">Booking not found</Text>
      </View>
    );
  }

  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center gap-4 px-4 py-4 border-b border-border bg-card">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="rounded-xl bg-secondary p-2.5"
        >
          <ArrowLeft color="#000" size={20} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">
          Booking Details
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Status banner */}
        <View
          className={cn(
            "rounded-2xl p-4 items-center mb-6",
            booking.status === "upcoming" && "bg-primary/10",
            booking.status === "completed" && "bg-green-100",
            booking.status === "cancelled" && "bg-red-100",
            booking.status === "active" && "bg-yellow-100",
          )}
        >
          <Text
            className={cn(
              "text-lg font-semibold capitalize",
              booking.status === "upcoming" && "text-primary",
              booking.status === "completed" && "text-green-700",
              booking.status === "cancelled" && "text-red-700",
              booking.status === "active" && "text-yellow-700",
            )}
          >
            {booking.status === "upcoming"
              ? "🗓️ Upcoming Booking"
              : booking.status === "completed"
                ? "✅ Completed"
                : booking.status === "active"
                  ? "🚗 Active Rental"
                  : "❌ Cancelled"}
          </Text>
        </View>

        {/* Vehicle info */}
        <View className="rounded-2xl bg-card p-4 shadow-sm border border-border mb-6">
          <View className="flex-row gap-4">
            <Image
              source={{ uri: booking.vehicle.images[0] }}
              className="h-28 w-36 rounded-xl"
              resizeMode="cover"
            />
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-2">
                {booking.vehicle.type === "car" ? (
                  <Car color="#000" size={16} />
                ) : (
                  <Bike color="#000" size={16} />
                )}
                <Text className="text-xs font-medium text-muted-foreground uppercase">
                  {booking.vehicle.type}
                </Text>
              </View>
              <Text className="text-lg font-bold text-foreground">
                {booking.vehicle.name}
              </Text>
              <Text className="text-sm text-muted-foreground">
                {booking.vehicle.model}
              </Text>
              <View className="mt-2 flex-row flex-wrap gap-2">
                <View className="bg-secondary px-2 py-1 rounded-md">
                  <Text className="text-xs">
                    {booking.vehicle.transmission}
                  </Text>
                </View>
                <View className="bg-secondary px-2 py-1 rounded-md">
                  <Text className="text-xs">{booking.vehicle.fuelType}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Date & Time */}
        <View className="rounded-2xl bg-card p-5 shadow-sm border border-border mb-6">
          <Text className="mb-4 font-semibold text-foreground">Schedule</Text>
          <View className="space-y-4">
            {/* Pickup */}
            <View className="flex-row items-start gap-4 mb-4">
              <View className="rounded-xl bg-primary/10 p-3">
                <Calendar color="#000" size={20} />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-muted-foreground">
                  Pickup Date
                </Text>
                <Text className="font-semibold text-foreground">
                  {format(startDate, "EEEE, MMMM d, yyyy")}
                </Text>
              </View>
            </View>
            <View className="flex-row items-start gap-4 mb-4">
              <View className="rounded-xl bg-primary/10 p-3">
                <Clock color="#000" size={20} />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-muted-foreground">
                  Pickup Time
                </Text>
                <Text className="font-semibold text-foreground">
                  {format(startDate, "h:mm a")}
                </Text>
              </View>
            </View>

            <View className="h-[1px] bg-border mb-4" />

            {/* Return */}
            <View className="flex-row items-start gap-4 mb-4">
              <View className="rounded-xl bg-secondary p-3">
                <Calendar color="#6b7280" size={20} />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-muted-foreground">
                  Return Date
                </Text>
                <Text className="font-semibold text-foreground">
                  {format(endDate, "EEEE, MMMM d, yyyy")}
                </Text>
              </View>
            </View>
            <View className="flex-row items-start gap-4">
              <View className="rounded-xl bg-secondary p-3">
                <Clock color="#6b7280" size={20} />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-muted-foreground">
                  Return Time
                </Text>
                <Text className="font-semibold text-foreground">
                  {format(endDate, "h:mm a")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Pickup Location */}
        <View className="rounded-2xl bg-card p-5 shadow-sm border border-border mb-6">
          <Text className="mb-4 font-semibold text-foreground">
            Pickup Location
          </Text>
          <View className="flex-row gap-4">
            <Image
              source={{ uri: booking.shop.image }}
              className="h-16 w-16 rounded-xl"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text className="font-semibold text-foreground">
                {booking.shop.name}
              </Text>
              <View className="mt-1 flex-row items-center gap-1">
                <MapPin color="#6b7280" size={14} />
                <Text className="text-sm text-muted-foreground">
                  {booking.shop.address}
                </Text>
              </View>
            </View>
          </View>
          <View className="mt-4 flex-row gap-2">
            <Button variant="outline" size="sm" className="flex-1 flex-row">
              <Phone color="#000" size={16} style={{ marginRight: 8 }} />
              <Text>Call Shop</Text>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 flex-row">
              <Navigation color="#000" size={16} style={{ marginRight: 8 }} />
              <Text>Directions</Text>
            </Button>
          </View>
        </View>

        {/* Payment Summary */}
        <View className="rounded-2xl bg-card p-5 shadow-sm border border-border mb-6">
          <Text className="mb-4 font-semibold text-foreground">
            Payment Summary
          </Text>
          <View className="space-y-3">
            <View className="flex-row justify-between mb-2">
              <Text className="text-muted-foreground">Rental charges</Text>
              <Text className="font-medium text-foreground">
                ${booking.totalPrice - 5}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-muted-foreground">Service fee</Text>
              <Text className="font-medium text-foreground">$5</Text>
            </View>
            <View className="my-3 h-[1px] bg-border" />
            <View className="flex-row justify-between">
              <Text className="text-lg font-semibold text-foreground">
                Total Paid
              </Text>
              <Text className="text-lg font-bold text-primary">
                ${booking.totalPrice}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom action */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-border bg-card p-4 pb-8">
        <View className="flex-row gap-3">
          {booking.status === "upcoming" && (
            <>
              <Button variant="outline" className="flex-1">
                <Text className="text-destructive font-semibold">Cancel</Text>
              </Button>
              <Button className="flex-1">
                <Text className="text-primary-foreground font-semibold">
                  Modify
                </Text>
              </Button>
            </>
          )}
          {booking.status === "completed" && (
            <Button
              className="flex-1"
              onPress={() =>
                navigation.navigate("VehicleDetails", { id: booking.vehicleId })
              }
            >
              <Text className="text-primary-foreground font-semibold">
                Book Again
              </Text>
            </Button>
          )}
          {booking.status === "cancelled" && (
            <Button
              className="flex-1"
              onPress={() =>
                navigation.navigate("VehicleDetails", { id: booking.vehicleId })
              }
            >
              <Text className="text-primary-foreground font-semibold">
                Rebook Vehicle
              </Text>
            </Button>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
