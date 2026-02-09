import { bookings } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { UserStackParamList } from "@/navigation/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { format } from "date-fns";
import { Calendar, ChevronRight, Clock, MapPin } from "lucide-react-native";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type BookingsNavigationProp = NativeStackNavigationProp<
  UserStackParamList,
  "Bookings"
>;

export default function Bookings() {
  const navigation = useNavigation<BookingsNavigationProp>();
  const upcomingBookings = bookings.filter((b) => b.status === "upcoming");
  const pastBookings = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled",
  );
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-4 border-b border-border bg-card">
        <Text className="text-2xl font-bold text-foreground">My Bookings</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Upcoming */}
        <View className="mb-8">
          <Text className="mb-4 text-lg font-semibold text-foreground">
            Upcoming
          </Text>
          {upcomingBookings.length > 0 ? (
            <View>
              {upcomingBookings.map((booking) => (
                <View
                  key={booking.id}
                  className="mb-4 rounded-2xl bg-card p-4 shadow-sm border border-border"
                >
                  <View className="flex-row gap-4">
                    <Image
                      source={{ uri: booking.vehicle.images[0] }}
                      className="h-24 w-28 rounded-xl"
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <View className="flex-row items-start justify-between">
                        <View>
                          <Text className="font-bold text-foreground">
                            {booking.vehicle.name}
                          </Text>
                          <View className="mt-1 flex-row items-center gap-1">
                            <MapPin color="#6b7280" size={14} />
                            <Text className="text-sm text-muted-foreground">
                              {booking.shop.name}
                            </Text>
                          </View>
                        </View>
                        <View className="rounded-full bg-primary/10 px-2.5 py-1">
                          <Text className="text-xs font-semibold text-primary capitalize">
                            {booking.status}
                          </Text>
                        </View>
                      </View>
                      <View className="mt-3 flex-row items-center gap-4">
                        <View className="flex-row items-center gap-1">
                          <Calendar color="#6b7280" size={14} />
                          <Text className="text-sm text-muted-foreground">
                            {format(new Date(booking.startDate), "MMM d, yyyy")}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Clock color="#6b7280" size={14} />
                          <Text className="text-sm text-muted-foreground">
                            {format(new Date(booking.startDate), "h:mm a")}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View className="mt-4 flex-row items-center justify-between border-t border-border pt-4">
                    <View>
                      <Text className="text-sm text-muted-foreground">
                        Total
                      </Text>
                      <Text className="text-lg font-bold text-primary">
                        ${booking.totalPrice}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("BookingDetails", {
                          id: booking.id,
                        })
                      } // Assuming BookingDetails is a screen
                      className="flex-row items-center gap-1"
                    >
                      <Text className="text-sm font-semibold text-primary">
                        View Details
                      </Text>
                      <ChevronRight color="#000" size={16} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="rounded-2xl bg-card p-8 items-center border border-border">
              <Calendar
                color="#6b7280"
                size={48}
                style={{ opacity: 0.5, marginBottom: 12 }}
              />
              <Text className="text-muted-foreground">
                No upcoming bookings
              </Text>
            </View>
          )}
        </View>

        {/* Past bookings */}
        <View>
          <Text className="mb-4 text-lg font-semibold text-foreground">
            Past Bookings
          </Text>
          {pastBookings.length > 0 ? (
            <View>
              {pastBookings.map((booking) => (
                <View
                  key={booking.id}
                  className="mb-4 rounded-2xl bg-card p-4 shadow-sm border border-border opacity-75"
                >
                  <View className="flex-row gap-4">
                    <Image
                      source={{ uri: booking.vehicle.images[0] }}
                      className="h-20 w-24 rounded-xl grayscale"
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <View className="flex-row items-start justify-between">
                        <View>
                          <Text className="font-bold text-foreground">
                            {booking.vehicle.name}
                          </Text>
                          <Text className="text-sm text-muted-foreground">
                            {format(new Date(booking.startDate), "MMM d, yyyy")}
                          </Text>
                        </View>
                        <View
                          className={cn(
                            "rounded-full px-2.5 py-1",
                            booking.status === "completed"
                              ? "bg-green-100"
                              : "bg-red-100",
                          )}
                        >
                          <Text
                            className={cn(
                              "text-xs font-semibold capitalize",
                              booking.status === "completed"
                                ? "text-green-700"
                                : "text-red-700",
                            )}
                          >
                            {booking.status}
                          </Text>
                        </View>
                      </View>
                      <View className="mt-2 flex-row items-center justify-between">
                        <Text className="font-semibold text-foreground">
                          ${booking.totalPrice}
                        </Text>
                        <View className="flex-row gap-2">
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate("BookingDetails", {
                                id: booking.id,
                              })
                            }
                          >
                            <Text className="text-sm font-medium text-muted-foreground">
                              Details
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate("VehicleDetails", {
                                id: booking.vehicleId,
                              })
                            }
                          >
                            <Text className="text-sm font-medium text-primary">
                              Book Again
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="rounded-2xl bg-card p-8 items-center border border-border">
              <Text className="text-muted-foreground">No past bookings</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
