import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Navigation,
  Package,
  Phone,
  Truck,
  User,
  X,
} from "lucide-react-native";
import { useState } from "react";
import {
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

interface StaffTask {
  id: string;
  type: "delivery" | "pickup";
  vehicleName: string;
  customerName: string;
  customerPhone: string;
  address: string;
  scheduledTime: string;
  status: "pending" | "in_progress" | "completed";
  notes?: string;
}

const mockTasks: StaffTask[] = [
  {
    id: "t1",
    type: "delivery",
    vehicleName: "Toyota Camry",
    customerName: "John Davis",
    customerPhone: "+1 555-1234",
    address: "123 Main St, Downtown, Building A, Apt 4B",
    scheduledTime: "10:00 AM",
    status: "pending",
    notes: "Customer requested call before arrival",
  },
  {
    id: "t2",
    type: "delivery",
    vehicleName: "Honda Activa",
    customerName: "Sarah Miller",
    customerPhone: "+1 555-5678",
    address: "456 Oak Ave, Midtown Business Center",
    scheduledTime: "11:30 AM",
    status: "in_progress",
  },
  {
    id: "t3",
    type: "pickup",
    vehicleName: "BMW 3 Series",
    customerName: "Mike Ross",
    customerPhone: "+1 555-9012",
    address: "789 Luxury Lane, Uptown Hotel Lobby",
    scheduledTime: "2:00 PM",
    status: "pending",
    notes: "Vehicle parked in guest parking lot",
  },
  {
    id: "t4",
    type: "pickup",
    vehicleName: "Royal Enfield Classic",
    customerName: "Emily Chen",
    customerPhone: "+1 555-3456",
    address: "321 Green Street, Eco District",
    scheduledTime: "4:00 PM",
    status: "pending",
  },
];

export default function AssignedTasks() {
  const router = useRouter();
  const [tasks, setTasks] = useState<StaffTask[]>(mockTasks);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTask, setSelectedTask] = useState<StaffTask | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return task.status !== "completed";
    if (activeTab === "delivery")
      return task.type === "delivery" && task.status !== "completed";
    if (activeTab === "pickup")
      return task.type === "pickup" && task.status !== "completed";
    if (activeTab === "completed") return task.status === "completed";
    return true;
  });

  const startTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "in_progress" } : t)),
    );
    Toast.show({
      type: "success",
      text1: "Task Started",
      text2: "You've started this task. Navigate to the location.",
    });
  };

  const completeTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "completed" } : t)),
    );
    const task = tasks.find((t) => t.id === taskId);
    Toast.show({
      type: "success",
      text1:
        task?.type === "delivery" ? "Vehicle Delivered" : "Vehicle Picked Up",
      text2: "Task completed successfully!",
    });
    setShowCompleteDialog(false);
    setShowTaskDetails(false);
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
    Toast.show({
      type: "info",
      text1: "Calling Customer",
      text2: `Dialing ${phone}...`,
    });
  };

  const handleNavigate = (address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address,
    )}`;
    Linking.openURL(url);
    Toast.show({
      type: "info",
      text1: "Opening Navigation",
      text2: `Navigating to ${address}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-primary/10 text-primary";
      case "completed":
        return "bg-green-500/10 text-green-500";
      default:
        return "bg-orange-500/10 text-orange-500";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background pt-8">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="border-b border-border bg-card/95 px-4 py-3 flex-row items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onPress={() => router.push("/staff/StaffDashboard")}
          >
            <ArrowLeft size={20} className="text-foreground" />
          </Button>
          <Text className="text-lg font-bold text-foreground">
            Assigned Tasks
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-4 py-6"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Stats */}
          <View className="flex-row gap-2 mb-6">
            <Card className="border-border flex-1 border min-w-[22%]">
              <CardContent className="p-3 items-center">
                <Text className="text-lg font-bold text-foreground">
                  {tasks.filter((t) => t.status !== "completed").length}
                </Text>
                <Text className="text-xs text-muted-foreground">Pending</Text>
              </CardContent>
            </Card>
            <Card className="border-border flex-1 border min-w-[22%]">
              <CardContent className="p-3 items-center">
                <Text className="text-lg font-bold text-primary">
                  {tasks.filter((t) => t.status === "in_progress").length}
                </Text>
                <Text className="text-xs text-muted-foreground">Active</Text>
              </CardContent>
            </Card>
            <Card className="border-border flex-1 border min-w-[22%]">
              <CardContent className="p-3 items-center">
                <Text className="text-lg font-bold text-foreground">
                  {
                    tasks.filter(
                      (t) => t.type === "delivery" && t.status !== "completed",
                    ).length
                  }
                </Text>
                <Text className="text-xs text-muted-foreground">
                  Deliveries
                </Text>
              </CardContent>
            </Card>
            <Card className="border-border flex-1 border min-w-[22%]">
              <CardContent className="p-3 items-center">
                <Text className="text-lg font-bold text-foreground">
                  {
                    tasks.filter(
                      (t) => t.type === "pickup" && t.status !== "completed",
                    ).length
                  }
                </Text>
                <Text className="text-xs text-muted-foreground">Pickups</Text>
              </CardContent>
            </Card>
          </View>

          {/* Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
            contentContainerStyle={{ gap: 8 }}
          >
            {["all", "delivery", "pickup", "completed"].map((tab) => (
              <TouchableOpacity
                key={tab}
                className={`px-4 py-2 rounded-full border ${
                  activeTab === tab
                    ? "bg-primary border-primary"
                    : "bg-background border-border"
                }`}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  className={`text-sm capitalize ${
                    activeTab === tab
                      ? "text-primary-foreground font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {tab === "completed" ? "Done" : tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Tasks List */}
          <View className="gap-3">
            {filteredTasks.length === 0 ? (
              <Card className="border-border">
                <CardContent className="p-8 items-center">
                  <CheckCircle size={48} className="text-green-500 mb-3" />
                  <Text className="text-muted-foreground">
                    {activeTab === "completed"
                      ? "No completed tasks yet"
                      : "No pending tasks"}
                  </Text>
                </CardContent>
              </Card>
            ) : (
              filteredTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  activeOpacity={0.9}
                  onPress={() => {
                    setSelectedTask(task);
                    setShowTaskDetails(true);
                  }}
                >
                  <Card className="border-border">
                    <CardContent className="p-4 gap-3">
                      <View className="flex-row items-start justify-between">
                        <View className="flex-row items-center gap-2">
                          <View
                            className={`h-8 w-8 rounded-full items-center justify-center ${
                              task.type === "delivery"
                                ? "bg-primary/10"
                                : "bg-orange-500/10"
                            }`}
                          >
                            {task.type === "delivery" ? (
                              <Truck
                                size={16}
                                className={
                                  task.type === "delivery"
                                    ? "text-primary"
                                    : "text-orange-500"
                                }
                              />
                            ) : (
                              <Package size={16} className="text-orange-500" />
                            )}
                          </View>
                          <View>
                            <Text className="text-xs font-medium text-muted-foreground uppercase">
                              {task.type}
                            </Text>
                            <Text className="font-medium text-foreground">
                              {task.vehicleName}
                            </Text>
                          </View>
                        </View>
                        <View className="items-end">
                          <View
                            className={`px-2 py-0.5 rounded-full ${getStatusColor(
                              task.status,
                            )}`}
                          >
                            <Text
                              className={`text-xs capitalize ${
                                getStatusColor(task.status).split(" ")[1]
                              }`}
                            >
                              {task.status.replace("_", " ")}
                            </Text>
                          </View>
                          <View className="flex-row items-center gap-1 mt-1">
                            <Clock
                              size={12}
                              className="text-muted-foreground"
                            />
                            <Text className="text-xs text-muted-foreground">
                              {task.scheduledTime}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View className="gap-2">
                        <View className="flex-row items-center gap-2">
                          <User size={16} className="text-muted-foreground" />
                          <Text className="text-sm text-foreground">
                            {task.customerName}
                          </Text>
                        </View>
                        <View className="flex-row items-start gap-2">
                          <MapPin
                            size={16}
                            className="text-muted-foreground mt-0.5"
                          />
                          <Text className="text-sm text-muted-foreground flex-1">
                            {task.address}
                          </Text>
                        </View>
                      </View>

                      {task.status !== "completed" && (
                        <View className="flex-row gap-2 mt-2 pt-3 border-t border-border">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 flex-row gap-1"
                            onPress={() => handleCall(task.customerPhone)}
                          >
                            <Phone size={14} className="text-foreground" />
                            <Text className="text-foreground text-xs">
                              Call
                            </Text>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 flex-row gap-1"
                            onPress={() => handleNavigate(task.address)}
                          >
                            <Navigation size={14} className="text-foreground" />
                            <Text className="text-foreground text-xs">
                              Navigate
                            </Text>
                          </Button>
                          {task.status === "pending" ? (
                            <Button
                              size="sm"
                              className="flex-1"
                              onPress={() => startTask(task.id)}
                            >
                              <Text className="text-primary-foreground text-xs font-semibold">
                                Start
                              </Text>
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="flex-1"
                              onPress={() => {
                                setSelectedTask(task);
                                setShowCompleteDialog(true);
                              }}
                            >
                              <Text className="text-primary-foreground text-xs font-semibold">
                                {task.type === "delivery"
                                  ? "Delivered"
                                  : "Picked Up"}
                              </Text>
                            </Button>
                          )}
                        </View>
                      )}
                    </CardContent>
                  </Card>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>

        {/* Task Details Modal */}
        <Modal
          visible={showTaskDetails}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTaskDetails(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <View className="bg-background w-full max-w-sm rounded-xl p-4 gap-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-foreground">
                  Task Details
                </Text>
                <TouchableOpacity onPress={() => setShowTaskDetails(false)}>
                  <X size={24} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>

              {selectedTask && (
                <View className="gap-4">
                  <View className="flex-row items-center justify-between p-3 rounded-lg bg-secondary">
                    <View className="flex-row items-center gap-2">
                      {selectedTask.type === "delivery" ? (
                        <Truck size={20} className="text-primary" />
                      ) : (
                        <Package size={20} className="text-orange-500" />
                      )}
                      <View>
                        <Text className="font-medium text-foreground">
                          {selectedTask.vehicleName}
                        </Text>
                        <Text className="text-xs text-muted-foreground capitalize">
                          {selectedTask.type}
                        </Text>
                      </View>
                    </View>
                    <View
                      className={`px-2 py-1 rounded-full ${getStatusColor(
                        selectedTask.status,
                      )}`}
                    >
                      <Text
                        className={`text-xs capitalize ${
                          getStatusColor(selectedTask.status).split(" ")[1]
                        }`}
                      >
                        {selectedTask.status.replace("_", " ")}
                      </Text>
                    </View>
                  </View>

                  <View className="p-3 rounded-lg bg-secondary gap-1">
                    <Text className="text-xs text-muted-foreground">
                      Customer
                    </Text>
                    <Text className="font-medium text-foreground">
                      {selectedTask.customerName}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      {selectedTask.customerPhone}
                    </Text>
                  </View>

                  <View className="p-3 rounded-lg bg-secondary gap-1">
                    <Text className="text-xs text-muted-foreground">
                      Location
                    </Text>
                    <View className="flex-row items-start gap-2">
                      <MapPin
                        size={16}
                        className="text-muted-foreground mt-0.5"
                      />
                      <Text className="text-sm text-foreground flex-1">
                        {selectedTask.address}
                      </Text>
                    </View>
                  </View>

                  <View className="p-3 rounded-lg bg-secondary gap-1">
                    <Text className="text-xs text-muted-foreground">
                      Scheduled Time
                    </Text>
                    <Text className="font-medium text-foreground">
                      {selectedTask.scheduledTime}
                    </Text>
                  </View>

                  {selectedTask.notes && (
                    <View className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <Text className="text-xs font-medium text-orange-500 mb-1">
                        Notes
                      </Text>
                      <Text className="text-sm text-foreground">
                        {selectedTask.notes}
                      </Text>
                    </View>
                  )}

                  {selectedTask.status !== "completed" && (
                    <View className="flex-row gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 flex-row gap-1"
                        onPress={() => handleCall(selectedTask.customerPhone)}
                      >
                        <Phone size={16} className="text-foreground" />
                        <Text className="text-foreground">Call</Text>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 flex-row gap-1"
                        onPress={() => handleNavigate(selectedTask.address)}
                      >
                        <Navigation size={16} className="text-foreground" />
                        <Text className="text-foreground">Navigate</Text>
                      </Button>
                    </View>
                  )}

                  {selectedTask.status === "pending" && (
                    <Button
                      className="w-full"
                      onPress={() => startTask(selectedTask.id)}
                    >
                      <Text className="text-primary-foreground font-semibold">
                        Start Task
                      </Text>
                    </Button>
                  )}

                  {selectedTask.status === "in_progress" && (
                    <Button
                      className="w-full flex-row gap-2"
                      onPress={() => {
                        setShowTaskDetails(false);
                        setShowCompleteDialog(true);
                      }}
                    >
                      <CheckCircle
                        size={16}
                        className="text-primary-foreground"
                      />
                      <Text className="text-primary-foreground font-semibold">
                        Mark as{" "}
                        {selectedTask.type === "delivery"
                          ? "Delivered"
                          : "Picked Up"}
                      </Text>
                    </Button>
                  )}
                </View>
              )}
            </View>
          </View>
        </Modal>

        {/* Complete Task Confirmation Modal */}
        <Modal
          visible={showCompleteDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCompleteDialog(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <View className="bg-background w-full max-w-sm rounded-xl p-6 gap-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-foreground">
                  Confirm Completion
                </Text>
              </View>

              {selectedTask && (
                <View className="gap-4">
                  <Text className="text-muted-foreground">
                    Are you sure you want to mark this {selectedTask.type} as
                    completed?
                  </Text>
                  <View className="p-3 rounded-lg bg-secondary">
                    <Text className="font-medium text-foreground">
                      {selectedTask.vehicleName}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      {selectedTask.customerName}
                    </Text>
                  </View>
                </View>
              )}

              <View className="flex-row gap-2 mt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onPress={() => setShowCompleteDialog(false)}
                >
                  <Text className="text-foreground">Cancel</Text>
                </Button>
                <Button
                  className="flex-1 flex-row gap-2"
                  onPress={() => selectedTask && completeTask(selectedTask.id)}
                >
                  <CheckCircle size={16} className="text-primary-foreground" />
                  <Text className="text-primary-foreground font-semibold">
                    Confirm
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
