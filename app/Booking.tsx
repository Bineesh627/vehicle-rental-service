import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { vehicles } from "@/data/mockData";
import { UserStackParamList } from "@/navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Calendar, Clock, CreditCard } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type BookingRouteProp = RouteProp<UserStackParamList, "Booking">;
type BookingNavigationProp = NativeStackNavigationProp<
  UserStackParamList,
  "Booking"
>;

export default function Booking() {
  const route = useRoute<BookingRouteProp>();
  const navigation = useNavigation<BookingNavigationProp>();
  const { id } = route.params;
  const vehicle = vehicles.find((v) => v.id === id);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  if (!vehicle) return null;

  const handleBooking = () => {
    if (!startDate || !endDate) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select dates",
      });
      return;
    }

    // Simulate booking process
    Toast.show({
      type: "success",
      text1: "Booking Confirmed!",
      text2: `You booked ${vehicle.name}`,
    });

    navigation.navigate("Tabs", { screen: "Bookings" });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center p-4 border-b border-border">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">
          Booking {vehicle.name}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="bg-card rounded-xl p-4 mb-6 shadow-sm border border-border">
          <Text className="font-bold text-lg mb-4">Select Dates</Text>

          <View className="space-y-4">
            <View>
              <Text className="text-sm text-muted-foreground mb-1">
                Start Date
              </Text>
              <View className="flex-row items-center bg-secondary rounded-xl px-3 py-2">
                <Calendar color="#6b7280" size={20} />
                <Input
                  placeholder="YYYY-MM-DD"
                  value={startDate}
                  onChangeText={setStartDate}
                  className="flex-1 ml-2 border-0 bg-transparent h-10"
                />
              </View>
            </View>

            <View>
              <Text className="text-sm text-muted-foreground mb-1">
                End Date
              </Text>
              <View className="flex-row items-center bg-secondary rounded-xl px-3 py-2">
                <Calendar color="#6b7280" size={20} />
                <Input
                  placeholder="YYYY-MM-DD"
                  value={endDate}
                  onChangeText={setEndDate}
                  className="flex-1 ml-2 border-0 bg-transparent h-10"
                />
              </View>
            </View>
          </View>
        </View>

        <View className="bg-card rounded-xl p-4 mb-6 shadow-sm border border-border">
          <Text className="font-bold text-lg mb-4">Select Time</Text>
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-sm text-muted-foreground mb-1">
                Start Time
              </Text>
              <View className="flex-row items-center bg-secondary rounded-xl px-3 py-2">
                <Clock color="#6b7280" size={20} />
                <Input
                  placeholder="00:00"
                  value={startTime}
                  onChangeText={setStartTime}
                  className="flex-1 ml-2 border-0 bg-transparent h-10"
                />
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-sm text-muted-foreground mb-1">
                End Time
              </Text>
              <View className="flex-row items-center bg-secondary rounded-xl px-3 py-2">
                <Clock color="#6b7280" size={20} />
                <Input
                  placeholder="00:00"
                  value={endTime}
                  onChangeText={setEndTime}
                  className="flex-1 ml-2 border-0 bg-transparent h-10"
                />
              </View>
            </View>
          </View>
        </View>

        <View className="bg-card rounded-xl p-4 mb-6 shadow-sm border border-border">
          <Text className="font-bold text-lg mb-4">Payment Method</Text>
          <View className="flex-row items-center gap-3 bg-secondary p-3 rounded-xl border border-primary/20">
            <CreditCard color="#000" size={24} />
            <View>
              <Text className="font-semibold">**** **** **** 4242</Text>
              <Text className="text-xs text-muted-foreground">
                Expires 12/24
              </Text>
            </View>
          </View>
        </View>

        <Button size="lg" onPress={handleBooking} className="mt-4 mb-8">
          <Text className="text-primary-foreground font-bold text-lg">
            Confirm Booking
          </Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
