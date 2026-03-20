import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Star, MessageSquare, ThumbsUp } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { useAuth } from "@/context/AuthContext";
import { reviewApi, ShopReview, ShopReviewsResponse } from "@/services/api";
import { UserStackParamList } from "@/navigation/types";

type ShopReviewsRouteProp = RouteProp<UserStackParamList, "ShopReviews">;
type ShopReviewsNavProp = NativeStackNavigationProp<
  UserStackParamList,
  "ShopReviews"
>;

// ── Star Rating Picker ────────────────────────────────────────────────────────
function StarPicker({
  value,
  onChange,
  size = 32,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  return (
    <View className="flex-row gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <TouchableOpacity
          key={i}
          onPress={() => onChange(i)}
          activeOpacity={0.7}
        >
          <Star
            size={size}
            fill={i <= value ? "#F59E0B" : "transparent"}
            color={i <= value ? "#F59E0B" : "#475569"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Star Display (read-only) ──────────────────────────────────────────────────
function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View className="flex-row gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= rating ? "#F59E0B" : "transparent"}
          color={i <= rating ? "#F59E0B" : "#475569"}
        />
      ))}
    </View>
  );
}

// ── Rating Distribution Bar ───────────────────────────────────────────────────
function RatingBar({
  starValue,
  count,
  total,
}: {
  starValue: number;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <View className="flex-row items-center gap-2 mb-1.5">
      <Text className="text-slate-400 text-xs w-4 text-right">{starValue}</Text>
      <Star size={10} fill="#F59E0B" color="#F59E0B" />
      <View className="flex-1 h-2 rounded-full bg-slate-700 overflow-hidden">
        <View
          className="h-full rounded-full bg-amber-400"
          style={{ width: `${pct}%` }}
        />
      </View>
      <Text className="text-slate-400 text-xs w-4">{count}</Text>
    </View>
  );
}

// ── Avatar Initials ───────────────────────────────────────────────────────────
function Avatar({ initials }: { initials: string }) {
  const colors = ["#4F46E5", "#7C3AED", "#0891B2", "#059669", "#D97706"];
  const color = colors[initials.charCodeAt(0) % colors.length];
  return (
    <View
      className="w-10 h-10 rounded-full items-center justify-center mr-3 flex-shrink-0"
      style={{ backgroundColor: color }}
    >
      <Text className="text-white font-bold text-sm">{initials}</Text>
    </View>
  );
}

// ── Review Card ───────────────────────────────────────────────────────────────
function ReviewCard({ review }: { review: ShopReview }) {
  const date = new Date(review.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <View className="bg-[#1A2C35] rounded-2xl p-4 mb-3 border border-slate-700/50">
      <View className="flex-row items-start">
        <Avatar initials={review.user_initials} />
        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-white font-semibold text-sm">
              {review.username}
            </Text>
            <Text className="text-slate-500 text-xs">{date}</Text>
          </View>
          <StarDisplay rating={review.rating} size={13} />
          <Text className="text-slate-300 text-sm mt-2 leading-5">
            {review.comment}
          </Text>
          {review.owner_reply ? (
            <View className="mt-3 bg-[#0F1C23] rounded-xl p-3 border-l-2 border-[#22D3EE]">
              <Text className="text-[#22D3EE] text-xs font-semibold mb-1">
                Owner's Reply
              </Text>
              <Text className="text-slate-300 text-sm leading-5">
                {review.owner_reply}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function ShopReviews() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ShopReviewsNavProp>();
  const route = useRoute<ShopReviewsRouteProp>();
  const { shopId, shopName } = route.params;
  const { token } = useAuth();

  const [data, setData] = useState<ShopReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Write-a-review form state
  const [draftRating, setDraftRating] = useState(0);
  const [draftComment, setDraftComment] = useState("");
  const [editing, setEditing] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await reviewApi.getShopReviews(shopId, token || "");
      setData(res);
      if (res.user_review) {
        setDraftRating(res.user_review.rating);
        setDraftComment(res.user_review.comment);
      }
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load reviews",
      });
    } finally {
      setLoading(false);
    }
  }, [shopId, token]);

  useFocusEffect(
    useCallback(() => {
      fetchReviews();
    }, [fetchReviews]),
  );

  const handleSubmit = async () => {
    if (draftRating === 0) {
      Alert.alert(
        "Rating required",
        "Please select a star rating before submitting.",
      );
      return;
    }
    if (!draftComment.trim()) {
      Alert.alert(
        "Comment required",
        "Please write a comment before submitting.",
      );
      return;
    }
    try {
      setSubmitting(true);
      await reviewApi.submitReview(
        shopId,
        draftRating,
        draftComment.trim(),
        token || "",
      );
      Toast.show({
        type: "success",
        text1: "Thank you!",
        text2: "Your review has been saved.",
      });
      setEditing(false);
      await fetchReviews();
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: e.message || "Failed to save review",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Compute rating distribution
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: data?.reviews.filter((r) => r.rating === star).length ?? 0,
  }));

  const avgRating = data?.avg_rating ?? 0;
  const reviewCount = data?.review_count ?? 0;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#0F1C23]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" />
      <View style={{ paddingTop: insets.top }} className="bg-[#0F1C23]">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-slate-800">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-[#1E293B] p-2.5 rounded-full mr-3"
          >
            <ArrowLeft color="#fff" size={20} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white font-bold text-lg" numberOfLines={1}>
              Reviews
            </Text>
            <Text className="text-slate-400 text-xs" numberOfLines={1}>
              {shopName}
            </Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#22D3EE" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero Summary Card ── */}
          <View
            className="rounded-3xl p-5 mb-5 overflow-hidden"
            style={{
              backgroundColor: "#1A2C35",
              borderWidth: 1,
              borderColor: "#334155",
            }}
          >
            <View className="flex-row items-center gap-5">
              {/* Big Rating */}
              <View className="items-center">
                <Text className="text-5xl font-bold text-white">
                  {avgRating > 0 ? avgRating.toFixed(1) : "—"}
                </Text>
                <StarDisplay rating={Math.round(avgRating)} size={16} />
                <Text className="text-slate-400 text-xs mt-1">
                  {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                </Text>
              </View>
              {/* Distribution bars */}
              <View className="flex-1">
                {distribution.map(({ star, count }) => (
                  <RatingBar
                    key={star}
                    starValue={star}
                    count={count}
                    total={reviewCount}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* ── Write / Edit Review Card ── */}
          {data?.user_has_reviewed && !editing ? (
            // Already reviewed – show "Edit" prompt
            <View className="bg-[#1A2C35] rounded-2xl p-4 mb-5 border border-slate-700/50 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <ThumbsUp size={20} color="#22D3EE" />
                <View>
                  <Text className="text-white font-semibold text-sm">
                    You reviewed this shop
                  </Text>
                  <StarDisplay
                    rating={data.user_review?.rating ?? 0}
                    size={13}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setEditing(true)}
                className="bg-[#22D3EE]/10 border border-[#22D3EE]/30 rounded-full px-3 py-1.5"
              >
                <Text className="text-[#22D3EE] text-xs font-semibold">
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Write / Edit form
            <View className="bg-[#1A2C35] rounded-2xl p-5 mb-5 border border-slate-700/50">
              <View className="flex-row items-center gap-2 mb-4">
                <MessageSquare size={18} color="#22D3EE" />
                <Text className="text-white font-semibold text-base">
                  {data?.user_has_reviewed
                    ? "Edit your review"
                    : "Write a Review"}
                </Text>
              </View>

              <Text className="text-slate-400 text-xs mb-2 font-medium">
                YOUR RATING
              </Text>
              <View className="mb-4">
                <StarPicker
                  value={draftRating}
                  onChange={setDraftRating}
                  size={34}
                />
              </View>

              <Text className="text-slate-400 text-xs mb-2 font-medium">
                YOUR COMMENT
              </Text>
              <TextInput
                className="bg-[#0F1C23] text-white rounded-xl p-3 text-sm border border-slate-700"
                placeholder="Share your experience with others…"
                placeholderTextColor="#475569"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={{ minHeight: 100 }}
                value={draftComment}
                onChangeText={setDraftComment}
              />

              <View className="flex-row gap-3 mt-4">
                {data?.user_has_reviewed && editing && (
                  <TouchableOpacity
                    onPress={() => setEditing(false)}
                    className="flex-1 py-3 rounded-xl border border-slate-600 items-center"
                  >
                    <Text className="text-slate-300 font-semibold text-sm">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl items-center"
                  style={{
                    backgroundColor: submitting ? "#0e7490" : "#22D3EE",
                  }}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#0F1C23" />
                  ) : (
                    <Text className="text-[#0F1C23] font-bold text-sm">
                      {data?.user_has_reviewed
                        ? "Update Review"
                        : "Submit Review"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ── Review List ── */}
          {data && data.reviews.length > 0 ? (
            <>
              <Text className="text-white font-semibold text-base mb-3">
                All Reviews ({reviewCount})
              </Text>
              {data.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </>
          ) : (
            <View className="items-center py-12">
              <Star size={48} color="#334155" />
              <Text className="text-slate-500 text-base font-semibold mt-4">
                No reviews yet
              </Text>
              <Text className="text-slate-600 text-sm mt-1">
                Be the first to review this shop!
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}
