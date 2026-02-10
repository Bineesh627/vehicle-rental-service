import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  FileText,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  Search,
  X,
} from "lucide-react-native";
import { useState } from "react";
import {
  Linking,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const faqs = [
  {
    question: "How do I book a vehicle?",
    answer:
      "Simply browse our available vehicles, select your preferred one, choose your dates and times, and complete the booking.",
  },
  {
    question: "What documents do I need to rent a vehicle?",
    answer:
      "You need a valid driving license, government ID proof (Aadhar/Passport/Voter ID), and to complete KYC verification.",
  },
  {
    question: "Can I cancel my booking?",
    answer:
      "Yes, you can cancel up to 24 hours before pickup time for a full refund. Cancellations within 24 hours may incur a fee.",
  },
  {
    question: "How does home delivery work?",
    answer:
      'Select "Home Delivery" during booking. Our staff will deliver the vehicle to your specified location.',
  },
  {
    question: "What if the vehicle breaks down?",
    answer:
      "Contact our 24/7 support immediately. We provide roadside assistance and will arrange a replacement vehicle if needed.",
  },
  {
    question: "How do I extend my rental period?",
    answer:
      'You can extend from the app under "My Bookings" if the vehicle is available.',
  },
  {
    question: "Is fuel included in the rental price?",
    answer:
      "Vehicles are provided with a certain fuel level. Please return with the same level, or fuel charges will apply.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept credit/debit cards, UPI, net banking, and cash on delivery for select bookings.",
  },
];

export default function HelpSupport() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactForm, setContactForm] = useState({ subject: "", message: "" });
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSubmitTicket = () => {
    if (!contactForm.subject || !contactForm.message) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields.",
      });
      return;
    }
    Toast.show({
      type: "success",
      text1: "Ticket Submitted",
      text2: "Our support team will get back to you within 24 hours.",
    });
    setShowContactDialog(false);
    setContactForm({ subject: "", message: "" });
  };

  const toggleFaq = (index: number) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  const handleCall = () => {
    Linking.openURL("tel:1800RENTALS");
    Toast.show({
      type: "info",
      text1: "Calling Support",
      text2: "Dialing 1-800-RENTALS...",
    });
  };

  const handleEmail = () => {
    Linking.openURL("mailto:support@vehiclerental.com");
    Toast.show({
      type: "info",
      text1: "Opening Email",
      text2: "Drafting email to support...",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="border-b border-border bg-card/95 px-4 py-3 flex-row items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onPress={() => router.navigate("profile" as never)}
          >
            <ArrowLeft size={20} className="text-foreground" />
          </Button>
          <Text className="text-lg font-bold text-foreground">
            Help & Support
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-4 py-6"
          contentContainerStyle={{ gap: 24, paddingBottom: 40 }}
        >
          {/* Search */}
          <View className="relative">
            <Search
              size={16}
              className="absolute left-3 top-3.5 z-10 text-muted-foreground"
            />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="pl-10"
            />
          </View>

          {/* Contact Options */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 items-center justify-center p-4 rounded-xl border border-border bg-card gap-2"
              onPress={handleCall}
            >
              <Phone size={20} className="text-green-500" />
              <Text className="text-xs text-foreground">Call Us</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 items-center justify-center p-4 rounded-xl border border-border bg-card gap-2"
              onPress={() =>
                Toast.show({
                  type: "info",
                  text1: "Live Chat",
                  text2: "Connecting to support agent...",
                })
              }
            >
              <MessageCircle size={20} className="text-primary" />
              <Text className="text-xs text-foreground">Live Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 items-center justify-center p-4 rounded-xl border border-border bg-card gap-2"
              onPress={handleEmail}
            >
              <Mail size={20} className="text-orange-500" />
              <Text className="text-xs text-foreground">Email</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Ticket */}
          <TouchableOpacity onPress={() => setShowContactDialog(true)}>
            <Card className="border-border">
              <CardContent className="p-4 flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 rounded-xl bg-primary/10 items-center justify-center">
                    <FileText size={20} className="text-primary" />
                  </View>
                  <View>
                    <Text className="font-medium text-foreground">
                      Submit a Ticket
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      Describe your issue in detail
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} className="text-muted-foreground" />
              </CardContent>
            </Card>
          </TouchableOpacity>

          {/* FAQS */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border mb-3">
              <View className="flex-row items-center gap-2">
                <HelpCircle size={16} className="text-foreground" />
                <CardTitle className="text-base text-foreground">
                  Frequently Asked Questions
                </CardTitle>
              </View>
            </CardHeader>
            <CardContent>
              {filteredFaqs.map((faq, index) => (
                <View
                  key={index}
                  className={`border-b border-border ${
                    index === filteredFaqs.length - 1 ? "border-0" : ""
                  }`}
                >
                  <TouchableOpacity
                    className="py-3 flex-row items-center justify-between"
                    onPress={() => toggleFaq(index)}
                  >
                    <Text className="text-sm font-medium text-foreground flex-1 pr-4">
                      {faq.question}
                    </Text>
                    {expandedFaqIndex === index ? (
                      <ChevronUp size={16} className="text-muted-foreground" />
                    ) : (
                      <ChevronDown
                        size={16}
                        className="text-muted-foreground"
                      />
                    )}
                  </TouchableOpacity>
                  {expandedFaqIndex === index && (
                    <Text className="text-sm text-muted-foreground pb-3">
                      {faq.answer}
                    </Text>
                  )}
                </View>
              ))}
              {filteredFaqs.length === 0 && (
                <Text className="text-center text-muted-foreground py-4 text-sm">
                  No results found
                </Text>
              )}
            </CardContent>
          </Card>

          {/* Resources */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border mb-0">
              <CardTitle className="text-base text-foreground">
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {["User Guide", "Terms of Service", "Refund Policy"].map(
                (item, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`flex-row items-center justify-between p-4 border-b border-border ${
                      index === 2 ? "border-0" : ""
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <FileText size={16} className="text-muted-foreground" />
                      <Text className="text-sm text-foreground">{item}</Text>
                    </View>
                    <ExternalLink size={16} className="text-muted-foreground" />
                  </TouchableOpacity>
                ),
              )}
            </CardContent>
          </Card>

          {/* Contact Info Footer */}
          <Card className="border-border bg-secondary/30">
            <CardContent className="p-4 items-center">
              <Text className="text-sm text-muted-foreground">
                24/7 Customer Support
              </Text>
              <Text className="text-lg font-bold text-foreground mt-1">
                1-800-RENTALS
              </Text>
              <Text className="text-sm text-muted-foreground mt-1">
                support@vehiclerental.com
              </Text>
            </CardContent>
          </Card>
        </ScrollView>

        {/* Support Ticket Modal */}
        <Modal
          visible={showContactDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowContactDialog(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <View className="bg-background w-full max-w-sm rounded-xl p-6 gap-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-foreground">
                  Submit a Support Ticket
                </Text>
                <TouchableOpacity onPress={() => setShowContactDialog(false)}>
                  <X size={24} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>

              <View className="gap-4">
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Subject
                  </Text>
                  <Input
                    value={contactForm.subject}
                    onChangeText={(text) =>
                      setContactForm((prev) => ({ ...prev, subject: text }))
                    }
                    placeholder="Brief description of your issue"
                  />
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Message
                  </Text>
                  <TextInput
                    className="flex min-h-[120px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    value={contactForm.message}
                    onChangeText={(text) =>
                      setContactForm((prev) => ({ ...prev, message: text }))
                    }
                    placeholder="Describe your issue in detail..."
                  />
                </View>
              </View>

              <View className="flex-row gap-2 mt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onPress={() => setShowContactDialog(false)}
                >
                  <Text className="text-foreground">Cancel</Text>
                </Button>
                <Button className="flex-1" onPress={handleSubmitTicket}>
                  <Text className="text-primary-foreground font-semibold">
                    Submit Ticket
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
