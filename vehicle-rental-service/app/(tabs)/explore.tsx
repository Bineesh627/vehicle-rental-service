import { api } from "@/services/api";
import { RentalShop } from "@/types";
import { UserStackParamList } from "@/navigation/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Search,
  Store,
  WifiOff,
  MapPin,
  Star,
  ChevronRight,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ExploreNavigationProp = NativeStackNavigationProp<UserStackParamList>;

export default function ShopSearch() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ExploreNavigationProp>();

  const [query, setQuery] = useState("");
  const [shops, setShops] = useState<RentalShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchShops = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getRentalShops(searchTerm);
      setShops(data);
    } catch (e: any) {
      setError("Could not load shops. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  const handleQueryChange = (text: string) => {
    setQuery(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchShops(text.trim());
    }, 400);
  };

  const handleClear = () => {
    setQuery("");
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    fetchShops("");
  };

  const openShop = (id: string) => {
    navigation.navigate("ShopDetails", { id });
  };

  const isSearching = query.trim().length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find a Shop</Text>
        <View style={styles.searchBar}>
          <Search size={18} color="#64748b" />
          <TextInput
            placeholder="Search shops by name or area..."
            placeholderTextColor="#475569"
            value={query}
            onChangeText={handleQueryChange}
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Idle — no query typed yet */}
        {!isSearching && (
          <View style={styles.centerContainer}>
            <View style={styles.iconCircle}>
              <Search size={36} color="#334155" />
            </View>
            <Text style={styles.idleTitle}>Search for a shop</Text>
            <Text style={styles.idleSubtext}>
              Type a shop name or area above to find results.
            </Text>
          </View>
        )}

        {/* Loading */}
        {isSearching && loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#2dd4bf" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        )}

        {/* Error */}
        {isSearching && !loading && error && (
          <View style={styles.centerContainer}>
            <View style={styles.iconCircle}>
              <WifiOff size={40} color="#64748b" />
            </View>
            <Text style={styles.errorTitle}>Connection Error</Text>
            <Text style={styles.errorSubtext}>{error}</Text>
            <TouchableOpacity
              onPress={() => fetchShops(query.trim())}
              style={styles.retryButton}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Results */}
        {isSearching && !loading && !error && (
          <>
            {/* Result count */}
            <Text style={styles.resultCount}>
              {shops.length} {shops.length === 1 ? "shop" : "shops"} found for "
              {query.trim()}"
            </Text>

            {shops.length > 0 ? (
              shops.map((shop, index) => (
                <TouchableOpacity
                  key={shop.id}
                  style={[
                    styles.listRow,
                    index === shops.length - 1 && styles.listRowLast,
                  ]}
                  onPress={() => openShop(shop.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.listRowLeft}>
                    <View style={styles.listIconCircle}>
                      <Store size={20} color="#2dd4bf" />
                    </View>
                    <View style={styles.listRowText}>
                      <Text style={styles.listShopName}>{shop.name}</Text>
                      <View style={styles.listMeta}>
                        <MapPin size={12} color="#64748b" />
                        <Text style={styles.listMetaText}>
                          {shop.distance} km away
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.listRowRight}>
                    <View style={styles.listRating}>
                      <Star size={11} color="#eab308" fill="#eab308" />
                      <Text style={styles.listRatingText}>{shop.rating}</Text>
                    </View>
                    <View
                      style={[
                        styles.listBadge,
                        shop.isOpen
                          ? styles.listBadgeOpen
                          : styles.listBadgeClosed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.listBadgeText,
                          shop.isOpen
                            ? styles.listBadgeTextOpen
                            : styles.listBadgeTextClosed,
                        ]}
                      >
                        {shop.isOpen ? "Open" : "Closed"}
                      </Text>
                    </View>
                    <ChevronRight size={16} color="#334155" />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              /* Empty state for search */
              <View style={styles.centerContainer}>
                <View style={styles.iconCircle}>
                  <Store size={40} color="#64748b" />
                </View>
                <Text style={styles.errorTitle}>No shops found</Text>
                <Text style={styles.errorSubtext}>
                  Try a different name or area.
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
    backgroundColor: "#0f172a",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 14,
  },
  clearText: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "500",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  centerContainer: {
    alignItems: "center",
    paddingVertical: 64,
  },
  iconCircle: {
    borderRadius: 9999,
    backgroundColor: "#1e293b",
    padding: 20,
    marginBottom: 16,
  },
  loadingText: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 12,
  },
  idleTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
  },
  idleSubtext: {
    fontSize: 14,
    color: "#334155",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 6,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    paddingHorizontal: 32,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#334155",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  resultCount: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 8,
  },

  /* List row */
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  listRowLast: {
    borderBottomWidth: 0,
  },
  listRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  listIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  listRowText: {
    flex: 1,
  },
  listShopName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 3,
  },
  listMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  listMetaText: {
    fontSize: 12,
    color: "#64748b",
  },
  listRowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  listRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  listRatingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8",
  },
  listBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  listBadgeOpen: {
    backgroundColor: "rgba(74, 222, 128, 0.1)",
  },
  listBadgeClosed: {
    backgroundColor: "rgba(248, 113, 113, 0.1)",
  },
  listBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  listBadgeTextOpen: {
    color: "#4ade80",
  },
  listBadgeTextClosed: {
    color: "#f87171",
  },
});
