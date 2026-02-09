import React from "react";
import { ScrollView, TouchableOpacity, Text, View } from "react-native";
import { Car, Bike } from "lucide-react-native";
import { cn } from "@/lib/utils";

type FilterType = "all" | "car" | "bike";

interface VehicleFilterProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const VehicleFilter = ({
  activeFilter,
  onFilterChange,
}: VehicleFilterProps) => {
  const filters: { type: FilterType; label: string; icon: React.ReactNode }[] =
    [
      { type: "all", label: "All", icon: null },
      {
        type: "car",
        label: "Cars",
        icon: (
          <Car color={activeFilter === "car" ? "white" : "gray"} size={16} />
        ),
      },
      {
        type: "bike",
        label: "Bikes",
        icon: (
          <Bike color={activeFilter === "bike" ? "white" : "gray"} size={16} />
        ),
      },
    ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter.type;
        return (
          <TouchableOpacity
            key={filter.type}
            onPress={() => onFilterChange(filter.type)}
            className={cn(
              "flex-row items-center gap-2 rounded-xl px-4 py-2.5",
              isActive ? "bg-primary shadow-sm" : "bg-card shadow-sm",
            )}
          >
            {filter.icon && <View>{filter.icon}</View>}
            <Text
              className={cn(
                "text-sm font-medium",
                isActive ? "text-primary-foreground" : "text-muted-foreground",
              )}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
