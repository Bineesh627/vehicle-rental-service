import { useRouter } from "expo-router";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  Key,
  Lock,
  Shield,
  Smartphone,
  X,
} from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function PrivacySecurity() {
  const router = useRouter();

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    biometricLogin: true,
    loginAlerts: true,
    dataSharing: false,
    locationTracking: true,
    marketingEmails: false,
  });
  const [sessions] = useState([
    {
      id: "1",
      device: "iPhone 14 Pro",
      location: "New York, US",
      lastActive: "Active now",
      current: true,
    },
    {
      id: "2",
      device: "MacBook Pro",
      location: "New York, US",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      id: "3",
      device: "iPad Air",
      location: "Boston, US",
      lastActive: "3 days ago",
      current: false,
    },
  ]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    Toast.show({
      type: "success",
      text1: "Setting Updated",
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

  const handleChangePassword = () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields.",
      });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "New passwords do not match.",
      });
      return;
    }
    Toast.show({
      type: "success",
      text1: "Password Changed",
      text2: "Your password has been updated successfully.",
    });
    setShowPasswordDialog(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleLogoutSession = (sessionId: string) => {
    Toast.show({
      type: "success",
      text1: "Session Ended",
      text2: "Device has been logged out.",
    });
  };

  const handleLogoutAll = () => {
    Toast.show({
      type: "success",
      text1: "All Sessions Ended",
      text2: "You've been logged out from all other devices.",
    });
  };

  const handleDeleteAccount = () => {
    Toast.show({
      type: "error",
      text1: "Account Scheduled for Deletion",
    });
    setShowDeleteDialog(false);
  };

  // Helper for Input with Icon
  const renderPasswordInput = (
    label: string,
    value: string,
    field: keyof typeof passwordForm,
    showKey: keyof typeof showPasswords,
    placeholder: string
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          secureTextEntry={!showPasswords[showKey]}
          value={value}
          onChangeText={(text) =>
            setPasswordForm((prev) => ({ ...prev, [field]: text }))
          }
          placeholder={placeholder}
          placeholderTextColor="#64748b"
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() =>
            setShowPasswords((prev) => ({ ...prev, [showKey]: !prev[showKey] }))
          }
        >
          {showPasswords[showKey] ? (
            <EyeOff size={20} color="#94a3b8" />
          ) : (
            <Eye size={20} color="#94a3b8" />
          )}
        </TouchableOpacity>
      </View>
    </View>
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
          <Text style={styles.headerTitle}>Privacy & Security</Text>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Security */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Shield size={18} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Security</Text>
            </View>

            <View style={styles.cardContent}>
              <TouchableOpacity
                style={styles.changePasswordButton}
                onPress={() => setShowPasswordDialog(true)}
              >
                <Key size={18} color="#0f172a" style={{ marginRight: 8 }} />
                <Text style={styles.changePasswordText}>Change Password</Text>
              </TouchableOpacity>

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Smartphone size={20} color="#94a3b8" />
                  <View style={styles.textContainer}>
                    <Text style={styles.settingLabel}>
                      Two-Factor Authentication
                    </Text>
                    <Text style={styles.settingDescription}>
                      Add extra security
                    </Text>
                  </View>
                </View>
                {renderSwitch(settings.twoFactorAuth, () =>
                  toggleSetting("twoFactorAuth")
                )}
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Eye size={20} color="#94a3b8" />
                  <View style={styles.textContainer}>
                    <Text style={styles.settingLabel}>Biometric Login</Text>
                    <Text style={styles.settingDescription}>
                      Use fingerprint or face ID
                    </Text>
                  </View>
                </View>
                {renderSwitch(settings.biometricLogin, () =>
                  toggleSetting("biometricLogin")
                )}
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <AlertTriangle size={20} color="#94a3b8" />
                  <View style={styles.textContainer}>
                    <Text style={styles.settingLabel}>Login Alerts</Text>
                    <Text style={styles.settingDescription}>
                      Get notified of new logins
                    </Text>
                  </View>
                </View>
                {renderSwitch(settings.loginAlerts, () =>
                  toggleSetting("loginAlerts")
                )}
              </View>
            </View>
          </View>

          {/* Active Sessions */}
          <View style={styles.card}>
            <View style={[styles.cardHeader, { justifyContent: 'space-between' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Smartphone size={18} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={styles.cardTitle}>Active Sessions</Text>
              </View>
              <TouchableOpacity onPress={handleLogoutAll}>
                <Text style={styles.logoutAllText}>Logout All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cardContent}>
              {sessions.map((session) => (
                <View key={session.id} style={styles.sessionRow}>
                  <View style={styles.sessionLeft}>
                    <Smartphone size={24} color="#64748b" />
                    <View style={styles.sessionInfo}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={styles.sessionDevice}>{session.device}</Text>
                        {session.current && (
                          <View style={styles.currentBadge}>
                            <Text style={styles.currentBadgeText}>Current</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.sessionMeta}>
                        {session.location} • {session.lastActive}
                      </Text>
                    </View>
                  </View>
                  {!session.current && (
                    <TouchableOpacity onPress={() => handleLogoutSession(session.id)}>
                      <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Privacy */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Lock size={18} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Privacy</Text>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.settingRow}>
                <View style={styles.textContainerNoIcon}>
                  <Text style={styles.settingLabel}>Data Sharing</Text>
                  <Text style={styles.settingDescription}>
                    Share data with partners for offers
                  </Text>
                </View>
                {renderSwitch(settings.dataSharing, () =>
                  toggleSetting("dataSharing")
                )}
              </View>

              <View style={styles.settingRow}>
                <View style={styles.textContainerNoIcon}>
                  <Text style={styles.settingLabel}>Location Tracking</Text>
                  <Text style={styles.settingDescription}>
                    Allow location access for delivery
                  </Text>
                </View>
                {renderSwitch(settings.locationTracking, () =>
                  toggleSetting("locationTracking")
                )}
              </View>

              <View style={styles.settingRow}>
                <View style={styles.textContainerNoIcon}>
                  <Text style={styles.settingLabel}>Marketing Emails</Text>
                  <Text style={styles.settingDescription}>
                    Receive promotional emails
                  </Text>
                </View>
                {renderSwitch(settings.marketingEmails, () =>
                  toggleSetting("marketingEmails")
                )}
              </View>
            </View>
          </View>

          {/* Policies */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              {["Privacy Policy", "Terms of Service", "Data Usage Policy"].map(
                (item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.policyItem,
                      index === 2 && styles.noBorder,
                    ]}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <FileText
                        size={16}
                        color="#94a3b8"
                        style={{ marginRight: 12 }}
                      />
                      <Text style={styles.policyText}>{item}</Text>
                    </View>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>

          {/* Delete Account */}
          <View style={[styles.card, styles.deleteCard]}>
            <View style={styles.cardContent}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <AlertTriangle size={18} color="#ef4444" style={{ marginRight: 8 }} />
                <Text style={styles.deleteTitle}>Delete Account</Text>
              </View>
              <Text style={styles.deleteDescription}>
                Permanently delete your account and all associated data.
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => setShowDeleteDialog(true)}
              >
                <Text style={styles.deleteButtonText}>Delete My Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Change Password Modal */}
        <Modal
          visible={showPasswordDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPasswordDialog(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Lock size={18} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={styles.modalTitle}>Change Password</Text>
                </View>
                <TouchableOpacity onPress={() => setShowPasswordDialog(false)}>
                  <X size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <View style={styles.form}>
                {renderPasswordInput(
                  "Current Password",
                  passwordForm.currentPassword,
                  "currentPassword",
                  "current",
                  "Enter current password"
                )}
                {renderPasswordInput(
                  "New Password",
                  passwordForm.newPassword,
                  "newPassword",
                  "new",
                  "Enter new password"
                )}
                {renderPasswordInput(
                  "Confirm New Password",
                  passwordForm.confirmPassword,
                  "confirmPassword",
                  "confirm",
                  "Confirm new password"
                )}
              </View>

              <TouchableOpacity
                style={styles.updatePasswordButton}
                onPress={handleChangePassword}
              >
                <Text style={styles.updatePasswordText}>Update Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Delete Account Modal */}
        <Modal
          visible={showDeleteDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDeleteDialog(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: "#ef4444" }]}>
                  Delete Account
                </Text>
                <TouchableOpacity onPress={() => setShowDeleteDialog(false)}>
                  <X size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <View style={styles.form}>
                <Text style={styles.deleteWarningText}>
                  Are you sure you want to delete your account? This action cannot be undone.
                </Text>
                <View style={styles.warningList}>
                  <Text style={styles.warningItem}>• All personal data will be removed</Text>
                  <Text style={styles.warningItem}>• Active bookings will be cancelled</Text>
                  <Text style={styles.warningItem}>• Saved payment methods will be deleted</Text>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowDeleteDialog(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmDeleteButton}
                  onPress={handleDeleteAccount}
                >
                  <Text style={styles.confirmDeleteText}>Delete Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  cardContent: {
    padding: 16,
    gap: 20,
  },
  // Security Section Styles
  changePasswordButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2dd4bf", // Teal
    paddingVertical: 14,
    borderRadius: 9999,
    marginBottom: 8,
  },
  changePasswordText: {
    color: "#0f172a", // Dark text
    fontWeight: "600",
    fontSize: 16,
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
  textContainer: {
    flex: 1,
  },
  textContainerNoIcon: {
    flex: 1,
    paddingRight: 16,
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
  // Active Sessions Styles
  logoutAllText: {
    color: "#ef4444", // Red-500
    fontSize: 12,
    fontWeight: "600",
  },
  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  sessionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionDevice: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "500",
  },
  currentBadge: {
    backgroundColor: "rgba(34, 197, 94, 0.1)", // Green tint
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentBadgeText: {
    color: "#22c55e", // Green-500
    fontSize: 10,
    fontWeight: "bold",
  },
  sessionMeta: {
    fontSize: 12,
    color: "#64748b", // Slate-500
    marginTop: 2,
  },
  logoutText: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "600",
  },
  // Policies
  policyItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  policyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  // Delete Account
  deleteCard: {
    borderColor: "rgba(239, 68, 68, 0.2)",
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  deleteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  deleteDescription: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: "#b91c1c", // Dark Red
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    width: 140,
  },
  deleteButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    backgroundColor: "#020617",
    width: "100%",
    maxWidth: 360,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "500",
  },
  passwordContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#334155",
    fontSize: 14,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  updatePasswordButton: {
    backgroundColor: "#2dd4bf", // Teal
    paddingVertical: 14,
    borderRadius: 9999,
    alignItems: "center",
    marginTop: 24,
  },
  updatePasswordText: {
    color: "#0f172a",
    fontWeight: "700",
    fontSize: 16,
  },
  deleteWarningText: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 8,
  },
  warningList: {
    gap: 4,
    paddingLeft: 4,
  },
  warningItem: {
    color: "#64748b",
    fontSize: 13,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  confirmDeleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#ef4444",
    alignItems: "center",
  },
  confirmDeleteText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});