import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Plus,
  MoreVertical,
  Clock,
  CheckCircle,
  Users,
  Store,
  Mail,
  X,
  Edit,
  Power,
  Trash2,
} from "lucide-react-native";
import Toast from "react-native-toast-message";

// Types
export interface OwnerStaff {
  id: string;
  shopId: string;
  shopName: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  assignedTasks: number;
  completedTasks: number;
  joinedDate: string;
}

// Mock Data
const mockOwnerShops = [
  { id: "1", name: "SpeedWheels Downtown" },
  { id: "2", name: "SpeedWheels Midtown" },
];

const mockOwnerStaff: OwnerStaff[] = [
  {
    id: "st1",
    shopId: "1",
    shopName: "SpeedWheels Downtown",
    name: "Mike Staff",
    email: "mike@rental.com",
    phone: "123-456-7890",
    status: "active",
    assignedTasks: 5,
    completedTasks: 127,
    joinedDate: "2024-01-15",
  },
  {
    id: "st2",
    shopId: "1",
    shopName: "SpeedWheels Downtown",
    name: "Jane Doe",
    email: "jane@rental.com",
    phone: "987-654-3210",
    status: "active",
    assignedTasks: 3,
    completedTasks: 89,
    joinedDate: "2024-02-01",
  },
  {
    id: "st3",
    shopId: "2",
    shopName: "SpeedWheels Midtown",
    name: "Tom Wilson",
    email: "tom@rental.com",
    phone: "555-666-7777",
    status: "inactive",
    assignedTasks: 0,
    completedTasks: 45,
    joinedDate: "2023-11-20",
  },
];

export default function StaffManagement() {
  const router = useRouter();
  const [staffList, setStaffList] = useState<OwnerStaff[]>(mockOwnerStaff);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showActionsDialog, setShowActionsDialog] = useState(false);
  const [showShopPicker, setShowShopPicker] = useState(false);

  const [selectedStaff, setSelectedStaff] = useState<OwnerStaff | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    shopId: "",
  });

  // --- Handlers ---

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", password: "", shopId: "" });
  };

  const handleAddStaff = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill in all required fields.",
      });
      return;
    }

    const shop = mockOwnerShops.find((s) => s.id === formData.shopId) || mockOwnerShops[0];
    const newStaff: OwnerStaff = {
      id: `st${Date.now()}`,
      shopId: formData.shopId || mockOwnerShops[0].id,
      shopName: shop.name,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      status: "active",
      assignedTasks: 0,
      completedTasks: 0,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setStaffList((prev) => [...prev, newStaff]);
    Toast.show({ type: "success", text1: "Success", text2: "Staff member added." });
    setShowAddDialog(false);
    resetForm();
  };

  const handleEditStaff = () => {
    if (!selectedStaff) return;
    const shop = mockOwnerShops.find((s) => s.id === formData.shopId);
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === selectedStaff.id
          ? {
              ...s,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              shopId: formData.shopId,
              shopName: shop?.name || s.shopName,
            }
          : s
      )
    );
    Toast.show({ type: "success", text1: "Updated", text2: "Staff details updated." });
    setShowEditDialog(false);
    resetForm();
  };

  const openEditDialog = (staff: OwnerStaff) => {
    setSelectedStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      password: "",
      shopId: staff.shopId,
    });
    setShowEditDialog(true);
    setShowActionsDialog(false);
  };

  const toggleStaffStatus = (staffId: string) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? { ...s, status: s.status === "active" ? "inactive" : "active" }
          : s
      )
    );
    setShowActionsDialog(false);
  };

  const deleteStaff = (staffId: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== staffId));
    setShowActionsDialog(false);
  };

  const openActions = (staff: OwnerStaff) => {
    setSelectedStaff(staff);
    setShowActionsDialog(true);
  };

  // --- Render Helpers ---

  const renderPicker = (
    title: string,
    options: { label: string; value: string }[],
    visible: boolean,
    onClose: () => void,
    onSelect: (value: string) => void
  ) =>
    visible && (
      <View className="absolute inset-0 bg-black/80 justify-center items-center p-4 z-50">
        <View className="bg-[#1e2330] w-full max-w-xs rounded-2xl p-4 gap-2 border border-slate-700">
          <Text className="text-lg font-bold mb-2 text-white">{title}</Text>
          <ScrollView className="max-h-60">
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                className="p-4 border-b border-slate-700"
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <Text className="text-slate-200">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={onClose} className="p-3 items-center">
            <Text className="text-slate-400">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

  return (
    <SafeAreaView className="flex-1 bg-[#0f111a]">
      <StatusBar barStyle="light-content" backgroundColor="#0f111a" />
      
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-4 py-4 mb-2">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">Staff Management</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowAddDialog(true)}
          className="bg-[#2DD4BF] flex-row items-center px-4 py-2.5 rounded-full shadow-lg"
          style={{ shadowColor: '#2DD4BF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 }}
        >
          <Plus size={18} color="#000" strokeWidth={2.5} />
          <Text className="text-black font-bold ml-1 text-sm">Add Staff</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* STATS ROW */}
        <View className="flex-row gap-3 mb-6">
          {/* Card 1: Total Staff */}
          <View className="flex-1 bg-[#1e2330] rounded-2xl p-4 border border-slate-800/50 items-center justify-center py-5">
            <Text className="text-2xl font-bold text-white mb-1">
              {staffList.length}
            </Text>
            <Text className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Staff</Text>
          </View>

          {/* Card 2: Active */}
          <View className="flex-1 bg-[#1e2330] rounded-2xl p-4 border border-slate-800/50 items-center justify-center py-5">
            <Text className="text-2xl font-bold text-green-500 mb-1">
              {staffList.filter((s) => s.status === "active").length}
            </Text>
            <Text className="text-slate-500 text-xs font-medium uppercase tracking-wider">Active</Text>
          </View>

          {/* Card 3: Tasks */}
          <View className="flex-1 bg-[#1e2330] rounded-2xl p-4 border border-slate-800/50 items-center justify-center py-5">
            <Text className="text-2xl font-bold text-white mb-1">
              {staffList.reduce((sum, s) => sum + s.assignedTasks, 0)}
            </Text>
            <Text className="text-slate-500 text-xs font-medium uppercase tracking-wider">Tasks Today</Text>
          </View>
        </View>

        {/* STAFF LIST */}
        <View className="gap-4">
          {staffList.map((staff) => (
            <View
              key={staff.id}
              className="bg-[#1e2330] rounded-2xl border border-slate-800/50 overflow-hidden"
            >
              {/* Top Section */}
              <View className="p-4 flex-row items-start">
                {/* Avatar */}
                <View className="h-12 w-12 rounded-full bg-[#162e26] items-center justify-center mr-3 mt-1">
                  <Users size={22} className="text-green-500" color="#22c55e" />
                </View>

                {/* Details */}
                <View className="flex-1 gap-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-white text-lg font-bold">{staff.name}</Text>
                    <View
                      className={`px-2 py-0.5 rounded-full ${
                        staff.status === "active" ? "bg-green-500/10" : "bg-red-500/10"
                      }`}
                    >
                      <Text
                        className={`text-[10px] font-bold uppercase ${
                          staff.status === "active" ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {staff.status}
                      </Text>
                    </View>
                  </View>
                  
                  <Text className="text-slate-400 text-sm">{staff.shopName}</Text>
                  
                  <View className="flex-row items-center gap-1.5 mt-0.5">
                    <Mail size={12} color="#94a3b8" />
                    <Text className="text-slate-400 text-sm">{staff.email}</Text>
                  </View>
                </View>

                {/* Menu Button */}
                <TouchableOpacity 
                    className="p-2 -mr-2 -mt-2"
                    onPress={() => openActions(staff)}
                >
                  <MoreVertical size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View className="h-[1px] bg-slate-800 mx-4" />

              {/* Bottom Section - Stats */}
              <View className="flex-row items-center px-4 py-3 gap-6">
                <View className="flex-row items-center gap-2">
                  <Clock size={16} color="#f97316" />
                  <Text className="text-white font-medium text-sm">
                    {staff.assignedTasks} pending
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <CheckCircle size={16} color="#22c55e" />
                  <Text className="text-white font-medium text-sm">
                    {staff.completedTasks} completed
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* --- MODALS (Dark Themed) --- */}

      {/* ADD STAFF MODAL */}
      <Modal
        visible={showAddDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddDialog(false)}
      >
        <View className="flex-1 bg-black/80 justify-center items-center p-4">
          <View className="bg-[#1e2330] w-full max-w-sm rounded-3xl p-6 border border-slate-700">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-white">Add New Staff</Text>
              <TouchableOpacity 
                onPress={() => setShowAddDialog(false)}
                className="bg-slate-800 p-2 rounded-full"
              >
                <X size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <ScrollView className="gap-4 mb-6">
              <View className="gap-2">
                <Text className="text-slate-400 text-sm font-medium ml-1">Full Name</Text>
                <TextInput
                  className="bg-[#0B1120] text-white rounded-xl px-4 py-3 border border-slate-800"
                  placeholder="Enter staff name"
                  placeholderTextColor="#475569"
                  value={formData.name}
                  onChangeText={(t) => handleInputChange("name", t)}
                />
              </View>
              <View className="gap-2">
                <Text className="text-slate-400 text-sm font-medium ml-1">Email</Text>
                <TextInput
                  className="bg-[#0B1120] text-white rounded-xl px-4 py-3 border border-slate-800"
                  placeholder="name@example.com"
                  placeholderTextColor="#475569"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(t) => handleInputChange("email", t)}
                />
              </View>
              <View className="gap-2">
                <Text className="text-slate-400 text-sm font-medium ml-1">Phone</Text>
                <TextInput
                  className="bg-[#0B1120] text-white rounded-xl px-4 py-3 border border-slate-800"
                  placeholder="Phone number"
                  placeholderTextColor="#475569"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(t) => handleInputChange("phone", t)}
                />
              </View>
              <View className="gap-2">
                <Text className="text-slate-400 text-sm font-medium ml-1">Password</Text>
                <TextInput
                  className="bg-[#0B1120] text-white rounded-xl px-4 py-3 border border-slate-800"
                  placeholder="Create password"
                  placeholderTextColor="#475569"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(t) => handleInputChange("password", t)}
                />
              </View>
              <View className="gap-2">
                <Text className="text-slate-400 text-sm font-medium ml-1">Assign Shop</Text>
                <TouchableOpacity
                  className="bg-[#0B1120] flex-row items-center justify-between rounded-xl px-4 py-3 border border-slate-800"
                  onPress={() => setShowShopPicker(true)}
                >
                  <Text className={formData.shopId ? "text-white" : "text-slate-500"}>
                    {mockOwnerShops.find((s) => s.id === formData.shopId)?.name || "Select Shop"}
                  </Text>
                  <Store size={18} color="#64748b" />
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-slate-800 py-3.5 rounded-xl items-center"
                onPress={() => setShowAddDialog(false)}
              >
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-[#2DD4BF] py-3.5 rounded-xl items-center"
                onPress={handleAddStaff}
              >
                <Text className="text-slate-900 font-bold">Add Staff</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {renderPicker(
          "Select Shop",
          mockOwnerShops.map((s) => ({ label: s.name, value: s.id })),
          showShopPicker,
          () => setShowShopPicker(false),
          (v) => handleInputChange("shopId", v)
        )}
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        visible={showEditDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditDialog(false)}
      >
        <View className="flex-1 bg-black/80 justify-center items-center p-4">
          <View className="bg-[#1e2330] w-full max-w-sm rounded-3xl p-6 border border-slate-700">
             <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-white">Edit Staff</Text>
              <TouchableOpacity onPress={() => setShowEditDialog(false)}>
                <X size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            
            <View className="gap-4 mb-6">
                <TextInput
                  className="bg-[#0B1120] text-white rounded-xl px-4 py-3 border border-slate-800"
                  value={formData.name}
                  onChangeText={(t) => handleInputChange("name", t)}
                  placeholderTextColor="#475569"
                />
                <TextInput
                  className="bg-[#0B1120] text-white rounded-xl px-4 py-3 border border-slate-800"
                  value={formData.email}
                  onChangeText={(t) => handleInputChange("email", t)}
                  placeholderTextColor="#475569"
                />
            </View>
            <TouchableOpacity
                className="bg-[#2DD4BF] py-3.5 rounded-xl items-center"
                onPress={handleEditStaff}
              >
                <Text className="text-slate-900 font-bold">Save Changes</Text>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ACTIONS SHEET */}
      <Modal
        visible={showActionsDialog}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActionsDialog(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/80 justify-end"
          activeOpacity={1}
          onPress={() => setShowActionsDialog(false)}
        >
          <View className="bg-[#1e2330] rounded-t-3xl p-6 gap-2 border-t border-slate-700">
            <View className="w-12 h-1 bg-slate-600 rounded-full self-center mb-4" />
            <Text className="text-lg font-bold text-white text-center mb-4">
              {selectedStaff?.name}
            </Text>

            <TouchableOpacity
              className="flex-row items-center gap-3 p-4 bg-slate-800 rounded-2xl mb-2"
              onPress={() => selectedStaff && openEditDialog(selectedStaff)}
            >
              <Edit size={20} color="#fff" />
              <Text className="text-white font-medium">Edit Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center gap-3 p-4 bg-slate-800 rounded-2xl mb-2"
              onPress={() => selectedStaff && toggleStaffStatus(selectedStaff.id)}
            >
              <Power size={20} color={selectedStaff?.status === 'active' ? '#ef4444' : '#22c55e'} />
              <Text className={selectedStaff?.status === 'active' ? "text-red-400 font-medium" : "text-green-400 font-medium"}>
                {selectedStaff?.status === "active" ? "Deactivate Account" : "Activate Account"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center gap-3 p-4 bg-red-500/10 rounded-2xl mb-2"
              onPress={() => selectedStaff && deleteStaff(selectedStaff.id)}
            >
              <Trash2 size={20} color="#ef4444" />
              <Text className="text-red-500 font-medium">Remove Staff</Text>
            </TouchableOpacity>
            
            <View className="h-6" /> 
          </View>
        </TouchableOpacity>
      </Modal>

      <Toast />
    </SafeAreaView>
  );
}