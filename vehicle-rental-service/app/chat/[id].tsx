import { chatData, Message } from "@/data/chatData";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Image as ImageIcon, Send } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Safe Area Insets (for handling the iPhone notch/home bar)
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const chat = chatData.find((c) => c.id === id);

  useEffect(() => {
    if (chat) setMessages(chat.messages);
  }, [chat]);

  // Auto-scroll to bottom when messages update or keyboard opens
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      flatListRef.current?.scrollToEnd({ animated: true });
    });
    // Scroll on initial load
    setTimeout(
      () => flatListRef.current?.scrollToEnd({ animated: false }),
      100,
    );

    return () => {
      showSubscription.remove();
    };
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim().length === 0) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: "",
        image: result.assets[0].uri,
        sender: "me",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, newMessage]);
    }
  };

  if (!chat) return <View className="flex-1 bg-[#0F1C23]" />;

  return (
    <View style={{ flex: 1, backgroundColor: "#0F1C23" }}>
      {/* 1. Header is OUTSIDE KeyboardAvoidingView so it never moves */}
      <View
        style={{ paddingTop: insets.top }}
        className="bg-[#0F1C23] border-b border-slate-800"
      >
        <View className="flex-row items-center px-4 py-3 h-16">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 p-2 -ml-2"
          >
            <ArrowLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
          <View>
            <Text className="font-bold text-white text-lg">{chat.name}</Text>
            {chat.isOnline ? (
              <View className="flex-row items-center mt-0.5">
                <View className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
                <Text className="text-xs text-slate-400 font-medium tracking-wide">
                  Online
                </Text>
              </View>
            ) : (
              <Text className="text-xs text-slate-500 font-medium tracking-wide">
                Offline
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* 2. The Main View */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // iOS needs padding. Android usually works better with 'undefined' if app.json is configured correctly,
        // but 'height' is a safe fallback for default Expo setups.
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // 3. IMPORTANT: Offset accounts for the header height so input doesn't get hidden
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 20,
            gap: 16,
          }}
          renderItem={({ item }) => (
            <View
              className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                item.sender === "me"
                  ? "bg-[#00A884] self-end"
                  : "bg-[#1E293B] self-start"
              }`}
            >
              {item.image ? (
                <TouchableOpacity onPress={() => setSelectedImage(item.image!)}>
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 200, height: 200, borderRadius: 8 }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ) : (
                <Text className="text-white text-base">{item.text}</Text>
              )}
              <Text className="text-[10px] text-slate-300 text-right mt-1">
                {item.timestamp}
              </Text>
            </View>
          )}
        />

        {/* 4. Input Area */}
        <View
          className="flex-row items-end p-4 bg-[#0F1C23] border-t border-slate-800 gap-3"
          style={{
            paddingBottom:
              Platform.OS === "ios" ? Math.max(insets.bottom, 10) : 10,
          }}
        >
          <TouchableOpacity
            onPress={pickImage}
            className="w-[50px] h-[50px] bg-[#1E293B] rounded-full items-center justify-center"
          >
            <ImageIcon color="#94A3B8" size={24} />
          </TouchableOpacity>

          <View className="flex-1 bg-[#1E293B] rounded-2xl px-4 py-3 min-h-[50px] justify-center">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#64748B"
              className="text-white text-base max-h-32 pt-0 pb-0" // Removed extra padding that causes jumps
              multiline
            />
          </View>
          <TouchableOpacity
            onPress={sendMessage}
            className="w-[50px] h-[50px] bg-[#00A884] rounded-full items-center justify-center"
          >
            <Send color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Full Screen Image Viewer */}
      <Modal
        visible={!!selectedImage}
        transparent={true}
        onRequestClose={() => setSelectedImage(null)}
        animationType="fade"
      >
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <TouchableOpacity
            style={{
              position: "absolute",
              top: insets.top + 10,
              right: 20,
              zIndex: 10,
              padding: 10,
            }}
            onPress={() => setSelectedImage(null)}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              ✕
            </Text>
          </TouchableOpacity>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
