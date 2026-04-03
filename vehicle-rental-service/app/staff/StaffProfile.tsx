import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  LogOut,
  User,
  Wrench,
  Lock,
  Phone,
  Mail,
} from "lucide-react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { profileManagementApi } from "@/services/api";

const COLORS = {
  background: "#0F1C23", // RentXplore Dark
  card: "#16202C",       // RentXplore Card
  primary: "#22D3EE",    // RentXplore Cyan
  danger: "#EF4444",     // Standard Red
  text: "#FFFFFF",
  textMuted: "#94A3B8",
  border: "rgba(148, 163, 184, 0.1)",
  inputBg: "#0F1C23",
};

const toInputString = (v: unknown): string => {
  if (v == null || v === "") return "";
  return String(v);
};

export default function StaffProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const profile = await profileManagementApi.getUserProfileExtended();
      setFormData((prev) => ({
        ...prev,
        name: toInputString(profile.first_name ?? user?.name),
        email: toInputString(profile.email ?? user?.email),
        phone: toInputString(profile.phone ?? user?.phone),
      }));
    } catch (err) {
      setFormData((prev) => ({
        ...prev,
        name: toInputString(user?.name ?? ""),
        email: toInputString(user?.email ?? ""),
        phone: toInputString(user?.phone ?? ""),
      }));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await profileManagementApi.updateUserProfile({
        first_name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
      Toast.show({ type: "success", text1: "Profile Updated" });
      setIsEditing(false);
    } catch (err: any) {
      Toast.show({ type: "error", text1: "Update Failed" });
    } finally {
      setSaving(false);
    }
  };

  const CustomInput = ({
    label,
    value,
    onChangeText,
    icon: Icon,
    secureTextEntry = false,
    placeholder = "",
    editable = true,
  }: any) => (
    <View className="mb-5">
      <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">
        {label}
      </Text>
      <View
        className="flex-row items-center px-4 h-14 rounded-2xl border"
        style={{
          backgroundColor: editable ? COLORS.inputBg : "transparent",
          borderColor: editable ? COLORS.border : "rgba(148, 163, 184, 0.05)",
        }}
      >
        {Icon && <Icon size={18} color={COLORS.primary} style={{ marginRight: 12 }} />}
        <TextInput
          className="flex-1 text-white text-base"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          placeholderTextColor="#475569"
          editable={editable}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-xl bg-[#16202C] border border-slate-700/50">
            <ArrowLeft size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-white">Staff Profile</Text>
          <View style={{ width: 40 }} /> 
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {/* Avatar Section */}
          <View className="items-center mt-4 mb-8">
            <View className="h-24 w-24 rounded-3xl bg-[#22D3EE] items-center justify-center mb-4 shadow-lg shadow-cyan-500/30">
              <User size={48} color="#0F1C23" strokeWidth={2} />
            </View>
            <Text className="text-2xl font-bold text-white">{formData.name}</Text>
            <View className="bg-cyan-500/10 px-3 py-1 rounded-full mt-1 border border-cyan-500/20">
              <Text className="text-[#22D3EE] text-[10px] font-bold uppercase tracking-tighter">Verified Staff</Text>
            </View>
          </View>

          {/* Profile Card */}
          <View className="p-6 rounded-3xl border mb-6" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center gap-2">
                 <Wrench size={18} color={COLORS.primary} />
                 <Text className="text-white font-bold text-lg">Personal Details</Text>
              </View>
              <TouchableOpacity onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}>
                <Text style={{ color: COLORS.primary }} className="font-bold">
                  {isEditing ? "SAVE" : "EDIT"}
                </Text>
              </TouchableOpacity>
            </View>

            <CustomInput label="Full Name" value={formData.name} onChangeText={(t: string) => handleInputChange("name", t)} icon={User} editable={isEditing} />
            <CustomInput label="Email" value={formData.email} onChangeText={(t: string) => handleInputChange("email", t)} icon={Mail} editable={isEditing} />
            <CustomInput label="Phone" value={formData.phone} onChangeText={(t: string) => handleInputChange("phone", t)} icon={Phone} editable={isEditing} />
          </View>

          {/* Password Card */}
          <View className="p-6 rounded-3xl border mb-6" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
            <View className="flex-row items-center gap-2 mb-6">
               <Lock size={18} color={COLORS.primary} />
               <Text className="text-white font-bold text-lg">Security</Text>
            </View>
            <CustomInput label="Current Password" value={formData.currentPassword} onChangeText={(t: string) => handleInputChange("currentPassword", t)} secureTextEntry placeholder="••••••••" />
            <CustomInput label="New Password" value={formData.newPassword} onChangeText={(t: string) => handleInputChange("newPassword", t)} secureTextEntry placeholder="••••••••" />
            
            <TouchableOpacity className="w-full h-14 rounded-2xl items-center justify-center mt-2" style={{ backgroundColor: COLORS.primary }} onPress={() => Toast.show({type: 'info', text1: 'Password service pending'})}>
              <Text className="text-[#0F1C23] font-bold">Update Password</Text>
            </TouchableOpacity>
          </View>

          {/* Logout */}
          <TouchableOpacity 
            className="w-full h-16 rounded-3xl flex-row items-center justify-center gap-3 mb-10 border border-red-500/20" 
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            onPress={logout}
          >
            <LogOut size={20} color={COLORS.danger} />
            <Text numberOfLines={1} className="text-red-500 font-bold text-base">Sign Out</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}