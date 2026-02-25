import { UserStackParamList } from "@/navigation/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Send } from "lucide-react-native";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { staffApi } from "@/services/api";

export default function StaffComplaint() {
  const navigation =
    useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const insets = useSafeAreaInsets();

  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = async () => {
    try {
      await staffApi.submitComplaint(subject, details);
      Toast.show({
        type: "success",
        text1: "Complaint Submitted",
        text2: "We've received your report.",
      });
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to submit complaint.",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <View style={styles.headerContent}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <ArrowLeft size={24} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Staff Complaint</Text>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Subject</Text>
              <TextInput
                style={styles.input}
                placeholder="Brief description of the issue"
                placeholderTextColor="#64748b"
                value={subject}
                onChangeText={setSubject}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Details</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Please describe your issue in detail..."
                placeholderTextColor="#64748b"
                value={details}
                onChangeText={setDetails}
                multiline
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!subject || !details) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!subject || !details}
            >
              <Send size={20} color="#0f172a" style={{ marginRight: 8 }} />
              <Text style={styles.submitButtonText}>Submit Complaint</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111318",
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: "#111318",
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
    zIndex: 40,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8",
  },
  input: {
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    padding: 16,
    color: "#ffffff",
    fontSize: 16,
  },
  textArea: {
    height: 150,
    paddingTop: 16,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2dd4bf",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: "auto",
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "700",
  },
});
