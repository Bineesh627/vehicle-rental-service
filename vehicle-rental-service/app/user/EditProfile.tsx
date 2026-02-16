import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Camera,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function EditProfile() {
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 555-0400",
    address: "123 Main Street, Downtown, City 12345",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    Toast.show({
      type: "success",
      text1: "Profile Updated",
      text2: "Your profile has been saved successfully.",
    });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your current password.",
      });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "New passwords do not match.",
      });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Password must be at least 6 characters.",
      });
      return;
    }
    Toast.show({
      type: "success",
      text1: "Password Changed",
      text2: "Your password has been updated successfully.",
    });
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // Helper to render consistent input fields with fixed alignment
  const renderInput = (
    label: string,
    icon: React.ReactNode,
    value: string,
    fieldKey: string,
    isPassword = false,
    editable = true,
    onChangeText: (text: string) => void
  ) => (
    <View style={styles.inputGroup}>
      <View style={styles.labelContainer}>
        {icon}
        <Text style={styles.label}>{label}</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        secureTextEntry={isPassword}
        onFocus={() => setFocusedField(fieldKey)}
        onBlur={() => setFocusedField(null)}
        placeholder={`Enter ${label.toLowerCase()}`}
        placeholderTextColor="#64748b"
        style={[
          styles.input,
          focusedField === fieldKey && styles.inputFocused,
          !editable && styles.inputDisabled,
        ]}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>JD</Text>
                </View>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() =>
                    Toast.show({
                      type: "info",
                      text1: "Change Photo",
                      text2: "Photo upload coming soon",
                    })
                  }
                >
                  <Camera size={14} color="#0f172a" />
                </TouchableOpacity>
              </View>
              <Text style={styles.avatarHint}>Tap to change photo</Text>
            </View>

            {/* Personal Information Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Personal Information</Text>
                {!isEditing ? (
                  <TouchableOpacity onPress={() => setIsEditing(true)}>
                    <Text style={styles.editLink}>Edit</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => setIsEditing(false)}>
                    <Text style={styles.editLink}>Cancel</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.formContainer}>
                {renderInput(
                  "Full Name",
                  <User size={14} color="#94a3b8" />,
                  profileData.name,
                  "name",
                  false,
                  isEditing,
                  (text) => handleProfileChange("name", text)
                )}

                {renderInput(
                  "Email Address",
                  <Mail size={14} color="#94a3b8" />,
                  profileData.email,
                  "email",
                  false,
                  isEditing,
                  (text) => handleProfileChange("email", text)
                )}

                {renderInput(
                  "Phone Number",
                  <Phone size={14} color="#94a3b8" />,
                  profileData.phone,
                  "phone",
                  false,
                  isEditing,
                  (text) => handleProfileChange("phone", text)
                )}

                {renderInput(
                  "Address",
                  <MapPin size={14} color="#94a3b8" />,
                  profileData.address,
                  "address",
                  false,
                  isEditing,
                  (text) => handleProfileChange("address", text)
                )}
              </View>

              {isEditing && (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveProfile}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Change Password Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Lock size={16} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={styles.cardTitle}>Change Password</Text>
                </View>
              </View>

              <View style={styles.formContainer}>
                {renderInput(
                  "Current Password",
                  null,
                  passwordData.currentPassword,
                  "currentPassword",
                  true,
                  true,
                  (text) => handlePasswordChange("currentPassword", text)
                )}

                {renderInput(
                  "New Password",
                  null,
                  passwordData.newPassword,
                  "newPassword",
                  true,
                  true,
                  (text) => handlePasswordChange("newPassword", text)
                )}

                {renderInput(
                  "Confirm New Password",
                  null,
                  passwordData.confirmPassword,
                  "confirmPassword",
                  true,
                  true,
                  (text) => handlePasswordChange("confirmPassword", text)
                )}

                {/* Updated to Solid Teal Button */}
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleChangePassword}
                >
                  <Text style={styles.saveButtonText}>Update Password</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
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
  scrollContent: {
    padding: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 10,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#0f172a", // Dark circle
    borderWidth: 2,
    borderColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2dd4bf", // Teal text
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2dd4bf", // Teal
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#0f172a",
  },
  avatarHint: {
    color: "#64748b",
    marginTop: 12,
    fontSize: 14,
  },
  card: {
    backgroundColor: "#1e293b", // Slate-800
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 16,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  editLink: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#0f172a", // Darker input background
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#334155",
    fontSize: 16,
  },
  inputFocused: {
    borderColor: "#2dd4bf", // Teal border on focus
    backgroundColor: "rgba(45, 212, 191, 0.05)",
  },
  inputDisabled: {
    opacity: 0.7,
  },
  saveButton: {
    backgroundColor: "#2dd4bf", // Teal
    paddingVertical: 16,
    borderRadius: 9999, // Pill shape
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "#0f172a",
    fontWeight: "700",
    fontSize: 16,
  },
});