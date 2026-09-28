import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { COLORS, FONTS, SIZES, SHADOWS } from "../../utils/constants";
import TopNav from "../../components/ui/TopNav";
import AppInput from "../../components/ui/AppInput";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonListItem } from "../../components/ui/SkeletonLoader";
import Badge from "../../components/ui/Badge";

const TABS = [
  { id: "CREATED", label: "Created", badgeVariant: "info" },
  { id: "IN_PROGRESS", label: "WIP", badgeVariant: "warning" },
  { id: "VEHICLE_READY", label: "Ready", badgeVariant: "success" },
  { id: "COMPLETED", label: "Completed", badgeVariant: "neutral" },
];

function OrderCard({ order }) {
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderLeft}>
        <View style={styles.orderIconWrap}>
          <Ionicons
            name="document-text-outline"
            size={20}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.orderInfo}>
          <Text style={styles.orderCustomer} numberOfLines={1}>
            {order.customer}
          </Text>
          <Text style={styles.orderMeta}>
            {order.vehicle} · #{order.id}
          </Text>
        </View>
      </View>
      <View style={styles.orderRight}>
        <Text style={styles.orderAmount}>₹{order.amount}</Text>
        <Badge label={order.status} variant={order.badgeVariant} />
      </View>
    </View>
  );
}

export default function OrdersScreen() {
  const route = useRoute();
  const initialTab = route.params?.initialTab || "CREATED";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [orders] = useState([]);
  const [loading] = useState(false);

  const rightElement = (
    <View style={styles.headerIcons}>
      <TouchableOpacity
        style={styles.iconBtn}
        accessibilityLabel="Refresh"
        accessibilityRole="button"
      >
        <Ionicons name="refresh-outline" size={20} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconBtn}
        accessibilityLabel="Filter"
        accessibilityRole="button"
      >
        <Ionicons name="options-outline" size={20} color={COLORS.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <TopNav title="Orders" transparent={false} rightElement={rightElement} />

      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.8}
                accessibilityLabel={tab.label}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                <Text
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.content}>
        <AppInput
          icon="search-outline"
          placeholder="Search name · phone · reg no"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          accessibilityLabel="Search orders"
        />
        {loading ? (
          <View>
            {[0, 1, 2].map((i) => (
              <SkeletonListItem key={i} style={styles.skeleton} />
            ))}
          </View>
        ) : orders.length === 0 ? (
          <EmptyState
            emoji="🛒"
            title="No orders yet"
            description={`No ${TABS.find((t) => t.id === activeTab)?.label?.toLowerCase()} orders to show`}
          />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <OrderCard order={item} />}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  headerIcons: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    gap: SIZES.xs,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.bgSection,
    alignItems: "center",
    justifyContent: "center",
  },
  tabsWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.bgCard,
    paddingVertical: SIZES.sm,
    ...SHADOWS.sm,
  },
  tabsScroll: {
    paddingHorizontal: SIZES.screenPadding,
    gap: SIZES.sm,
    alignItems: "center",
  },
  tabChip: {
    paddingHorizontal: SIZES.md,
    paddingVertical: 7,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.bgCard,
  },
  tabChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.textSm,
    color: COLORS.textMuted,
  },
  tabTextActive: { fontFamily: FONTS.semibold, color: COLORS.primary },
  content: { flex: 1, padding: SIZES.screenPadding },
  searchInput: { marginBottom: SIZES.md },
  listContent: { paddingBottom: 120 },
  separator: { height: SIZES.sm },
  skeleton: {
    backgroundColor: COLORS.bgCard,
    borderRadius: SIZES.radiusMd,
    marginBottom: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  orderCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.bgCard,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    gap: SIZES.sm,
    ...SHADOWS.sm,
  },
  orderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.md,
    flex: 1,
  },
  orderIconWrap: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  orderInfo: { flex: 1 },
  orderCustomer: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
  },
  orderMeta: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.textXs,
    color: COLORS.textMuted,
    marginTop: 3,
  },
  orderRight: { alignItems: "flex-end", gap: 6 },
  orderAmount: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.textBase,
    color: COLORS.primary,
  },
});
