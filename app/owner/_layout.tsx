import { Stack } from "expo-router";

export default function OwnerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="OwnerDashboard" />
      <Stack.Screen name="VehicleManagement" />
      <Stack.Screen name="StaffManagement" />
      <Stack.Screen name="ShopManagement" />
      <Stack.Screen name="OwnerProfile" />
      <Stack.Screen name="BookingOverview" />
    </Stack>
  );
}
