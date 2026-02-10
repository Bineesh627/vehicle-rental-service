import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { Calendar, Home, Search, User } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const BottomNav = (props: Partial<BottomTabBarProps>) => {
  const nativeNavigation = useNavigation();
  const { state, descriptors, insets, navigation } = props;

  // Map route names to Icons and Labels
  // Expo Router default routes: "index", "explore", "bookings", "profile" for (tabs)
  const getRouteConfig = (routeName: string) => {
    switch (routeName) {
      case "index":
      case "Home": // Fallback for manual nav
        return { icon: Home, label: "Home" };
      case "explore":
      case "Explore":
        return { icon: Search, label: "Explore" };
      case "bookings":
      case "Bookings":
        return { icon: Calendar, label: "Bookings" };
      case "profile":
        return { icon: User, label: "profile" };
      default:
        return { icon: Home, label: "Home" };
    }
  };

  // Standalone mode (when used in VehicleDetails)
  if (!state) {
    const navItems = [
      { name: "index", label: "Home", icon: Home },
      { name: "explore", label: "Explore", icon: Search },
      { name: "bookings", label: "Bookings", icon: Calendar },
      { name: "profile", label: "Profile", icon: User },
    ];

    return (
      <View style={styles.navContainer}>
        <View style={styles.navContent}>
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              onPress={() => {
                // Navigate to the tab screen
                // We assume these are under the 'Tabs' group or accessible via root
                // Using "navigate" with the hierarchical path might be safest if using global nav
                // But simple strings often work if configured in strict typed stack
                nativeNavigation.navigate(item.name as never);
              }}
              style={styles.navItem}
              activeOpacity={0.8}
            >
              <View style={styles.iconWrapper}>
                <item.icon size={24} color="#94a3b8" />
              </View>
              <Text style={[styles.label, styles.labelInactive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  // TabBar mode (inside Tabs)
  return (
    <View style={styles.navContainer}>
      <View style={styles.navContent}>
        {state.routes.map((route, index) => {
          const { options } = descriptors![route.key];
          const config = getRouteConfig(route.name);
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation!.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation!.dispatch(
                CommonActions.navigate({
                  name: route.name,
                  merge: true,
                }),
              );
            }
          };

          const onLongPress = () => {
            navigation!.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.navItem}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.iconWrapper,
                  isFocused && styles.iconWrapperActive,
                ]}
              >
                <config.icon
                  size={24}
                  color={isFocused ? "#0f172a" : "#94a3b8"}
                  strokeWidth={isFocused ? 2.5 : 2}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  isFocused ? styles.labelActive : styles.labelInactive,
                ]}
              >
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: "#0f172a", // Dark background
    borderTopWidth: 1,
    borderTopColor: "#1e293b", // Slightly lighter border
    paddingBottom: 20,
    paddingTop: 12,
  },
  navContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  navItem: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 50, // Circular
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
  },
  iconWrapperActive: {
    backgroundColor: "#22d3ee", // Cyan-400
    shadowColor: "#22d3ee",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  labelActive: { color: "#22d3ee" }, // Cyan-400
  labelInactive: { color: "#94a3b8" }, // Slate-400
});
