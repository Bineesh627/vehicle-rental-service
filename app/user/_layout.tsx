import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EditProfile" />
      <Stack.Screen name="KYCVerification" />
      <Stack.Screen name="SavedLocations" />
      <Stack.Screen name="PaymentMethods" />
      <Stack.Screen name="Notifications" />
      <Stack.Screen name="Settings" />
      <Stack.Screen name="HelpSupport" />
      <Stack.Screen name="PrivacySecurity" />
    </Stack>
  );
}
