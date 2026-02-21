import { chatApi, ChatConversation } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { ArrowLeft, MessageSquare, Search } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const POLL_INTERVAL_MS = 8000; // re-check every 8 s for new badges

export default function ChatList() {
  const router = useRouter();
  const { user } = useAuth();

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Core fetch (silent = no full-screen spinner, just updates data) ─────────
  const fetchConversations = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (!token) {
        setError("You must be logged in to view chats.");
        return;
      }
      const data = await chatApi.getConversations(token);
      setConversations(data);
      setError(null);
    } catch (e) {
      console.error("Failed to load conversations:", e);
      if (!silent)
        setError("Could not load conversations. Is the server running?");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ── Re-fetch every time the screen comes into focus ─────────────────────────
  // This is the key fix: when the user opens a chat, messages are marked read
  // on the backend. When they come back here, useFocusEffect fires again and
  // re-fetches — so unread counts are updated instantly.
  useFocusEffect(
    useCallback(() => {
      fetchConversations(false);

      // Poll while the screen is focused
      pollRef.current = setInterval(
        () => fetchConversations(true),
        POLL_INTERVAL_MS,
      );

      // Stop polling when the screen loses focus (e.g., user enters a chat)
      return () => {
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      };
    }, [fetchConversations]),
  );

  // ── Pull-to-refresh ─────────────────────────────────────────────────────────
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchConversations(false);
  }, [fetchConversations]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-[#0F1C23]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#0F1C23]">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Chats</Text>
        </View>
        <TouchableOpacity className="p-2">
          <Search color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </View>

      {/* Body */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#22d3ee" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-slate-400 text-center">{error}</Text>
          <TouchableOpacity
            onPress={() => fetchConversations(false)}
            className="mt-4 bg-cyan-500 px-6 py-3 rounded-full"
          >
            <Text className="text-slate-900 font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : conversations.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <MessageSquare color="#475569" size={48} />
          <Text className="text-slate-400 text-center mt-4 text-base">
            No conversations yet.{"\n"}Chat with a shop from its detail page.
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          onRefresh={onRefresh}
          refreshing={refreshing}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex-row items-center p-4 bg-[#1E293B] rounded-xl border border-slate-700 active:bg-slate-700"
              onPress={() => {
                // Optimistically clear the badge before navigating so it
                // doesn't flicker back while the API re-fetches on focus.
                setConversations((prev) =>
                  prev.map((c) =>
                    c.id === item.id ? { ...c, unreadCount: 0 } : c,
                  ),
                );
                router.push({
                  pathname: "/chat/[id]",
                  params: { id: item.id, shopName: item.shopName },
                });
              }}
            >
              <View className="flex-1 justify-center">
                <View className="flex-row justify-between mb-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="font-bold text-white text-base">
                      {item.shopName}
                    </Text>
                    {item.isOnline && (
                      <View className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                  </View>
                  <Text className="text-xs text-slate-400">{item.time}</Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text
                    numberOfLines={1}
                    className={`text-sm flex-1 mr-4 ${
                      item.unreadCount > 0
                        ? "text-white font-semibold"
                        : "text-slate-400"
                    }`}
                  >
                    {item.lastMessage || "No messages yet"}
                  </Text>

                  {/* Live unread badge */}
                  {item.unreadCount > 0 && (
                    <View className="bg-green-500 rounded-full min-w-[20px] h-5 px-1.5 items-center justify-center">
                      <Text className="text-white text-[10px] font-bold">
                        {item.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
