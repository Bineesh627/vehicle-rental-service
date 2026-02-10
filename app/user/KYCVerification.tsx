import { useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  ChevronDown,
  FileText,
  Mail,
  MapPin,
  Phone,
  Upload,
  User,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
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

export default function KYCVerification() {
  const router = useRouter();

  const [kycData, setKycData] = useState({
    fullName: "John Doe",
    dateOfBirth: "15/05/1990",
    address: "123 Main Street, Downtown, City 12345",
    phone: "+1 555-0400",
    email: "john.doe@example.com",
    drivingLicenseNumber: "",
    drivingLicensePhoto: null as any | null,
    secondaryDocType: "",
    secondaryDocNumber: "",
    secondaryDocPhoto: null as any | null,
  });

  const [kycStatus, setKycStatus] = useState<
    "pending" | "verified" | "not_submitted"
  >("not_submitted");

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isDocTypeModalVisible, setDocTypeModalVisible] = useState(false);

  const docTypes = [
    "Aadhar Card",
    "Voter ID",
    "Passport",
    "PAN Card",
    "National ID",
  ];

  const handleKycChange = (field: string, value: string | any | null) => {
    setKycData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string) => {
    const mockFile = { name: "document.jpg", uri: "path/to/image" };
    handleKycChange(field, mockFile);
    Toast.show({
      type: "success",
      text1: "File Uploaded",
      text2: `${mockFile.name} attached successfully`,
    });
  };

  const handleSubmitKYC = () => {
    if (
      !kycData.fullName ||
      !kycData.dateOfBirth ||
      !kycData.address ||
      !kycData.phone ||
      !kycData.email
    ) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please fill in all personal details.",
      });
      return;
    }
    setKycStatus("pending");
    Toast.show({
      type: "success",
      text1: "KYC Submitted",
      text2: "Your documents are being verified.",
    });
  };

  // Helper for Input Fields - Fixed Alignment by using View for label container
  const renderInput = (
    label: string,
    icon: React.ReactNode,
    value: string,
    fieldKey: string,
    placeholder: string,
    keyboardType: "default" | "email-address" | "phone-pad" = "default"
  ) => (
    <View style={styles.inputGroup}>
      <View style={styles.labelContainer}>
        {icon}
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={(text) => handleKycChange(fieldKey, text)}
        placeholder={placeholder}
        placeholderTextColor="#64748b"
        keyboardType={keyboardType}
        editable={kycStatus === "not_submitted"}
        onFocus={() => setFocusedField(fieldKey)}
        onBlur={() => setFocusedField(null)}
        style={[
          styles.input,
          focusedField === fieldKey && styles.inputFocused,
          kycStatus !== "not_submitted" && styles.inputDisabled,
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
            <View style={styles.headerContent}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <ArrowLeft size={24} color="#ffffff" />
              </TouchableOpacity>
              <View>
                <Text style={styles.headerTitle}>KYC Verification</Text>
                <Text style={styles.headerSubtitle}>
                  Required for booking vehicles
                </Text>
              </View>
            </View>
            {kycStatus === "verified" && (
              <View style={styles.badgeVerified}>
                <CheckCircle size={12} color="#22c55e" />
                <Text style={styles.badgeTextVerified}>Verified</Text>
              </View>
            )}
            {kycStatus === "pending" && (
              <View style={styles.badgePending}>
                <AlertCircle size={12} color="#f97316" />
                <Text style={styles.badgeTextPending}>Pending</Text>
              </View>
            )}
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.main}>
              {/* Personal Details */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <User size={18} color="#ffffff" style={styles.iconSpacing} />
                  <Text style={styles.cardTitle}>Personal Details</Text>
                </View>
                <View style={styles.cardContent}>
                  {renderInput(
                    "Full Name (as per documents) *",
                    null,
                    kycData.fullName,
                    "fullName",
                    "John Doe"
                  )}

                  <View style={styles.gridCols2}>
                    <View style={styles.flex1}>
                      {renderInput(
                        "Date of Birth *",
                        <Calendar
                          size={14}
                          color="#94a3b8"
                          style={styles.labelIcon}
                        />,
                        kycData.dateOfBirth,
                        "dateOfBirth",
                        "DD/MM/YYYY"
                      )}
                    </View>
                    <View style={styles.flex1}>
                      {renderInput(
                        "Phone *",
                        <Phone
                          size={14}
                          color="#94a3b8"
                          style={styles.labelIcon}
                        />,
                        kycData.phone,
                        "phone",
                        "+1 234 567 8900",
                        "phone-pad"
                      )}
                    </View>
                  </View>

                  {renderInput(
                    "Email Address *",
                    <Mail
                      size={14}
                      color="#94a3b8"
                      style={styles.labelIcon}
                    />,
                    kycData.email,
                    "email",
                    "john.doe@example.com",
                    "email-address"
                  )}

                  {renderInput(
                    "Full Address *",
                    <MapPin
                      size={14}
                      color="#94a3b8"
                      style={styles.labelIcon}
                    />,
                    kycData.address,
                    "address",
                    "123 Street Name, City"
                  )}
                </View>
              </View>

              {/* Driving License */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <FileText
                    size={18}
                    color="#ffffff"
                    style={styles.iconSpacing}
                  />
                  <Text style={styles.cardTitle}>Driving License</Text>
                </View>
                <View style={styles.cardContent}>
                  {renderInput(
                    "License Number *",
                    null,
                    kycData.drivingLicenseNumber,
                    "drivingLicenseNumber",
                    "Enter driving license number"
                  )}

                  <View style={styles.inputGroup}>
                    <View style={styles.labelContainer}>
                      <Text style={styles.labelText}>
                        Upload License Photo *
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.uploadBox}
                      onPress={() => handleFileChange("drivingLicensePhoto")}
                      disabled={kycStatus !== "not_submitted"}
                    >
                      {kycData.drivingLicensePhoto ? (
                        <View style={styles.fileUploaded}>
                          <CheckCircle size={20} color="#2dd4bf" />
                          <Text style={styles.fileName}>
                            {kycData.drivingLicensePhoto.name}
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.uploadPlaceholder}>
                          <Upload size={24} color="#64748b" />
                          <Text style={styles.uploadText}>
                            Tap to upload license photo
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Secondary ID Proof */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <FileText
                    size={18}
                    color="#ffffff"
                    style={styles.iconSpacing}
                  />
                  <Text style={styles.cardTitle}>Secondary ID Proof</Text>
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.inputGroup}>
                    <View style={styles.labelContainer}>
                      <Text style={styles.labelText}>Document Type *</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.selectInput}
                      onPress={() => setDocTypeModalVisible(true)}
                      disabled={kycStatus !== "not_submitted"}
                    >
                      <Text
                        style={
                          kycData.secondaryDocType
                            ? styles.selectValue
                            : styles.selectPlaceholder
                        }
                      >
                        {kycData.secondaryDocType || "Select document type"}
                      </Text>
                      <ChevronDown size={20} color="#64748b" />
                    </TouchableOpacity>
                  </View>

                  {renderInput(
                    "Document Number *",
                    null,
                    kycData.secondaryDocNumber,
                    "secondaryDocNumber",
                    "Enter document number"
                  )}

                  <View style={styles.inputGroup}>
                    <View style={styles.labelContainer}>
                      <Text style={styles.labelText}>
                        Upload Document Photo *
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.uploadBox}
                      onPress={() => handleFileChange("secondaryDocPhoto")}
                      disabled={kycStatus !== "not_submitted"}
                    >
                      {kycData.secondaryDocPhoto ? (
                        <View style={styles.fileUploaded}>
                          <CheckCircle size={20} color="#2dd4bf" />
                          <Text style={styles.fileName}>
                            {kycData.secondaryDocPhoto.name}
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.uploadPlaceholder}>
                          <Upload size={24} color="#64748b" />
                          <Text style={styles.uploadText}>
                            Tap to upload document photo
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (kycStatus === "pending" || kycStatus === "verified") &&
                    styles.submitButtonDisabled,
                ]}
                onPress={handleSubmitKYC}
                disabled={kycStatus === "pending" || kycStatus === "verified"}
              >
                {kycStatus === "verified" ? (
                  <View style={styles.buttonContent}>
                    <CheckCircle
                      size={20}
                      color="#0f172a"
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonText}>KYC Verified</Text>
                  </View>
                ) : kycStatus === "pending" ? (
                  <View style={styles.buttonContent}>
                    <AlertCircle
                      size={20}
                      color="#0f172a"
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonText}>Verification Pending</Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>
                    Submit KYC for Verification
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Document Type Picker Modal */}
          <Modal
            visible={isDocTypeModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setDocTypeModalVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setDocTypeModalVisible(false)}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Document Type</Text>
                  <TouchableOpacity
                    onPress={() => setDocTypeModalVisible(false)}
                  >
                    <X size={20} color="#94a3b8" />
                  </TouchableOpacity>
                </View>
                <ScrollView>
                  {docTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.modalOption,
                        kycData.secondaryDocType === type &&
                          styles.modalOptionSelected,
                      ]}
                      onPress={() => {
                        handleKycChange("secondaryDocType", type);
                        setDocTypeModalVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          kycData.secondaryDocType === type &&
                            styles.modalOptionTextSelected,
                        ]}
                      >
                        {type}
                      </Text>
                      {kycData.secondaryDocType === type && (
                        <CheckCircle size={18} color="#2dd4bf" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableOpacity>
          </Modal>
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
    backgroundColor: "#0f172a",
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#94a3b8", // Slate-400
  },
  badgeVerified: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  badgeTextVerified: {
    fontSize: 12,
    color: "#22c55e",
  },
  badgePending: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(249, 115, 22, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  badgeTextPending: {
    fontSize: 12,
    color: "#f97316",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  main: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 24,
  },
  card: {
    backgroundColor: "#1e293b", // Slate-800
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
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
  iconSpacing: {
    marginRight: 10,
  },
  cardContent: {
    padding: 16,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  labelIcon: {
    // No specific style needed as it's handled by gap in container
  },
  labelText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
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
  gridCols2: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  selectInput: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#334155",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectValue: {
    color: "#ffffff",
    fontSize: 16,
  },
  selectPlaceholder: {
    color: "#64748b",
    fontSize: 16,
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#334155",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15, 23, 42, 0.3)",
  },
  fileUploaded: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fileName: {
    fontSize: 14,
    color: "#2dd4bf", // Teal
  },
  uploadPlaceholder: {
    alignItems: "center",
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
    color: "#64748b",
  },
  submitButton: {
    backgroundColor: "#2dd4bf", // Teal
    paddingVertical: 16,
    borderRadius: 9999, // Pill shape
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
    backgroundColor: "#94a3b8",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#0f172a", // Dark text on Teal button
    fontSize: 16,
    fontWeight: "700",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    maxHeight: "60%",
    borderWidth: 1,
    borderColor: "#334155",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  modalOptionSelected: {
    backgroundColor: "rgba(45, 212, 191, 0.1)",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#94a3b8",
  },
  modalOptionTextSelected: {
    color: "#2dd4bf",
    fontWeight: "600",
  },
});