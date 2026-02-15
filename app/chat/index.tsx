import { chatData } from "@/data/chatData";
import { useRouter } from "expo-router";
import { ArrowLeft, Search } from "lucide-react-native";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatList() {
  const router = useRouter();

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

      <FlatList
        data={chatData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center p-4 bg-[#1E293B] rounded-xl border border-slate-700 active:bg-slate-700"
            onPress={() =>
              router.push({ pathname: "/chat/[id]", params: { id: item.id } })
            }
          >
            <View className="flex-1 justify-center">
              <View className="flex-row justify-between mb-2">
                <Text className="font-bold text-white text-lg">
                  {item.name}
                </Text>
                <Text className="text-xs text-slate-400">{item.time}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text
                  numberOfLines={1}
                  className="text-slate-400 text-sm flex-1 mr-4"
                >
                  {item.lastMessage}
                </Text>
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
    </SafeAreaView>
  );
}
