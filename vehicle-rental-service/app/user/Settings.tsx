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
import { useState, useEffect } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { profileManagementApi, UserSettings } from "@/services/api";

export default function Settings() {
  const router = useRouter();

  const [settings, setSettings] = useState<UserSettings>({
    push_notifications: true,
    email_notifications: true,
    sms_notifications: false,
    booking_updates: true,
    payment_alerts: true,
    promotions: true,
    reminders: true,
  });

  const [loading, setLoading] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await profileManagementApi.getUserSettings();
        setSettings(data);
      } catch (error) {
        console.error('Failed to load settings:', error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to load settings",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const toggleSetting = async (key: keyof UserSettings) => {
    const newValue = !settings[key];
    try {
      await profileManagementApi.updateUserSettings({ [key]: newValue });
      setSettings((prev) => ({ ...prev, [key]: newValue }));
      Toast.show({
        type: "success",
        text1: "Settings Updated",
        text2: `${key.replace(/_/g, ' ')} updated successfully`,
      });
    } catch (error) {
      console.error('Failed to update settings:', error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update settings",
      });
    }
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
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2dd4bf" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
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
                {renderSwitch(settings.push_notifications, () =>
                  toggleSetting("push_notifications")
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
                {renderSwitch(settings.email_notifications, () =>
                  toggleSetting("email_notifications")
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
                {renderSwitch(settings.sms_notifications, () =>
                  toggleSetting("sms_notifications")
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
                {renderSwitch(settings.booking_updates, () =>
                  toggleSetting("booking_updates")
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
                {renderSwitch(settings.payment_alerts, () =>
                  toggleSetting("payment_alerts")
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
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 16,
    marginTop: 8,
  },
});