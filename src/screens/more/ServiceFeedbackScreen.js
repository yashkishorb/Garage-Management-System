import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES, SHADOWS } from "../../utils/constants";
import TopNav from "../../components/ui/TopNav";
import Avatar from "../../components/ui/Avatar";

const TABS = [
  { id: "reviews", label: "REVIEWS", count: 0 },
  { id: "scheduled", label: "SCHEDULED", count: 0 },
];

// ─── Review card ──────────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < review.rating);
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Avatar name={review.customer ?? "C"} size="sm" />
        <View style={styles.reviewInfo}>
          <Text style={styles.reviewCustomer}>{review.customer}</Text>
          <Text style={styles.reviewDate}>{review.date}</Text>
        </View>
        <View style={styles.reviewStars}>
          {stars.map((filled, i) => (
            <Ionicons
              key={i}
              name={filled ? "star" : "star-outline"}
              size={14}
              color={filled ? "#FBBF24" : COLORS.borderLight}
            />
          ))}
        </View>
      </View>
      {review.comment ? (
        <Text style={styles.reviewComment}>{review.comment}</Text>
      ) : null}
    </View>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function FeedbackEmpty({ message }) {
  return (
    <View style={styles.emptyWrap}>
      <Ionicons
        name="chatbubble-ellipses-outline"
        size={64}
        color={COLORS.borderLight}
      />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ServiceFeedbackScreen() {
  const [activeTab, setActiveTab] = useState("reviews");
  const [reviews] = useState([]);
  const [avgRating] = useState(0);
  const [totalReviews] = useState(0);

  const rightElement = (
    <TouchableOpacity
      onPress={() => Alert.alert("Filter", "Filter options coming soon")}
      style={styles.filterBtn}
      accessibilityLabel="Filter reviews"
      accessibilityRole="button"
    >
      <Ionicons name="filter-outline" size={20} color={COLORS.textPrimary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <TopNav
        title="Feedback"
        transparent={false}
        rightElement={rightElement}
      />

      {/* Avg Rating Banner */}
      <View style={styles.ratingBanner}>
        <View style={styles.ratingLeft}>
          <Text style={styles.ratingLabel}>Avg Rating : </Text>
          <Ionicons name="star" size={16} color="#FBBF24" />
          <Text style={styles.ratingValue}>
            {avgRating > 0 ? ` ${avgRating.toFixed(1)}` : ""}
          </Text>
        </View>
        <Text style={styles.ratingReviews}>
          {totalReviews > 0 ? `${totalReviews} Reviews` : "#Reviews"}
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.8}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
              <View
                style={[styles.tabCount, isActive && styles.tabCountActive]}
              >
                <Text
                  style={[
                    styles.tabCountText,
                    isActive && styles.tabCountTextActive,
                  ]}
                >
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      {reviews.length === 0 ? (
        <FeedbackEmpty
          message={
            activeTab === "reviews"
              ? "No reviews found"
              : "No scheduled requests found"
          }
        />
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReviewCard review={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  filterBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  ratingBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.bgCard,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.md,
  },
  ratingLeft: { flexDirection: "row", alignItems: "center" },
  ratingLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.textBase,
    color: COLORS.textSecondary,
  },
  ratingValue: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
  },
  ratingReviews: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.textBase,
    color: COLORS.textSecondary,
  },

  tabsBar: {
    flexDirection: "row",
    backgroundColor: COLORS.bgSection,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SIZES.md,
    gap: SIZES.sm,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textSm,
    color: COLORS.textMuted,
    letterSpacing: 0.4,
  },
  tabTextActive: { color: COLORS.primary },
  tabCount: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: SIZES.radiusFull,
    minWidth: 22,
    alignItems: "center",
  },
  tabCountActive: { backgroundColor: COLORS.error },
  tabCountText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.textXs,
    color: COLORS.white,
  },
  tabCountTextActive: { color: COLORS.white },

  // Empty
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.textBase,
    color: COLORS.textMuted,
    marginTop: SIZES.md,
  },

  listContent: { padding: SIZES.screenPadding, paddingBottom: 120 },

  // Review card
  reviewCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SIZES.md,
    marginBottom: SIZES.sm,
    ...SHADOWS.sm,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.md,
    marginBottom: SIZES.sm,
  },
  reviewInfo: { flex: 1 },
  reviewCustomer: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
  },
  reviewDate: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.textXs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  reviewStars: { flexDirection: "row", gap: 2 },
  reviewComment: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.textSm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
