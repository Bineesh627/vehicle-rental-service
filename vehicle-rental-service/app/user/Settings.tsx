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
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

  const renderSwitch = (value: boolean, onValueChange: () => void) => (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#334155", true: "#2dd4bf" }}
      thumbColor={Platform.OS === "ios" ? "#ffffff" : "#ffffff"}
      ios_backgroundColor="#334155"
    />
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Notification Channels */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Bell size={18} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Notification Channels</Text>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, styles.iconTeal]}>
                    <Bell size={20} color="#2dd4bf" />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.settingLabel}>Push Notifications</Text>
                    <Text style={styles.settingDescription}>
                      Receive push notifications on your device
                    </Text>
                  </View>
                </View>
                {renderSwitch(settings.pushNotifications, () =>
                  toggleSetting("pushNotifications")
                )}
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, styles.iconPurple]}>
                    <Mail size={20} color="#a855f7" />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.settingLabel}>Email Notifications</Text>
                    <Text style={styles.settingDescription}>
                      Receive updates via email
                    </Text>
                  </View>
                </View>
                {renderSwitch(settings.emailNotifications, () =>
                  toggleSetting("emailNotifications")
                )}
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, styles.iconGreen]}>
                    <MessageSquare size={20} color="#22c55e" />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.settingLabel}>SMS Notifications</Text>
                    <Text style={styles.settingDescription}>
                      Receive SMS alerts
                    </Text>
                  </View>
                </View>
                {renderSwitch(settings.smsNotifications, () =>
                  toggleSetting("smsNotifications")
                )}
              </View>
            </View>
          </View>

          {/* Notification Types */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Notification Types</Text>
              <Text style={styles.headerSubtitle}>
                Choose what you want to be notified about
              </Text>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, styles.iconTeal]}>
                    <Car size={20} color="#2dd4bf" />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.settingLabel}>Booking Updates</Text>
                    <Text style={styles.settingDescription}>
                      Status changes, confirmations
                    </Text>
                  </View>
                </View>
                {renderSwitch(settings.bookingUpdates, () =>
                  toggleSetting("bookingUpdates")
                )}
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, styles.iconGreen]}>
                    <CreditCard size={20} color="#22c55e" />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.settingLabel}>Payment Alerts</Text>
                    <Text style={styles.settingDescription}>
                      Payment confirmations, refunds
                    </Text>
                  </View>
                </View>
                {renderSwitch(settings.paymentAlerts, () =>
                  toggleSetting("paymentAlerts")
                )}
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, styles.iconPurple]}>
                    <Gift size={20} color="#a855f7" />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.settingLabel}>Promotions & Offers</Text>
                    <Text style={styles.settingDescription}>
                      Deals, discounts, special offers
                    </Text>
                  </View>
                </View>
                {renderSwitch(settings.promotions, () =>
                  toggleSetting("promotions")
                )}
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, styles.iconOrange]}>
                    <Clock size={20} color="#f97316" />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.settingLabel}>Ride Reminders</Text>
                    <Text style={styles.settingDescription}>
                      Upcoming bookings, returns
                    </Text>
                  </View>
                </View>
                {renderSwitch(settings.reminders, () =>
                  toggleSetting("reminders")
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // Dark background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 24,
  },
  card: {
    backgroundColor: "#1e293b", // Slate-800
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    overflow: "hidden",
  },
  cardHeader: {
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#94a3b8", // Slate-400
    marginTop: 4,
  },
  cardContent: {
    padding: 16,
    gap: 20,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    paddingRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12, // Slightly rounded square
    alignItems: "center",
    justifyContent: "center",
  },
  iconTeal: { backgroundColor: "rgba(45, 212, 191, 0.1)" },
  iconPurple: { backgroundColor: "rgba(168, 85, 247, 0.1)" },
  iconGreen: { backgroundColor: "rgba(34, 197, 94, 0.1)" },
  iconOrange: { backgroundColor: "rgba(249, 115, 22, 0.1)" },
  textContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: "#94a3b8", // Slate-400
  },
});