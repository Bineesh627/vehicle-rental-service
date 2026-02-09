import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import * as ImagePicker from "expo-image-picker";
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
} from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function KYCVerification() {
  const router = useRouter();

  const [kycData, setKycData] = useState({
    fullName: "John Doe",
    dateOfBirth: "1990-05-15",
    address: "123 Main Street, Downtown, City 12345",
    phone: "+1 555-0400",
    email: "john.doe@example.com",
    documentType: "Aadhar Card" as
      | "Aadhar Card"
      | "Passport"
      | "Driving License",
    documentNumber: "",
  });

  const [images, setImages] = useState({
    front: null as string | null,
    back: null as string | null,
  });

  const [showDocTypeModal, setShowDocTypeModal] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "submitting" | "success"
  >("idle");

  const handleInputChange = (field: string, value: string) => {
    setKycData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async (side: "front" | "back") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages((prev) => ({ ...prev, [side]: result.assets[0].uri }));
      Toast.show({
        type: "success",
        text1: "Image Uploaded",
        text2: `${side === "front" ? "Front" : "Back"} side uploaded successfully.`,
      });
    }
  };

  const handleSubmit = () => {
    if (!kycData.documentNumber || !images.front || !images.back) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please fill all fields and upload both document images.",
      });
      return;
    }

    setSubmissionStatus("submitting");

    // Simulate API call
    setTimeout(() => {
      setSubmissionStatus("success");
      Toast.show({
        type: "success",
        text1: "KYC Submitted",
        text2: "Your documents are under review. We'll notify you shortly.",
      });
    }, 2000);
  };

  if (submissionStatus === "success") {
    return (
      <SafeAreaView className="flex-1 bg-background pt-8">
        <View className="flex-1 items-center justify-center p-6 gap-6">
          <View className="h-24 w-24 rounded-full bg-green-500/10 items-center justify-center">
            <CheckCircle size={48} className="text-green-500" />
          </View>
          <View className="items-center gap-2">
            <Text className="text-2xl font-bold text-foreground">
              Submission Successful
            </Text>
            <Text className="text-center text-muted-foreground">
              Your KYC documents have been submitted successfully. Verification
              usually takes 24-48 hours.
            </Text>
          </View>
          <Card className="w-full border-border bg-secondary/30">
            <CardContent className="p-4 gap-3">
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Reference ID</Text>
                <Text className="font-medium text-foreground">KYC-882190</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Status</Text>
                <Text className="font-medium text-orange-500">
                  Under Review
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Submitted On</Text>
                <Text className="font-medium text-foreground">
                  {new Date().toLocaleDateString()}
                </Text>
              </View>
            </CardContent>
          </Card>
          <Button
            className="w-full mt-4"
            onPress={() => router.replace("/user/Profile")}
          >
            <Text className="text-primary-foreground font-semibold">
              Return to Profile
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background pt-8">
      <View className="flex-1">
        {/* Header */}
        <View className="border-b border-border bg-card/95 px-4 py-3 flex-row items-center gap-3">
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <ArrowLeft size={20} className="text-foreground" />
          </Button>
          <Text className="text-lg font-bold text-foreground">
            KYC Verification
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-4 py-6"
          contentContainerStyle={{ gap: 24, paddingBottom: 40 }}
        >
          {/* Info Banner */}
          <View className="flex-row gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <AlertCircle size={24} className="text-orange-500 shrink-0" />
            <View className="flex-1 gap-1">
              <Text className="font-bold text-orange-500">Not Verified</Text>
              <Text className="text-xs text-foreground">
                Complete KYC to unlock bookings. Your data is secure and
                encrypted.
              </Text>
            </View>
          </View>

          {/* Personal Info Review */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border mb-3">
              <View className="flex-row items-center gap-2">
                <User size={16} className="text-foreground" />
                <CardTitle className="text-base text-foreground">
                  Personal Information
                </CardTitle>
              </View>
              <Text className="text-xs text-muted-foreground mt-1">
                Verified from profile
              </Text>
            </CardHeader>
            <CardContent className="gap-4">
              <View className="grid gap-4">
                <View className="flex-row gap-3 items-start">
                  <User size={16} className="text-muted-foreground mt-0.5" />
                  <View>
                    <Text className="text-xs text-muted-foreground">
                      Full Name
                    </Text>
                    <Text className="text-sm font-medium text-foreground">
                      {kycData.fullName}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-3 items-start">
                  <Calendar
                    size={16}
                    className="text-muted-foreground mt-0.5"
                  />
                  <View>
                    <Text className="text-xs text-muted-foreground">
                      Date of Birth
                    </Text>
                    <Text className="text-sm font-medium text-foreground">
                      {kycData.dateOfBirth}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-3 items-start">
                  <Phone size={16} className="text-muted-foreground mt-0.5" />
                  <View>
                    <Text className="text-xs text-muted-foreground">
                      Phone Number
                    </Text>
                    <Text className="text-sm font-medium text-foreground">
                      {kycData.phone}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-3 items-start">
                  <Mail size={16} className="text-muted-foreground mt-0.5" />
                  <View>
                    <Text className="text-xs text-muted-foreground">
                      Email Address
                    </Text>
                    <Text className="text-sm font-medium text-foreground">
                      {kycData.email}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-3 items-start">
                  <MapPin size={16} className="text-muted-foreground mt-0.5" />
                  <View>
                    <Text className="text-xs text-muted-foreground">
                      Address
                    </Text>
                    <Text className="text-sm font-medium text-foreground">
                      {kycData.address}
                    </Text>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border mb-3">
              <View className="flex-row items-center gap-2">
                <FileText size={16} className="text-foreground" />
                <CardTitle className="text-base text-foreground">
                  Identity Document
                </CardTitle>
              </View>
            </CardHeader>
            <CardContent className="gap-6">
              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground">
                  Document Type
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDocTypeModal(true)}
                  className="flex-row items-center justify-between border border-input rounded-md px-3 py-2 bg-background"
                >
                  <Text className="text-foreground">
                    {kycData.documentType}
                  </Text>
                  <ChevronDown size={16} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>

              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground">
                  Document Number
                </Text>
                <Input
                  value={kycData.documentNumber}
                  onChangeText={(text) =>
                    handleInputChange("documentNumber", text)
                  }
                  placeholder={`Enter ${kycData.documentType} Number`}
                />
              </View>

              <View className="gap-4">
                <Text className="text-sm font-medium text-foreground">
                  Upload Photos
                </Text>
                <View className="flex-row gap-4">
                  <TouchableOpacity
                    className="flex-1 aspect-[4/3] rounded-xl border-2 border-dashed border-border bg-secondary/30 items-center justify-center overflow-hidden"
                    onPress={() => pickImage("front")}
                  >
                    {images.front ? (
                      <Image
                        source={{ uri: images.front }}
                        className="h-full w-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="items-center gap-2">
                        <Upload size={20} className="text-muted-foreground" />
                        <Text className="text-xs text-muted-foreground">
                          Front Side
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 aspect-[4/3] rounded-xl border-2 border-dashed border-border bg-secondary/30 items-center justify-center overflow-hidden"
                    onPress={() => pickImage("back")}
                  >
                    {images.back ? (
                      <Image
                        source={{ uri: images.back }}
                        className="h-full w-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="items-center gap-2">
                        <Upload size={20} className="text-muted-foreground" />
                        <Text className="text-xs text-muted-foreground">
                          Back Side
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            size="lg"
            className="w-full flex-row gap-2"
            onPress={handleSubmit}
            disabled={submissionStatus === "submitting"}
          >
            {submissionStatus === "submitting" ? (
              <Text className="text-primary-foreground font-semibold">
                Submitting...
              </Text>
            ) : (
              <>
                <CheckCircle size={20} className="text-primary-foreground" />
                <Text className="text-primary-foreground font-semibold">
                  Submit for Verification
                </Text>
              </>
            )}
          </Button>
        </ScrollView>

        {/* Document Type Modal */}
        <Modal
          visible={showDocTypeModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDocTypeModal(false)}
        >
          <TouchableOpacity
            className="flex-1 bg-black/50 justify-center items-center p-4"
            activeOpacity={1}
            onPress={() => setShowDocTypeModal(false)}
          >
            <View className="bg-background w-full max-w-xs rounded-xl overflow-hidden">
              {["Aadhar Card", "Passport", "Driving License"].map(
                (doc, index) => (
                  <TouchableOpacity
                    key={doc}
                    className={`p-4 border-b border-border ${
                      index === 2 ? "border-0" : ""
                    }`}
                    onPress={() => {
                      setKycData((prev) => ({
                        ...prev,
                        documentType: doc as any,
                      }));
                      setShowDocTypeModal(false);
                    }}
                  >
                    <Text className="text-foreground text-center">{doc}</Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
