import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS, FONTS, SIZES, SHADOWS } from "../../utils/constants";
import TopNav from "../../components/ui/TopNav";
import AppInput from "../../components/ui/AppInput";
import AppButton from "../../components/ui/AppButton";

const ACTION_BUTTONS = [
  {
    id: "purchase",
    label: "Purchase Order",
    icon: "add-circle",
    bg: COLORS.primaryDark,
    onPress: (nav) => nav.navigate("PurchaseOrder"),
  },
  {
    id: "alerts",
    label: "View Alerts",
    icon: "search",
    bg: COLORS.error,
    onPress: (nav) => nav.navigate("InventoryAlerts"),
  },
  {
    id: "counter",
    label: "Counter Sale",
    icon: "trending-up",
    bg: COLORS.primaryDark,
    onPress: (nav) => nav.navigate("PartsCounterSale"),
  },
  {
    id: "stockin",
    label: "Stock In",
    icon: "bag",
    bg: COLORS.primaryDark,
    onPress: (nav) => nav.navigate("StockIn"),
  },
];

export default function PartsScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");

  const stats = { totalParts: 0, totalStock: 0, totalStockValue: 0 };

  const rightElement = (
    <View style={styles.headerRight}>
      <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
        <Ionicons name="refresh" size={20} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
        <Ionicons name="filter" size={20} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
        <Ionicons
          name="ellipsis-vertical"
          size={20}
          color={COLORS.textPrimary}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <TopNav
        title="Parts (Inventory)"
        showBack={true}
        transparent={false}
        rightElement={rightElement}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2×2 Action Buttons Grid */}
        <View style={styles.actionsGrid}>
          {ACTION_BUTTONS.map((btn) => (
            <TouchableOpacity
              key={btn.id}
              style={[styles.actionBtn, { backgroundColor: btn.bg }]}
              activeOpacity={0.85}
              onPress={() => btn.onPress(navigation)}
            >
              <Ionicons name={btn.icon} size={16} color={COLORS.white} />
              <Text style={styles.actionBtnText}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search Bar */}
        <AppInput
          icon="search"
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        {/* Upload CSV + Add Stock Row */}
        <View style={styles.toolRow}>
          <TouchableOpacity style={styles.uploadBtn} activeOpacity={0.8}>
            <MaterialCommunityIcons
              name="cloud-upload"
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.uploadText}>Upload CSV</Text>
          </TouchableOpacity>
          <AppButton
            title="Add Stock"
            variant="primary"
            size="sm"
            leftIcon="add-circle"
            fullWidth={false}
            onPress={() => {}}
            accessibilityLabel="Add stock"
          />
        </View>

        {/* Column Headers */}
        <View style={styles.columnHeader}>
          <Text style={[styles.colText, { flex: 2 }]}>(P No.) Name</Text>
          <Text style={[styles.colText, { flex: 1, textAlign: "center" }]}>
            Stock
          </Text>
          <Text style={[styles.colText, { flex: 1, textAlign: "center" }]}>
            MRP
          </Text>
          <Text style={[styles.colText, { flex: 1, textAlign: "right" }]}>
            Rack No
          </Text>
        </View>

        {/* Empty placeholder — replace with FlatList items when data is available */}
        <View style={styles.emptyArea} />

        {/* Stats Summary Card */}
        <View style={styles.statsCard}>
          <StatItem label="Total Parts" value={stats.totalParts} />
          <View style={styles.statDivider} />
          <StatItem label="Total Stock" value={stats.totalStock} />
          <View style={styles.statDivider} />
          <StatItem label="Total Stock Value" value={stats.totalStockValue} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatItem({ label, value }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  headerRight: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingBottom: Platform.OS === "ios" ? 140 : 120,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SIZES.sm,
    padding: SIZES.screenPadding,
    paddingBottom: SIZES.sm,
  },
  actionBtn: {
    flexBasis: "48%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: SIZES.radiusSm,
    ...SHADOWS.sm,
  },
  actionBtnText: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textSm,
    color: COLORS.white,
  },
  searchInput: {
    marginHorizontal: SIZES.screenPadding,
    marginBottom: SIZES.sm,
  },
  toolRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: SIZES.screenPadding,
    marginBottom: SIZES.sm,
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  uploadText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.textSm,
    color: COLORS.primary,
  },
  columnHeader: {
    flexDirection: "row",
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  colText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.textSm,
    color: COLORS.primary,
  },
  emptyArea: {
    height: 160,
  },
  statsCard: {
    marginHorizontal: SIZES.screenPadding,
    backgroundColor: COLORS.bgCard,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SIZES.md,
    ...SHADOWS.sm,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.textXs,
    color: COLORS.textMuted,
    marginBottom: 4,
    textAlign: "center",
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.textLg,
    color: COLORS.textPrimary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.borderLight,
  },
});
