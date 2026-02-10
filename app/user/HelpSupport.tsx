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
  StyleSheet,
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
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Text style={styles.headerTitle}>Help & Support</Text>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Search */}
          <View style={styles.searchContainer}>
            <Search
              size={18}
              color="#94a3b8"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search for help..."
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>

          {/* Contact Options */}
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
              <Phone size={24} color="#22c55e" style={{ marginBottom: 8 }} />
              <Text style={styles.contactButtonText}>Call Us</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() =>
                Toast.show({
                  type: "info",
                  text1: "Live Chat",
                  text2: "Connecting to support agent...",
                })
              }
            >
              <MessageCircle
                size={24}
                color="#2dd4bf"
                style={{ marginBottom: 8 }}
              />
              <Text style={styles.contactButtonText}>Live Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleEmail}
            >
              <Mail size={24} color="#f97316" style={{ marginBottom: 8 }} />
              <Text style={styles.contactButtonText}>Email</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Ticket */}
          <TouchableOpacity
            style={styles.ticketCard}
            onPress={() => setShowContactDialog(true)}
          >
            <View style={styles.ticketCardContent}>
              <View style={styles.iconContainer}>
                <FileText size={20} color="#2dd4bf" />
              </View>
              <View style={styles.ticketTextContainer}>
                <Text style={styles.ticketTitle}>Submit a Ticket</Text>
                <Text style={styles.ticketSubtitle}>
                  Describe your issue in detail
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#94a3b8" />
          </TouchableOpacity>

          {/* FAQS */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <HelpCircle size={18} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Frequently Asked Questions</Text>
            </View>
            <View style={styles.cardBody}>
              {filteredFaqs.map((faq, index) => (
                <View
                  key={index}
                  style={[
                    styles.faqItem,
                    index === filteredFaqs.length - 1 && styles.noBorder,
                  ]}
                >
                  <TouchableOpacity
                    style={styles.faqQuestion}
                    onPress={() => toggleFaq(index)}
                  >
                    <Text style={styles.faqQuestionText}>{faq.question}</Text>
                    {expandedFaqIndex === index ? (
                      <ChevronUp size={16} color="#94a3b8" />
                    ) : (
                      <ChevronDown size={16} color="#94a3b8" />
                    )}
                  </TouchableOpacity>
                  {expandedFaqIndex === index && (
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  )}
                </View>
              ))}
              {filteredFaqs.length === 0 && (
                <Text style={styles.noResultsText}>No results found</Text>
              )}
            </View>
          </View>

          {/* Resources */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Resources</Text>
            </View>
            <View style={styles.cardBody}>
              {["User Guide", "Terms of Service", "Refund Policy"].map(
                (item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.resourceItem,
                      index === 2 && styles.noBorder,
                    ]}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <FileText
                        size={16}
                        color="#94a3b8"
                        style={{ marginRight: 12 }}
                      />
                      <Text style={styles.resourceText}>{item}</Text>
                    </View>
                    <ExternalLink size={16} color="#94a3b8" />
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>

          {/* Footer Info */}
          <View style={styles.footerInfo}>
            <Text style={styles.footerLabel}>24/7 Customer Support</Text>
            <Text style={styles.footerPhone}>1-800-RENTALS</Text>
            <Text style={styles.footerEmail}>support@vehiclerental.com</Text>
          </View>
        </ScrollView>

        {/* Support Ticket Modal */}
        <Modal
          visible={showContactDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowContactDialog(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Submit a Support Ticket</Text>
                <TouchableOpacity
                  onPress={() => setShowContactDialog(false)}
                >
                  <X size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Subject</Text>
                  <TextInput
                    value={contactForm.subject}
                    onChangeText={(text) =>
                      setContactForm((prev) => ({ ...prev, subject: text }))
                    }
                    placeholder="Brief description of your issue"
                    placeholderTextColor="#64748b"
                    style={styles.input}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Message</Text>
                  <TextInput
                    value={contactForm.message}
                    onChangeText={(text) =>
                      setContactForm((prev) => ({ ...prev, message: text }))
                    }
                    placeholder="Describe your issue in detail..."
                    placeholderTextColor="#64748b"
                    multiline
                    numberOfLines={5}
                    style={[styles.input, styles.textArea]}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowContactDialog(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmitTicket}
                >
                  <Text style={styles.submitButtonText}>Submit Ticket</Text>
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
  searchContainer: {
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    paddingVertical: 12,
    paddingLeft: 40,
    paddingRight: 16,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#334155",
    fontSize: 14,
  },
  contactRow: {
    flexDirection: "row",
    gap: 12,
  },
  contactButton: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2dd4bf", // Teal border for buttons
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  contactButtonText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "500",
  },
  ticketCard: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ticketCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(45, 212, 191, 0.1)", // Teal tint
    alignItems: "center",
    justifyContent: "center",
  },
  ticketTextContainer: {
    gap: 2,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  ticketSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
  },
  card: {
    backgroundColor: "#1e293b",
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
  cardBody: {
    paddingHorizontal: 16,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    paddingVertical: 12,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  faqQuestion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  faqQuestionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
    flex: 1,
    paddingRight: 16,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 8,
    lineHeight: 20,
  },
  noResultsText: {
    textAlign: "center",
    color: "#94a3b8",
    paddingVertical: 16,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  resourceText: {
    fontSize: 14,
    color: "#ffffff",
  },
  footerInfo: {
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#1e293b",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  footerLabel: {
    fontSize: 12,
    color: "#94a3b8",
  },
  footerPhone: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 4,
  },
  footerEmail: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 2,
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
    padding: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
  textArea: {
    height: 120,
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
    borderColor: "#2dd4bf",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#2dd4bf",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#0f172a",
    fontWeight: "600",
  },
});