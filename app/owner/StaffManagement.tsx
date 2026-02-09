import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  mockOwnerShops,
  mockOwnerStaff,
  OwnerStaff,
} from "@/data/ownerMockData";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Edit,
  Mail,
  MoreVertical,
  Plus,
  Power,
  Store,
  Trash2,
  Users,
  X,
} from "lucide-react-native";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", password: "", shopId: "" });
  };

  const handleAddStaff = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all required fields including password.",
      });
      return;
    }

    if (formData.password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Password must be at least 6 characters.",
      });
      return;
    }

    const shop =
      mockOwnerShops.find((s) => s.id === formData.shopId) || mockOwnerShops[0];
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
    Toast.show({
      type: "success",
      text1: "Staff Added",
      text2: `${formData.name} has been added successfully.`,
    });
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
          : s,
      ),
    );
    Toast.show({
      type: "success",
      text1: "Staff Updated",
      text2: `${formData.name} has been updated successfully.`,
    });
    setShowEditDialog(false);
    setSelectedStaff(null);
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
          ? {
              ...s,
              status: s.status === "active" ? "inactive" : "active",
            }
          : s,
      ),
    );
    const staff = staffList.find((s) => s.id === staffId);
    Toast.show({
      type: "success",
      text1:
        staff?.status === "active" ? "Staff Deactivated" : "Staff Activated",
      text2: `${staff?.name} has been ${
        staff?.status === "active" ? "deactivated" : "activated"
      }.`,
    });
    setShowActionsDialog(false);
  };

  const deleteStaff = (staffId: string) => {
    const staff = staffList.find((s) => s.id === staffId);
    setStaffList((prev) => prev.filter((s) => s.id !== staffId));
    Toast.show({
      type: "success",
      text1: "Staff Removed",
      text2: `${staff?.name} has been removed.`,
    });
    setShowActionsDialog(false);
  };

  const openActions = (staff: OwnerStaff) => {
    setSelectedStaff(staff);
    setShowActionsDialog(true);
  };

  const renderPicker = (
    title: string,
    options: { label: string; value: string }[],
    visible: boolean,
    onClose: () => void,
    onSelect: (value: string) => void,
  ) =>
    visible && (
      <View className="absolute inset-0 bg-black/50 justify-center items-center p-4 z-50">
        <View className="bg-background w-full max-w-sm rounded-xl p-4 gap-2">
          <Text className="text-lg font-bold mb-2 text-foreground">
            {title}
          </Text>
          <ScrollView className="max-h-60">
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                className="p-3 border-b border-border"
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <Text className="text-foreground">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Button variant="ghost" onPress={onClose}>
            <Text className="text-foreground">Close</Text>
          </Button>
        </View>
      </View>
    );

  return (
    <SafeAreaView className="flex-1 bg-background pt-8">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="border-b border-border bg-card/95 px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onPress={() => router.push("/owner/OwnerDashboard")}
            >
              <ArrowLeft size={20} className="text-foreground" />
            </Button>
            <Text className="text-lg font-bold text-foreground">
              Staff Management
            </Text>
          </View>
          <Button size="sm" onPress={() => setShowAddDialog(true)}>
            <Plus size={16} className="text-primary-foreground mr-1" />
            <Text className="text-primary-foreground text-xs">Add Staff</Text>
          </Button>
        </View>

        <ScrollView
          className="flex-1 px-4 py-6"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Stats */}
          <View className="flex-row gap-3 mb-6">
            <Card className="border-border flex-1">
              <CardContent className="p-3 items-center">
                <Text className="text-xl font-bold text-foreground">
                  {staffList.length}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  Total Staff
                </Text>
              </CardContent>
            </Card>
            <Card className="border-border flex-1">
              <CardContent className="p-3 items-center">
                <Text className="text-xl font-bold text-green-500">
                  {staffList.filter((s) => s.status === "active").length}
                </Text>
                <Text className="text-xs text-muted-foreground">Active</Text>
              </CardContent>
            </Card>
            <Card className="border-border flex-1">
              <CardContent className="p-3 items-center">
                <Text className="text-xl font-bold text-foreground">
                  {staffList.reduce((sum, s) => sum + s.assignedTasks, 0)}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  Tasks Today
                </Text>
              </CardContent>
            </Card>
          </View>

          {/* Staff List */}
          {staffList.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 items-center">
                <Users size={48} className="text-muted-foreground mb-3" />
                <Text className="text-muted-foreground mb-4">
                  No staff members yet
                </Text>
                <Button onPress={() => setShowAddDialog(true)}>
                  <Plus size={16} className="text-primary-foreground mr-1" />
                  <Text className="text-primary-foreground">
                    Add Your First Staff
                  </Text>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <View className="gap-4">
              {staffList.map((staff) => (
                <Card key={staff.id} className="border-border">
                  <CardContent className="p-4">
                    <View className="flex-row items-start justify-between">
                      <View className="flex-row items-center gap-3 flex-1">
                        <View className="h-12 w-12 rounded-full bg-green-500/10 items-center justify-center">
                          <Users size={24} className="text-green-500" />
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-center gap-2">
                            <Text className="font-medium text-foreground">
                              {staff.name}
                            </Text>
                            <View
                              className={`px-2 py-0.5 rounded-full ${
                                staff.status === "active"
                                  ? "bg-green-500/10"
                                  : "bg-destructive/10"
                              }`}
                            >
                              <Text
                                className={`text-xs ${
                                  staff.status === "active"
                                    ? "text-green-500"
                                    : "text-destructive"
                                }`}
                              >
                                {staff.status}
                              </Text>
                            </View>
                          </View>
                          <View className="flex-row items-center gap-1 mt-1">
                            <Store
                              size={12}
                              className="text-muted-foreground"
                            />
                            <Text className="text-xs text-muted-foreground">
                              {staff.shopName}
                            </Text>
                          </View>
                          <View className="flex-row items-center gap-1 mt-1">
                            <Mail size={12} className="text-muted-foreground" />
                            <Text className="text-xs text-muted-foreground">
                              {staff.email}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onPress={() => openActions(staff)}
                      >
                        <MoreVertical size={16} className="text-foreground" />
                      </Button>
                    </View>

                    {/* Stats */}
                    <View className="flex-row items-center gap-4 mt-4 pt-3 border-t border-border">
                      <View className="flex-row items-center gap-2">
                        <Clock size={16} className="text-orange-500" />
                        <Text className="text-sm text-foreground">
                          {staff.assignedTasks} pending
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <Text className="text-sm text-foreground">
                          {staff.completedTasks} completed
                        </Text>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Add Staff Modal */}
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
                  Add New Staff
                </Text>
                <TouchableOpacity onPress={() => setShowAddDialog(false)}>
                  <X size={24} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>

              <ScrollView className="gap-4">
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Full Name *
                  </Text>
                  <Input
                    value={formData.name}
                    onChangeText={(text) => handleInputChange("name", text)}
                    placeholder="Enter staff name"
                  />
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Email *
                  </Text>
                  <Input
                    value={formData.email}
                    onChangeText={(text) => handleInputChange("email", text)}
                    placeholder="Enter email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Phone *
                  </Text>
                  <Input
                    value={formData.phone}
                    onChangeText={(text) => handleInputChange("phone", text)}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                  />
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Password *
                  </Text>
                  <Input
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(text) => handleInputChange("password", text)}
                    placeholder="Create login password (min 6 chars)"
                  />
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Assign to Shop *
                  </Text>
                  <TouchableOpacity
                    className="flex h-12 w-full flex-row items-center justify-between rounded-xl border border-input bg-background px-3 py-2"
                    onPress={() => setShowShopPicker(true)}
                  >
                    <Text
                      className={
                        formData.shopId
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {mockOwnerShops.find((s) => s.id === formData.shopId)
                        ?.name || "Select shop"}
                    </Text>
                    <Store size={16} className="text-muted-foreground" />
                  </TouchableOpacity>
                </View>
              </ScrollView>

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
                <Button className="flex-1" onPress={handleAddStaff}>
                  <Text className="text-primary-foreground font-medium">
                    Add Staff
                  </Text>
                </Button>
              </View>
            </View>
          </View>
          {/* Shop Picker Nested in Modal */}
          {renderPicker(
            "Select Shop",
            mockOwnerShops.map((s) => ({ label: s.name, value: s.id })),
            showShopPicker,
            () => setShowShopPicker(false),
            (v) => handleInputChange("shopId", v),
          )}
        </Modal>

        {/* Edit Staff Modal */}
        <Modal
          visible={showEditDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowEditDialog(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <View className="bg-background w-full max-w-sm rounded-xl p-6 gap-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-foreground">
                  Edit Staff
                </Text>
                <TouchableOpacity onPress={() => setShowEditDialog(false)}>
                  <X size={24} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>

              <ScrollView className="gap-4">
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Full Name *
                  </Text>
                  <Input
                    value={formData.name}
                    onChangeText={(text) => handleInputChange("name", text)}
                  />
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Email *
                  </Text>
                  <Input
                    value={formData.email}
                    onChangeText={(text) => handleInputChange("email", text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Phone *
                  </Text>
                  <Input
                    value={formData.phone}
                    onChangeText={(text) => handleInputChange("phone", text)}
                    keyboardType="phone-pad"
                  />
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground">
                    Assign to Shop *
                  </Text>
                  <TouchableOpacity
                    className="flex h-12 w-full flex-row items-center justify-between rounded-xl border border-input bg-background px-3 py-2"
                    onPress={() => setShowShopPicker(true)}
                  >
                    <Text className="text-foreground">
                      {mockOwnerShops.find((s) => s.id === formData.shopId)
                        ?.name || "Select shop"}
                    </Text>
                    <Store size={16} className="text-muted-foreground" />
                  </TouchableOpacity>
                </View>
              </ScrollView>

              <View className="flex-row gap-2 mt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onPress={() => {
                    setShowEditDialog(false);
                    resetForm();
                  }}
                >
                  <Text className="text-foreground">Cancel</Text>
                </Button>
                <Button className="flex-1" onPress={handleEditStaff}>
                  <Text className="text-primary-foreground font-medium">
                    Save Changes
                  </Text>
                </Button>
              </View>
            </View>
          </View>
          {/* Shop Picker Nested in Modal */}
          {renderPicker(
            "Select Shop",
            mockOwnerShops.map((s) => ({ label: s.name, value: s.id })),
            showShopPicker,
            () => setShowShopPicker(false),
            (v) => handleInputChange("shopId", v),
          )}
        </Modal>

        {/* Actions Modal */}
        <Modal
          visible={showActionsDialog}
          transparent
          animationType="slide"
          onRequestClose={() => setShowActionsDialog(false)}
        >
          <TouchableOpacity
            className="flex-1 bg-black/50 justify-end"
            activeOpacity={1}
            onPress={() => setShowActionsDialog(false)}
          >
            <View className="bg-background rounded-t-xl p-6 gap-4">
              <Text className="text-lg font-bold text-foreground text-center">
                {selectedStaff?.name}
              </Text>

              <TouchableOpacity
                className="flex-row items-center gap-3 p-3 bg-secondary rounded-xl"
                onPress={() => selectedStaff && openEditDialog(selectedStaff)}
              >
                <Edit size={20} className="text-foreground" />
                <Text className="text-foreground font-medium">Edit Staff</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center gap-3 p-3 bg-secondary rounded-xl"
                onPress={() =>
                  selectedStaff && toggleStaffStatus(selectedStaff.id)
                }
              >
                <Power size={20} className="text-foreground" />
                <Text className="text-foreground font-medium">
                  {selectedStaff?.status === "active"
                    ? "Deactivate Staff"
                    : "Activate Staff"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center gap-3 p-3 bg-destructive/10 rounded-xl"
                onPress={() => selectedStaff && deleteStaff(selectedStaff.id)}
              >
                <Trash2 size={20} className="text-destructive" />
                <Text className="text-destructive font-medium">
                  Remove Staff
                </Text>
              </TouchableOpacity>

              <Button
                variant="outline"
                className="mt-2"
                onPress={() => setShowActionsDialog(false)}
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
