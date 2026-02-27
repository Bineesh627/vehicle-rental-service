import { useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  MoreVertical,
  Plus,
  Trash2,
  Wallet,
  X,
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import {
  profileManagementApi,
  PaymentMethod,
  PaymentMethodCreate,
} from "@/services/api";

const initialPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "card",
    name: "Visa ending in 4242",
    details: "Expires 12/26",
    is_default: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    type: "card",
    name: "Mastercard ending in 8888",
    details: "Expires 08/25",
    is_default: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    type: "upi",
    name: "Google Pay",
    details: "john@oksbi",
    is_default: false,
    created_at: new Date().toISOString(),
  },
];

export default function PaymentMethods() {
  const router = useRouter();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [upiData, setUpiData] = useState({
    upiId: "",
    upiAppName: "",
  });
  const [showUpiDialog, setShowUpiDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load payment methods on screen focus
  useFocusEffect(
    React.useCallback(() => {
      const loadPaymentMethods = async () => {
        try {
          setLoading(true);
          const data = await profileManagementApi.getPaymentMethods();
          setPaymentMethods(data);
        } catch (error) {
          console.error("Failed to load payment methods:", error);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Failed to load payment methods",
          });
        } finally {
          setLoading(false);
        }
      };

      loadPaymentMethods();
    }, []),
  );

  const resetForm = () =>
    setFormData({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "" });

  const resetUpiForm = () => setUpiData({ upiId: "", upiAppName: "" });

  const handleAddUpi = async () => {
    if (!upiData.upiId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your UPI ID.",
      });
      return;
    }

    try {
      setLoading(true);
      const newMethod: PaymentMethodCreate = {
        type: "upi",
        name: upiData.upiAppName || "UPI Payment",
        details: upiData.upiId,
        is_default: paymentMethods.length === 0,
      };

      const createdMethod =
        await profileManagementApi.createPaymentMethod(newMethod);
      setPaymentMethods((prev) => [...prev, createdMethod]);

      Toast.show({
        type: "success",
        text1: "UPI Added",
        text2: "Your UPI payment method has been saved.",
      });
      setShowUpiDialog(false);
      resetUpiForm();
    } catch (error) {
      console.error("Failed to add UPI method:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to add UPI payment method",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    if (!formData.cardNumber || !formData.cardHolder || !formData.expiryDate) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all card details.",
      });
      return;
    }

    try {
      setLoading(true);
      const lastFour = formData.cardNumber.slice(-4);
      const newMethod: PaymentMethodCreate = {
        type: "card",
        name: `Card ending in ${lastFour}`,
        details: `Expires ${formData.expiryDate}`,
        card_number: formData.cardNumber,
        card_holder: formData.cardHolder,
        expiry_date: formData.expiryDate,
        is_default: paymentMethods.length === 0,
      };

      const createdMethod =
        await profileManagementApi.createPaymentMethod(newMethod);
      setPaymentMethods((prev) => [...prev, createdMethod]);

      Toast.show({
        type: "success",
        text1: "Card Added",
        text2: "Your payment method has been saved.",
      });
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      console.error("Failed to add payment method:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to add payment method",
      });
    } finally {
      setLoading(false);
    }
  };

  const setAsDefault = async (id: string) => {
    try {
      setLoading(true);
      await profileManagementApi.updatePaymentMethod(id, { is_default: true });
      setPaymentMethods((prev) =>
        prev.map((pm) => ({ ...pm, is_default: pm.id === id })),
      );
      Toast.show({
        type: "success",
        text1: "Default Updated",
        text2: "This is now your default payment method.",
      });
      setShowOptionsModal(null);
    } catch (error) {
      console.error("Failed to set default payment method:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update default payment method",
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePaymentMethod = async (id: string) => {
    const method = paymentMethods.find((pm) => pm.id === id);
    if (method?.is_default && paymentMethods.length > 1) {
      Toast.show({
        type: "error",
        text1: "Cannot Delete",
        text2: "Please set another payment method as default first.",
      });
      return;
    }

    try {
      setLoading(true);
      await profileManagementApi.deletePaymentMethod(id);
      setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
      Toast.show({
        type: "success",
        text1: "Payment Method Removed",
        text2: `${method?.name} has been removed.`,
      });
      setShowOptionsModal(null);
    } catch (error) {
      console.error("Failed to delete payment method:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete payment method",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Payment Methods</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowAddDialog(true)}
            style={styles.addButton}
          >
            <Plus size={16} color="#0f172a" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
        >
          {paymentMethods.length === 0 ? (
            <View style={styles.emptyState}>
              <CreditCard
                size={48}
                color="#64748b"
                style={{ marginBottom: 12 }}
              />
              <Text style={styles.emptyText}>No payment methods saved</Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => setShowAddDialog(true)}
              >
                <Plus size={16} color="#0f172a" />
                <Text style={styles.emptyButtonText}>Add Payment Method</Text>
              </TouchableOpacity>
            </View>
          ) : (
            paymentMethods.map((method) => (
              <View
                key={method.id}
                style={[styles.card, method.is_default && styles.cardDefault]}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardLeft}>
                    <View
                      style={[
                        styles.iconContainer,
                        method.type === "card"
                          ? styles.iconBgTeal
                          : styles.iconBgPurple,
                      ]}
                    >
                      {method.type === "card" ? (
                        <CreditCard size={20} color="#2dd4bf" />
                      ) : (
                        <Wallet size={20} color="#a855f7" />
                      )}
                    </View>
                    <View>
                      <View style={styles.cardHeaderRow}>
                        <Text style={styles.methodName}>{method.name}</Text>
                        {method.is_default && (
                          <View style={styles.defaultBadge}>
                            <Text style={styles.defaultText}>Default</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.methodDetails}>{method.details}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowOptionsModal(method.id)}
                  >
                    <MoreVertical size={20} color="#94a3b8" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          {/* Add UPI Button - Updated to Outlined Design */}
          <TouchableOpacity
            style={styles.addUpiButton}
            onPress={() => setShowUpiDialog(true)}
          >
            <View style={styles.upiIconContainer}>
              <Wallet size={20} color="#a855f7" />
            </View>
            <View>
              <Text style={styles.upiText}>Add UPI</Text>
              <Text style={styles.upiSubtext}>
                Pay using Google Pay, PhonePe, etc.
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Add Card Modal */}
        <Modal
          visible={showAddDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAddDialog(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Card</Text>
                <TouchableOpacity onPress={() => setShowAddDialog(false)}>
                  <X size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Card Number</Text>
                  <TextInput
                    value={formData.cardNumber}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, cardNumber: text }))
                    }
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor="#64748b"
                    keyboardType="numeric"
                    maxLength={19}
                    style={styles.input}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Cardholder Name</Text>
                  <TextInput
                    value={formData.cardHolder}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, cardHolder: text }))
                    }
                    placeholder="John Doe"
                    placeholderTextColor="#64748b"
                    style={styles.input}
                  />
                </View>
                <View style={styles.row}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Expiry Date</Text>
                    <TextInput
                      value={formData.expiryDate}
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, expiryDate: text }))
                      }
                      placeholder="MM/YY"
                      placeholderTextColor="#64748b"
                      maxLength={5}
                      style={styles.input}
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>CVV</Text>
                    <TextInput
                      secureTextEntry
                      value={formData.cvv}
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, cvv: text }))
                      }
                      placeholder="***"
                      placeholderTextColor="#64748b"
                      maxLength={4}
                      keyboardType="numeric"
                      style={styles.input}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleAddCard}
                >
                  <Text style={styles.saveButtonText}>Add Card</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowAddDialog(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Add UPI Modal */}
        <Modal
          visible={showUpiDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowUpiDialog(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add UPI Payment</Text>
                <TouchableOpacity onPress={() => setShowUpiDialog(false)}>
                  <X size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>UPI ID</Text>
                  <TextInput
                    value={upiData.upiId}
                    onChangeText={(text) =>
                      setUpiData((prev) => ({ ...prev, upiId: text }))
                    }
                    placeholder="yourname@bankname"
                    placeholderTextColor="#64748b"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>UPI App Name (Optional)</Text>
                  <TextInput
                    value={upiData.upiAppName}
                    onChangeText={(text) =>
                      setUpiData((prev) => ({ ...prev, upiAppName: text }))
                    }
                    placeholder="Google Pay, PhonePe, Paytm, etc."
                    placeholderTextColor="#64748b"
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleAddUpi}
                >
                  <Text style={styles.saveButtonText}>Add UPI</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowUpiDialog(false);
                    resetUpiForm();
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Options Modal */}
        <Modal
          visible={!!showOptionsModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowOptionsModal(null)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowOptionsModal(null)}
          >
            <View style={styles.optionsModalContainer}>
              <Text style={styles.optionsTitle}>Payment Options</Text>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() =>
                  showOptionsModal && setAsDefault(showOptionsModal)
                }
              >
                <CheckCircle size={20} color="#ffffff" />
                <Text style={styles.optionText}>Set as Default</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() =>
                  showOptionsModal && deletePaymentMethod(showOptionsModal)
                }
              >
                <Trash2 size={20} color="#ef4444" />
                <Text style={[styles.optionText, { color: "#ef4444" }]}>
                  Remove
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeOptionsButton}
                onPress={() => setShowOptionsModal(null)}
              >
                <Text style={styles.closeOptionsText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  headerLeft: {
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2dd4bf", // Teal
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    gap: 4,
  },
  addButtonText: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "#1e293b",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 16,
    marginBottom: 16,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2dd4bf",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  emptyButtonText: {
    color: "#0f172a",
    fontWeight: "600",
  },
  // Card Styles
  card: {
    backgroundColor: "#1e293b", // Slate-800
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 20,
  },
  cardDefault: {
    borderColor: "#2dd4bf", // Teal border for default
    borderWidth: 1.5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBgTeal: {
    backgroundColor: "rgba(45, 212, 191, 0.1)",
  },
  iconBgPurple: {
    backgroundColor: "rgba(168, 85, 247, 0.1)",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  methodName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  defaultBadge: {
    backgroundColor: "rgba(45, 212, 191, 0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    color: "#2dd4bf",
    fontSize: 10,
    fontWeight: "bold",
  },
  methodDetails: {
    fontSize: 14,
    color: "#94a3b8",
  },
  // Add UPI Button - UPDATED for Unselected State
  addUpiButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b", // Dark background
    borderWidth: 1,
    borderColor: "#2dd4bf", // Teal Border
    padding: 20,
    borderRadius: 20,
    gap: 16,
  },
  upiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(168, 85, 247, 0.1)", // Purple tint for wallet icon
    alignItems: "center",
    justifyContent: "center",
  },
  upiText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2dd4bf", // Teal Text
  },
  upiSubtext: {
    fontSize: 14,
    color: "#94a3b8", // Slate-400
    fontWeight: "500",
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
    backgroundColor: "#020617", // Very dark modal bg
    width: "100%",
    maxWidth: 360,
    borderRadius: 16,
    padding: 20,
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
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  label: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#334155",
    fontSize: 16,
  },
  modalActions: {
    marginTop: 24,
    gap: 12,
  },
  saveButton: {
    backgroundColor: "#2dd4bf", // Teal
    paddingVertical: 14,
    borderRadius: 9999,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#0f172a",
    fontWeight: "700",
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#2dd4bf",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  closeOptionsButton: {
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#2dd4bf",
    alignItems: "center",
  },
  closeOptionsText: {
    color: "#ffffff",
    fontWeight: "600",
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
  // Options Modal
  optionsModalContainer: {
    backgroundColor: "#1e293b",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#0f172a",
  },
  optionText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500",
  },
});
