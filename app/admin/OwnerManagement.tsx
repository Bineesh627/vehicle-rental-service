import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockShopOwners, ShopOwner } from "@/data/adminMockData";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Ban,
  CheckCircle,
  Eye,
  MoreVertical,
  Search,
  Store,
  Unlock,
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

export default function OwnerManagement() {
  const router = useRouter();
  const [owners, setOwners] = useState<ShopOwner[]>(mockShopOwners);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOwner, setSelectedOwner] = useState<ShopOwner | null>(null);
  const [showOwnerDetails, setShowOwnerDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [ownerForActions, setOwnerForActions] = useState<ShopOwner | null>(
    null,
  );

  const filteredOwners = owners.filter((owner) => {
    const matchesSearch =
      owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && owner.status === activeTab;
  });

  const approveOwner = (ownerId: string) => {
    setOwners((prev) =>
      prev.map((owner) =>
        owner.id === ownerId ? { ...owner, status: "approved" } : owner,
      ),
    );
    const owner = owners.find((o) => o.id === ownerId);
    Toast.show({
      type: "success",
      text1: "Owner Approved",
      text2: `${owner?.name} has been approved successfully.`,
    });
    setOwnerForActions(null);
  };

  const rejectOwner = (ownerId: string) => {
    setOwners((prev) => prev.filter((owner) => owner.id !== ownerId));
    Toast.show({
      type: "error",
      text1: "Owner Rejected",
      text2: "The owner application has been rejected.",
    });
    setOwnerForActions(null);
  };

  const toggleBlockStatus = (ownerId: string) => {
    setOwners((prev) =>
      prev.map((owner) =>
        owner.id === ownerId
          ? {
              ...owner,
              status: owner.status === "blocked" ? "approved" : "blocked",
            }
          : owner,
      ),
    );
    const owner = owners.find((o) => o.id === ownerId);
    const isBlocked = owner?.status === "blocked"; // This is pre-toggle state

    // Determine new state for message
    const newState = isBlocked ? "approved" : "blocked";

    Toast.show({
      type: newState === "blocked" ? "error" : "success",
      text1: newState === "blocked" ? "Owner Blocked" : "Owner Unblocked",
      text2: `${owner?.name} has been ${newState === "blocked" ? "blocked" : "unblocked"}.`,
    });
    setOwnerForActions(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500";
      case "pending":
        return "bg-orange-500/10 text-orange-500";
      case "blocked":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-500";
      case "pending":
        return "text-orange-500";
      case "blocked":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const tabs = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "blocked", label: "Blocked" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background pt-8">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="border-b border-border bg-card/95 px-4 py-3 flex-row items-center gap-3">
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <ArrowLeft className="text-foreground" size={24} />
          </Button>
          <Text className="text-lg font-bold text-foreground">
            Owner Management
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
              placeholder="Search owners..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="pl-10 text-foreground"
            />
          </View>

          {/* Custom Tabs */}
          <View className="flex-row bg-muted rounded-lg p-1 mb-4">
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`flex-1 items-center justify-center py-2 rounded-md ${
                  activeTab === tab.id
                    ? "bg-background shadow-sm"
                    : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    activeTab === tab.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Owners List */}
          <View className="gap-3">
            {filteredOwners.length === 0 ? (
              <Card className="border-border">
                <CardContent className="p-8 items-center">
                  <Store size={48} className="text-muted-foreground mb-3" />
                  <Text className="text-muted-foreground">No owners found</Text>
                </CardContent>
              </Card>
            ) : (
              filteredOwners.map((owner) => (
                <Card key={owner.id} className="border-border bg-card">
                  <CardContent className="p-4">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-3 flex-1">
                        <View className="h-10 w-10 rounded-full bg-purple-500/10 items-center justify-center">
                          <Store size={20} className="text-purple-500" />
                        </View>
                        <View className="flex-1">
                          <Text className="font-medium text-foreground">
                            {owner.name}
                          </Text>
                          <Text className="text-xs text-muted-foreground">
                            {owner.email}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <View
                          className={`px-2 py-1 rounded-full ${getStatusColor(owner.status)}`}
                        >
                          <Text
                            className={`text-xs ${getStatusTextColor(owner.status)}`}
                          >
                            {owner.status}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => setOwnerForActions(owner)}
                          className="h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
                        >
                          <MoreVertical
                            size={16}
                            className="text-muted-foreground"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Quick inline actions for pending owners */}
                    {owner.status === "pending" && (
                      <View className="flex-row gap-2 mt-3">
                        <Button
                          size="sm"
                          className="flex-1 flex-row items-center justify-center gap-1"
                          onPress={() => approveOwner(owner.id)}
                        >
                          <CheckCircle
                            size={16}
                            className="text-primary-foreground"
                          />
                          <Text className="text-primary-foreground text-xs">
                            Approve
                          </Text>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1 flex-row items-center justify-center gap-1"
                          onPress={() => rejectOwner(owner.id)}
                        >
                          <XCircle
                            size={16}
                            className="text-destructive-foreground"
                          />
                          <Text className="text-destructive-foreground text-xs">
                            Reject
                          </Text>
                        </Button>
                      </View>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </View>
        </ScrollView>

        {/* Action Menu Modal */}
        <Modal
          visible={!!ownerForActions}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setOwnerForActions(null)}
        >
          <TouchableOpacity
            className="flex-1 bg-black/60 items-center justify-center p-4"
            activeOpacity={1}
            onPress={() => setOwnerForActions(null)}
          >
            <View className="bg-card w-full max-w-sm rounded-xl overflow-hidden p-2 shadow-lg">
              <Text className="text-sm font-semibold text-muted-foreground p-2 text-center border-b border-border">
                Actions for {ownerForActions?.name}
              </Text>

              <TouchableOpacity
                className="flex-row items-center p-4 active:bg-secondary rounded-lg"
                onPress={() => {
                  if (ownerForActions) {
                    setSelectedOwner(ownerForActions);
                    setShowOwnerDetails(true);
                  }
                  setOwnerForActions(null);
                }}
              >
                <Eye size={18} className="text-foreground mr-3" />
                <Text className="text-foreground">View Details</Text>
              </TouchableOpacity>

              {ownerForActions?.status === "pending" && (
                <>
                  <TouchableOpacity
                    className="flex-row items-center p-4 active:bg-secondary rounded-lg"
                    onPress={() =>
                      ownerForActions && approveOwner(ownerForActions.id)
                    }
                  >
                    <CheckCircle size={18} className="text-green-500 mr-3" />
                    <Text className="text-green-500">Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-row items-center p-4 active:bg-secondary rounded-lg"
                    onPress={() =>
                      ownerForActions && rejectOwner(ownerForActions.id)
                    }
                  >
                    <XCircle size={18} className="text-destructive mr-3" />
                    <Text className="text-destructive">Reject</Text>
                  </TouchableOpacity>
                </>
              )}

              {ownerForActions?.status === "approved" && (
                <TouchableOpacity
                  className="flex-row items-center p-4 active:bg-secondary rounded-lg"
                  onPress={() =>
                    ownerForActions && toggleBlockStatus(ownerForActions.id)
                  }
                >
                  <Ban size={18} className="text-destructive mr-3" />
                  <Text className="text-destructive">Block</Text>
                </TouchableOpacity>
              )}

              {ownerForActions?.status === "blocked" && (
                <TouchableOpacity
                  className="flex-row items-center p-4 active:bg-secondary rounded-lg"
                  onPress={() =>
                    ownerForActions && toggleBlockStatus(ownerForActions.id)
                  }
                >
                  <Unlock size={18} className="text-green-500 mr-3" />
                  <Text className="text-green-500">Unblock</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Owner Details Modal */}
        <Modal
          visible={showOwnerDetails}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowOwnerDetails(false)}
        >
          <View className="flex-1 justify-end bg-black/60">
            <View
              className={`bg-background rounded-t-3xl ${Platform.OS === "ios" ? "pb-8" : "pb-4"}`}
            >
              <View className="flex-row items-center justify-between p-4 border-b border-border">
                <Text className="text-lg font-bold text-foreground">
                  Owner Details
                </Text>
                <TouchableOpacity
                  onPress={() => setShowOwnerDetails(false)}
                  className="p-2"
                >
                  <X size={24} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>

              {selectedOwner && (
                <View className="p-4 gap-4">
                  <View className="flex-row items-center gap-3">
                    <View className="h-16 w-16 rounded-full bg-purple-500/10 items-center justify-center">
                      <Store size={32} className="text-purple-500" />
                    </View>
                    <View>
                      <Text className="font-semibold text-foreground text-lg">
                        {selectedOwner.name}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {selectedOwner.email}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row flex-wrap gap-3">
                    <View className="flex-1 min-w-[45%] p-3 rounded-lg bg-secondary">
                      <Text className="text-xs text-muted-foreground">
                        Phone
                      </Text>
                      <Text className="font-medium text-foreground">
                        {selectedOwner.phone}
                      </Text>
                    </View>
                    <View className="flex-1 min-w-[45%] p-3 rounded-lg bg-secondary">
                      <Text className="text-xs text-muted-foreground">
                        Status
                      </Text>
                      <Text
                        className={`font-medium ${getStatusTextColor(selectedOwner.status)}`}
                      >
                        {selectedOwner.status}
                      </Text>
                    </View>
                    <View className="flex-1 min-w-[45%] p-3 rounded-lg bg-secondary">
                      <Text className="text-xs text-muted-foreground">
                        Shops
                      </Text>
                      <Text className="font-medium text-foreground">
                        {selectedOwner.shopCount}
                      </Text>
                    </View>
                    <View className="flex-1 min-w-[45%] p-3 rounded-lg bg-secondary">
                      <Text className="text-xs text-muted-foreground">
                        Revenue
                      </Text>
                      <Text className="font-medium text-foreground">
                        ${selectedOwner.totalRevenue.toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  <View className="p-3 rounded-lg bg-secondary">
                    <Text className="text-xs text-muted-foreground">
                      Applied Date
                    </Text>
                    <Text className="font-medium text-foreground">
                      {selectedOwner.appliedDate}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
