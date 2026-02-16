import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Car, Bike } from "lucide-react-native";

type FilterType = "all" | "car" | "bike";

interface VehicleFilterProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const VehicleFilter = ({ activeFilter, onFilterChange }: VehicleFilterProps) => {
  const filters: { type: FilterType; label: string; icon: React.ReactNode }[] = [
    { type: "all", label: "All", icon: null },
    { type: "car", label: "Cars", icon: <Car size={16} color={activeFilter === 'car' ? '#fff' : '#64748b'} /> },
    { type: "bike", label: "Bikes", icon: <Bike size={16} color={activeFilter === 'bike' ? '#fff' : '#64748b'} /> },
  ];

  return (
    <View style={styles.container}>
      {filters.map((filter) => {
        const isActive = activeFilter === filter.type;
        return (
          <TouchableOpacity
            key={filter.type}
            onPress={() => onFilterChange(filter.type)}
            style={[
              styles.button,
              isActive ? styles.buttonActive : styles.buttonInactive
            ]}
          >
            {filter.icon && <View style={styles.iconContainer}>{filter.icon}</View>}
            <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  buttonActive: {
    backgroundColor: "#0f172a", // gradient-primary
    shadowColor: "#0f172a",
    shadowOpacity: 0.3,
    elevation: 4,
  },
  buttonInactive: {
    backgroundColor: "#ffffff", // bg-card
    shadowColor: "#000",
    shadowOpacity: 0.05,
    elevation: 1,
  },
  iconContainer: {
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  labelActive: {
    color: "#ffffff",
  },
  labelInactive: {
    color: "#64748b",
  },
});