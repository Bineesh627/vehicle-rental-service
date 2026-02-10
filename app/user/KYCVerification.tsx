import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  FileText,
  Mail,
  MapPin,
  Phone,
  Upload,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function KYCVerification() {
  const router = useRouter();
  const { toast } = useToast();

  const [kycData, setKycData] = useState({
    fullName: "John Doe",
    dateOfBirth: "1990-05-15",
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

  const handleKycChange = (field: string, value: string | any | null) => {
    setKycData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string) => {
    // Mock file selection since we cannot add document picker library imports
    const mockFile = { name: "document.jpg", uri: "path/to/image" };
    handleKycChange(field, mockFile);
  };

  const handleSubmitKYC = () => {
    if (
      !kycData.fullName ||
      !kycData.dateOfBirth ||
      !kycData.address ||
      !kycData.phone ||
      !kycData.email
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all personal details.",
        variant: "destructive",
      });
      return;
    }
    if (!kycData.drivingLicenseNumber || !kycData.drivingLicensePhoto) {
      toast({
        title: "Missing Information",
        description: "Please provide driving license details and photo.",
        variant: "destructive",
      });
      return;
    }
    if (
      !kycData.secondaryDocType ||
      !kycData.secondaryDocNumber ||
      !kycData.secondaryDocPhoto
    ) {
      toast({
        title: "Missing Information",
        description: "Please provide secondary document details and photo.",
        variant: "destructive",
      });
      return;
    }
    setKycStatus("pending");
    toast({
      title: "KYC Submitted",
      description:
        "Your documents are being verified. This may take 24-48 hours.",
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top"]}
        style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Button
                variant="ghost"
                size="icon"
                onPress={() => router.navigate("profile" as never)}
                style={styles.backButton}
              >
                <ArrowLeft size={20} color="#0f172a" />
              </Button>
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
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.main}>
          {/* Personal Details */}
          <Card style={styles.card}>
            <CardHeader style={styles.cardHeader}>
              <CardTitle style={styles.cardTitle}>
                <User size={16} color="#0f172a" style={styles.iconSpacing} />
                <Text>Personal Details</Text>
              </CardTitle>
            </CardHeader>
            <CardContent style={styles.cardContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <User size={16} color="#64748b" style={styles.labelIcon} />
                  <Text>Full Name (as per documents) *</Text>
                </Text>
                <Input
                  value={kycData.fullName}
                  onChangeText={(text) => handleKycChange("fullName", text)}
                  placeholder="Enter full name"
                  editable={kycStatus === "not_submitted"}
                />
              </View>

              <View style={styles.gridCols2}>
                <View style={[styles.inputGroup, styles.flex1]}>
                  <Text style={styles.label}>
                    <Calendar
                      size={16}
                      color="#64748b"
                      style={styles.labelIcon}
                    />
                    <Text>Date of Birth *</Text>
                  </Text>
                  <Input
                    value={kycData.dateOfBirth}
                    onChangeText={(text) =>
                      handleKycChange("dateOfBirth", text)
                    }
                    editable={kycStatus === "not_submitted"}
                  />
                </View>
                <View style={[styles.inputGroup, styles.flex1]}>
                  <Text style={styles.label}>
                    <Phone size={16} color="#64748b" style={styles.labelIcon} />
                    <Text>Phone *</Text>
                  </Text>
                  <Input
                    value={kycData.phone}
                    onChangeText={(text) => handleKycChange("phone", text)}
                    placeholder="Phone number"
                    editable={kycStatus === "not_submitted"}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Mail size={16} color="#64748b" style={styles.labelIcon} />
                  <Text>Email Address *</Text>
                </Text>
                <Input
                  value={kycData.email}
                  onChangeText={(text) => handleKycChange("email", text)}
                  placeholder="Email address"
                  editable={kycStatus === "not_submitted"}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <MapPin size={16} color="#64748b" style={styles.labelIcon} />
                  <Text>Full Address *</Text>
                </Text>
                <Input
                  value={kycData.address}
                  onChangeText={(text) => handleKycChange("address", text)}
                  placeholder="Enter complete address"
                  editable={kycStatus === "not_submitted"}
                />
              </View>
            </CardContent>
          </Card>

          {/* Driving License */}
          <Card style={styles.card}>
            <CardHeader style={styles.cardHeader}>
              <CardTitle style={styles.cardTitle}>
                <FileText
                  size={16}
                  color="#0f172a"
                  style={styles.iconSpacing}
                />
                <Text>Driving License</Text>
              </CardTitle>
            </CardHeader>
            <CardContent style={styles.cardContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>License Number *</Text>
                <Input
                  value={kycData.drivingLicenseNumber}
                  onChangeText={(text) =>
                    handleKycChange("drivingLicenseNumber", text)
                  }
                  placeholder="Enter driving license number"
                  editable={kycStatus === "not_submitted"}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Upload License Photo *</Text>
                <TouchableOpacity
                  style={styles.uploadBox}
                  onPress={() => handleFileChange("drivingLicensePhoto")}
                  disabled={kycStatus !== "not_submitted"}
                >
                  {kycData.drivingLicensePhoto ? (
                    <View style={styles.fileUploaded}>
                      <CheckCircle size={20} color="#22c55e" />
                      <Text style={styles.fileName}>
                        {kycData.drivingLicensePhoto.name}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.uploadPlaceholder}>
                      <Upload size={32} color="#64748b" />
                      <Text style={styles.uploadText}>
                        Tap to upload license photo
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </CardContent>
          </Card>

          {/* Secondary ID Proof */}
          <Card style={styles.card}>
            <CardHeader style={styles.cardHeader}>
              <CardTitle style={styles.cardTitle}>
                <FileText
                  size={16}
                  color="#0f172a"
                  style={styles.iconSpacing}
                />
                <Text>Secondary ID Proof</Text>
              </CardTitle>
            </CardHeader>
            <CardContent style={styles.cardContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Document Type *</Text>
                <Select
                  value={kycData.secondaryDocType}
                  onValueChange={(v: string) =>
                    handleKycChange("secondaryDocType", v)
                  }
                  disabled={kycStatus !== "not_submitted"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aadhar" label="Aadhar Card" />
                    <SelectItem value="voter_id" label="Voter ID" />
                    <SelectItem value="passport" label="Passport" />
                    <SelectItem value="pan_card" label="PAN Card" />
                    <SelectItem value="national_id" label="National ID" />
                  </SelectContent>
                </Select>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Document Number *</Text>
                <Input
                  value={kycData.secondaryDocNumber}
                  onChangeText={(text) =>
                    handleKycChange("secondaryDocNumber", text)
                  }
                  placeholder="Enter document number"
                  editable={kycStatus === "not_submitted"}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Upload Document Photo *</Text>
                <TouchableOpacity
                  style={styles.uploadBox}
                  onPress={() => handleFileChange("secondaryDocPhoto")}
                  disabled={kycStatus !== "not_submitted"}
                >
                  {kycData.secondaryDocPhoto ? (
                    <View style={styles.fileUploaded}>
                      <CheckCircle size={20} color="#22c55e" />
                      <Text style={styles.fileName}>
                        {kycData.secondaryDocPhoto.name}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.uploadPlaceholder}>
                      <Upload size={32} color="#64748b" />
                      <Text style={styles.uploadText}>
                        Tap to upload document photo
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            style={styles.submitButton}
            size="lg"
            onPress={handleSubmitKYC}
            disabled={kycStatus === "pending" || kycStatus === "verified"}
          >
            {kycStatus === "verified" ? (
              <View style={styles.buttonContent}>
                <CheckCircle
                  size={16}
                  color="white"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>KYC Verified</Text>
              </View>
            ) : kycStatus === "pending" ? (
              <View style={styles.buttonContent}>
                <AlertCircle
                  size={16}
                  color="white"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Verification Pending</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Submit KYC for Verification</Text>
            )}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC", // bg-background
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0", // border-border
    backgroundColor: "rgba(255, 255, 255, 0.95)", // bg-card/95
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    // Style handled by component props or global theme usually,
    // but ensuring layout here
  },
  headerTitle: {
    fontSize: 18, // text-lg
    fontWeight: "700", // font-bold
    color: "#020817", // text-foreground
  },
  headerSubtitle: {
    fontSize: 12, // text-xs
    color: "#64748b", // text-muted-foreground
  },
  badgeVerified: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(34, 197, 94, 0.1)", // bg-green-500/10
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  badgeTextVerified: {
    fontSize: 12,
    color: "#22c55e", // text-green-500
  },
  badgePending: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(249, 115, 22, 0.1)", // bg-orange-500/10
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  badgeTextPending: {
    fontSize: 12,
    color: "#f97316", // text-orange-500
  },
  scrollContent: {
    paddingBottom: 100, // pb-24 equivalent
  },
  main: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 24, // space-y-6
  },
  card: {
    borderColor: "#E2E8F0", // border-border
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "white",
  },
  cardHeader: {
    paddingBottom: 12,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  cardTitle: {
    fontSize: 16, // text-base
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    fontWeight: "600",
  },
  iconSpacing: {
    marginRight: 8,
  },
  cardContent: {
    gap: 16, // space-y-4
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  inputGroup: {
    gap: 8, // space-y-2
  },
  label: {
    fontSize: 14, // text-sm
    fontWeight: "500",
    color: "#020817", // text-foreground
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  labelIcon: {
    marginRight: 8,
  },
  gridCols2: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#E2E8F0", // border-border
    borderRadius: 12, // rounded-xl
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  fileUploaded: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  fileName: {
    fontSize: 14, // text-sm
    color: "#22c55e", // text-green-500
  },
  uploadPlaceholder: {
    alignItems: "center",
    gap: 8,
  },
  uploadText: {
    fontSize: 14, // text-sm
    color: "#64748b", // text-muted-foreground
  },
  submitButton: {
    width: "100%",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
