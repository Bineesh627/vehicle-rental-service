import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminUser, mockAdminUsers } from "@/data/adminMockData";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  History,
  MoreVertical,
  Search,
  User,
  X,
  XCircle,
} from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function UserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [userForActions, setUserForActions] = useState<AdminUser | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleUserStatus = (userId: string) => {
    const userToUpdate = users.find((u) => u.id === userId);
    if (!userToUpdate) return;

    const newStatus = userToUpdate.status === "active" ? "inactive" : "active";

    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user,
      ),
    );

    Toast.show({
      type: "success",
      text1: newStatus === "active" ? "User Activated" : "User Deactivated",
      text2: `${userToUpdate.name} has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
    });

    if (selectedUser?.id === userId) {
      setSelectedUser((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const viewUserDetails = (user: AdminUser) => {
    setSelectedUser(user);
    setShowUserDetails(true);
    setUserForActions(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-background pt-8">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="border-b border-border bg-card/95 px-4 py-3 flex-row items-center gap-3">
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <ArrowLeft className="text-foreground" size={24} />
          </Button>
          <Text className="text-lg font-bold text-foreground">
            User Management
          </Text>
        </View>

        <ScrollView
          className="px-4 py-6"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Search */}
          <View className="relative mb-4">
            <View className="absolute left-3 top-3 z-10">
              <Search size={16} className="text-muted-foreground" />
            </View>
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="pl-10 text-foreground"
            />
          </View>

          {/* Stats */}
          <View className="flex-row gap-3 mb-4">
            <Card className="flex-1 border-border">
              <CardContent className="p-3 items-center">
                <Text className="text-xl font-bold text-foreground">
                  {users.length}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  Total Users
                </Text>
              </CardContent>
            </Card>
            <Card className="flex-1 border-border">
              <CardContent className="p-3 items-center">
                <Text className="text-xl font-bold text-green-500">
                  {users.filter((u) => u.status === "active").length}
                </Text>
                <Text className="text-xs text-muted-foreground">Active</Text>
              </CardContent>
            </Card>
            <Card className="flex-1 border-border">
              <CardContent className="p-3 items-center">
                <Text className="text-xl font-bold text-destructive">
                  {users.filter((u) => u.status === "inactive").length}
                </Text>
                <Text className="text-xs text-muted-foreground">Inactive</Text>
              </CardContent>
            </Card>
          </View>

          {/* User List */}
          <View className="gap-3">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="border-border bg-card">
                <CardContent className="p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View className="h-10 w-10 rounded-full bg-primary/10 items-center justify-center">
                        <User size={20} className="text-primary" />
                      </View>
                      <View className="flex-1">
                        <Text className="font-medium text-foreground">
                          {user.name}
                        </Text>
                        <Text className="text-xs text-muted-foreground">
                          {user.email}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <View
                        className={`px-2 py-1 rounded-full ${
                          user.status === "active"
                            ? "bg-green-500/10"
                            : "bg-destructive/10"
                        }`}
                      >
                        <Text
                          className={`text-xs ${
                            user.status === "active"
                              ? "text-green-500"
                              : "text-destructive"
                          }`}
                        >
                          {user.status}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setUserForActions(user)}
                        className="h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
                      >
                        <MoreVertical
                          size={16}
                          className="text-muted-foreground"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        </ScrollView>

        {/* Action Menu Modal */}
        <Modal
          visible={!!userForActions}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setUserForActions(null)}
        >
          <TouchableOpacity
            className="flex-1 bg-black/60 items-center justify-center p-4"
            activeOpacity={1}
            onPress={() => setUserForActions(null)}
          >
            <View className="bg-card w-full max-w-sm rounded-xl overflow-hidden p-2 shadow-lg">
              <Text className="text-sm font-semibold text-muted-foreground p-2 text-center border-b border-border">
                Actions for {userForActions?.name}
              </Text>

              <TouchableOpacity
                className="flex-row items-center p-4 active:bg-secondary rounded-lg"
                onPress={() =>
                  userForActions && viewUserDetails(userForActions)
                }
              >
                <Eye size={18} className="text-foreground mr-3" />
                <Text className="text-foreground">View Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center p-4 active:bg-secondary rounded-lg"
                onPress={() => {
                  userForActions && viewUserDetails(userForActions);
                  // In a real app, this would route to history
                }}
              >
                <History size={18} className="text-foreground mr-3" />
                <Text className="text-foreground">Booking History</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center p-4 active:bg-secondary rounded-lg"
                onPress={() => {
                  if (userForActions) toggleUserStatus(userForActions.id);
                  setUserForActions(null);
                }}
              >
                {userForActions?.status === "active" ? (
                  <>
                    <XCircle size={18} className="text-destructive mr-3" />
                    <Text className="text-destructive">Deactivate User</Text>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} className="text-green-500 mr-3" />
                    <Text className="text-green-500">Activate User</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* User Details Modal */}
        <Modal
          visible={showUserDetails}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowUserDetails(false)}
        >
          <View className="flex-1 justify-end bg-black/60">
            <View
              className={`bg-background rounded-t-3xl ${Platform.OS === "ios" ? "pb-8" : "pb-4"}`}
            >
              <View className="flex-row items-center justify-between p-4 border-b border-border">
                <Text className="text-lg font-bold text-foreground">
                  User Details
                </Text>
                <TouchableOpacity
                  onPress={() => setShowUserDetails(false)}
                  className="p-2"
                >
                  <X size={24} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>

              {selectedUser && (
                <View className="p-4 gap-4">
                  <View className="flex-row items-center gap-3">
                    <View className="h-16 w-16 rounded-full bg-primary/10 items-center justify-center">
                      <User size={32} className="text-primary" />
                    </View>
                    <View>
                      <Text className="font-semibold text-foreground text-lg">
                        {selectedUser.name}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {selectedUser.email}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row flex-wrap gap-3">
                    <View className="flex-1 min-w-[45%] p-3 rounded-lg bg-secondary">
                      <Text className="text-xs text-muted-foreground">
                        Phone
                      </Text>
                      <Text className="font-medium text-foreground">
                        {selectedUser.phone}
                      </Text>
                    </View>
                    <View className="flex-1 min-w-[45%] p-3 rounded-lg bg-secondary">
                      <Text className="text-xs text-muted-foreground">
                        Status
                      </Text>
                      <Text
                        className={`font-medium ${
                          selectedUser.status === "active"
                            ? "text-green-500"
                            : "text-destructive"
                        }`}
                      >
                        {selectedUser.status}
                      </Text>
                    </View>
                    <View className="flex-1 min-w-[45%] p-3 rounded-lg bg-secondary">
                      <Text className="text-xs text-muted-foreground">
                        Registered
                      </Text>
                      <Text className="font-medium text-foreground">
                        {selectedUser.registeredDate}
                      </Text>
                    </View>
                    <View className="flex-1 min-w-[45%] p-3 rounded-lg bg-secondary">
                      <Text className="text-xs text-muted-foreground">
                        Total Bookings
                      </Text>
                      <Text className="font-medium text-foreground">
                        {selectedUser.bookingCount}
                      </Text>
                    </View>
                  </View>

                  <Button
                    className="w-full mt-2"
                    variant={
                      selectedUser.status === "active"
                        ? "destructive"
                        : "default"
                    }
                    onPress={() => {
                      toggleUserStatus(selectedUser.id);
                    }}
                  >
                    <Text
                      className={
                        selectedUser.status === "active"
                          ? "text-destructive-foreground"
                          : "text-primary-foreground"
                      }
                    >
                      {selectedUser.status === "active"
                        ? "Deactivate User"
                        : "Activate User"}
                    </Text>
                  </Button>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
