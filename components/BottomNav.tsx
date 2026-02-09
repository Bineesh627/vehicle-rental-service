import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const BottomNav = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <View style={styles.navInner}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const Icon = options.tabBarIcon;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.navItem}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  isFocused && styles.activeIconContainer,
                ]}
              >
                {Icon &&
                  Icon({
                    focused: isFocused,
                    color: isFocused ? "#FFFFFF" : "#6b7280",
                    size: 20,
                  })}
              </View>
              <Text
                style={[
                  styles.label,
                  isFocused ? styles.activeLabel : styles.inactiveLabel,
                ]}
              >
                {label as string}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)", // bg-card/95
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb", // border-border
  },
  navInner: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
  },
  navItem: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12, // rounded-xl
  },
  activeIconContainer: {
    backgroundColor: "#3b82f6", // Your primary color
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
  activeLabel: {
    color: "#3b82f6", // text-primary
  },
  inactiveLabel: {
    color: "#6b7280", // text-muted-foreground
  },
});
