import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

interface PaymentMethod {
  id: string;
  type: "card" | "upi" | "wallet";
  name: string;
  details: string;
  isDefault: boolean;
}

const initialPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "card",
    name: "Visa ending in 4242",
    details: "Expires 12/26",
    isDefault: true,
  },
  {
    id: "2",
    type: "card",
    name: "Mastercard ending in 8888",
    details: "Expires 08/25",
    isDefault: false,
  },
  {
    id: "3",
    type: "upi",
    name: "Google Pay",
    details: "john@oksbi",
    isDefault: false,
  },
];

export default function PaymentMethods() {
  const router = useRouter();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    initialPaymentMethods,
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const resetForm = () =>
    setFormData({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "" });

  const handleAddCard = () => {
    if (!formData.cardNumber || !formData.cardHolder || !formData.expiryDate) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all card details.",
      });
      return;
    }
    const lastFour = formData.cardNumber.slice(-4);
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: "card",
      name: `Card ending in ${lastFour}`,
      details: `Expires ${formData.expiryDate}`,
      isDefault: paymentMethods.length === 0,
    };
    setPaymentMethods((prev) => [...prev, newMethod]);
    Toast.show({
      type: "success",
      text1: "Card Added",
      text2: "Your payment method has been saved.",
    });
    setShowAddDialog(false);
    resetForm();
  };

  const setAsDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({ ...pm, isDefault: pm.id === id })),
    );
    Toast.show({
      type: "success",
      text1: "Default Updated",
      text2: "This is now your default payment method.",
    });
    setShowOptionsModal(null);
  };

  const deletePaymentMethod = (id: string) => {
    const method = paymentMethods.find((pm) => pm.id === id);
    if (method?.isDefault && paymentMethods.length > 1) {
      Toast.show({
        type: "error",
        text1: "Cannot Delete",
        text2: "Please set another payment method as default first.",
      });
      return;
    }
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
    Toast.show({
      type: "success",
      text1: "Payment Method Removed",
      text2: `${method?.name} has been removed.`,
    });
    setShowOptionsModal(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="border-b border-border bg-card/95 px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onPress={() => router.navigate("profile" as never)}
            >
              <ArrowLeft size={20} className="text-foreground" />
            </Button>
            <Text className="text-lg font-bold text-foreground">
              Payment Methods
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowAddDialog(true)}
            className="flex-row items-center gap-1 bg-primary px-3 py-1.5 rounded-md"
          >
            <Plus size={16} className="text-primary-foreground" />
            <Text className="text-primary-foreground text-xs font-semibold">
              Add
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 px-4 py-6"
          contentContainerStyle={{ gap: 16, paddingBottom: 40 }}
        >
          {paymentMethods.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 items-center">
                <CreditCard size={48} className="text-muted-foreground mb-3" />
                <Text className="text-muted-foreground">
                  No payment methods saved
                </Text>
                <Button
                  className="mt-4 flex-row gap-1"
                  onPress={() => setShowAddDialog(true)}
                >
                  <Plus size={16} className="text-primary-foreground" />
                  <Text className="text-primary-foreground font-semibold">
                    Add Payment Method
                  </Text>
                </Button>
              </CardContent>
            </Card>
          ) : (
            paymentMethods.map((method) => (
              <Card
                key={method.id}
                className={`border-border ${
                  method.isDefault ? "border-primary border-2" : ""
                }`}
              >
                <CardContent className="p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View
                        className={`h-12 w-12 rounded-xl items-center justify-center ${
                          method.type === "card"
                            ? "bg-primary/10"
                            : method.type === "upi"
                              ? "bg-purple-500/10"
                              : "bg-green-500/10"
                        }`}
                      >
                        {method.type === "card" ? (
                          <CreditCard size={24} className="text-primary" />
                        ) : (
                          <Wallet size={24} className="text-purple-500" />
                        )}
                      </View>
                      <View>
                        <View className="flex-row items-center gap-2">
                          <Text className="font-medium text-foreground">
                            {method.name}
                          </Text>
                          {method.isDefault && (
                            <View className="px-2 py-0.5 rounded-full bg-primary/10">
                              <Text className="text-xs text-primary">
                                Default
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-sm text-muted-foreground">
                          {method.details}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => setShowOptionsModal(method.id)}
                    >
                      <MoreVertical
                        size={20}
                        className="text-muted-foreground"
                      />
                    </TouchableOpacity>
                  </View>
                </CardContent>
              </Card>
            ))
          )}

          <TouchableOpacity
            className="w-full flex-row items-center p-4 border border-input rounded-xl gap-3"
            onPress={() => {
              const newUPI: PaymentMethod = {
                id: Date.now().toString(),
                type: "upi",
                name: "UPI Payment",
                details: "Pay using any UPI app",
                isDefault: false,
              };
              setPaymentMethods((prev) => [...prev, newUPI]);
              Toast.show({
                type: "success",
                text1: "UPI Added",
                text2: "UPI payment option has been added.",
              });
            }}
          >
            <View className="h-10 w-10 rounded-xl bg-purple-500/10 items-center justify-center">
              <Wallet size={20} className="text-purple-500" />
            </View>
            <View>
              <Text className="font-medium text-foreground">Add UPI</Text>
              <Text className="text-sm text-muted-foreground">
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
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <View className="bg-background w-full max-w-sm rounded-xl p-6 gap-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-foreground">
                  Add New Card
                </Text>
                <TouchableOpacity onPress={() => setShowAddDialog(false)}>
                  <X size={24} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>

              <View className="gap-4">
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Card Number
                  </Text>
                  <Input
                    value={formData.cardNumber}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, cardNumber: text }))
                    }
                    placeholder="1234 5678 9012 3456"
                    keyboardType="numeric"
                    maxLength={19}
                  />
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Cardholder Name
                  </Text>
                  <Input
                    value={formData.cardHolder}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, cardHolder: text }))
                    }
                    placeholder="John Doe"
                  />
                </View>
                <View className="flex-row gap-3">
                  <View className="flex-1 gap-2">
                    <Text className="text-sm font-medium text-foreground">
                      Expiry Date
                    </Text>
                    <Input
                      value={formData.expiryDate}
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, expiryDate: text }))
                      }
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </View>
                  <View className="flex-1 gap-2">
                    <Text className="text-sm font-medium text-foreground">
                      CVV
                    </Text>
                    <Input
                      secureTextEntry
                      value={formData.cvv}
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, cvv: text }))
                      }
                      placeholder="***"
                      maxLength={4}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>

              <View className="flex-row gap-2 mt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onPress={() => {
                    setShowAddDialog(false);
                    resetForm();
                  }}
                >
                  <Text className="text-foreground">Cancel</Text>
                </Button>
                <Button className="flex-1" onPress={handleAddCard}>
                  <Text className="text-primary-foreground font-semibold">
                    Add Card
                  </Text>
                </Button>
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
            className="flex-1 bg-black/50 justify-end"
            activeOpacity={1}
            onPress={() => setShowOptionsModal(null)}
          >
            <View className="bg-background rounded-t-xl p-4 gap-2">
              <Text className="text-lg font-bold text-foreground mb-2 px-2">
                Payment Options
              </Text>
              <TouchableOpacity
                className="flex-row items-center gap-3 p-3 rounded-lg active:bg-secondary"
                onPress={() =>
                  showOptionsModal && setAsDefault(showOptionsModal)
                }
              >
                <CheckCircle size={20} className="text-foreground" />
                <Text className="text-base text-foreground">
                  Set as Default
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center gap-3 p-3 rounded-lg active:bg-secondary"
                onPress={() =>
                  showOptionsModal && deletePaymentMethod(showOptionsModal)
                }
              >
                <Trash2 size={20} className="text-destructive" />
                <Text className="text-base text-destructive">Remove</Text>
              </TouchableOpacity>
              <Button
                variant="outline"
                className="mt-2"
                onPress={() => setShowOptionsModal(null)}
              >
                <Text className="text-foreground">Cancel</Text>
              </Button>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
