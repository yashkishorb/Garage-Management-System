import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES, SHADOWS } from "../../utils/constants";
import EmptyState from "../../components/ui/EmptyState";
import TopNav from "../../components/ui/TopNav";
import AppButton from "../../components/ui/AppButton";

// ----- Mock Data (replace with real API data) -----
const INCOME_DATA = [
  { id: "1", name: "Vaibhav Jagtap", date: "Mar 11, 2026", amount: "1,900.00" },
  { id: "2", name: "Vaibhav Jagtap", date: "Mar 7, 2026", amount: "1,900.00" },
];

const PERIOD_OPTIONS = ["THIS_MONTH", "LAST_MONTH", "THIS_YEAR", "CUSTOM"];

const TABS = [
  { id: "EXPENSE", label: "EXPENSE" },
  { id: "PART_PURCHASE", label: "PART PURCHASE" },
  { id: "INCOME", label: "INCOME" },
];

// ---- Reusable legend dot ----
function LegendDot({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

// ---- Summary stats card (TOTAL / PAID / CREDIT) ----
function SummaryCard({ total = "₹0.00", paid = "₹0.00", credit = "₹0.00" }) {
  return (
    <View style={styles.summaryCard}>
      {/* Legend row */}
      <View style={styles.legendRow}>
        <LegendDot color={COLORS.success} label="Paid" />
        <LegendDot color={COLORS.secondary} label="Partial Paid" />
        <LegendDot color={COLORS.error} label="Credit" />
      </View>
      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statCol}>
          <Text style={styles.statHeading}>TOTAL</Text>
          <Text style={styles.statAmount}>{total}</Text>
        </View>
        <View style={styles.statCol}>
          <Text style={[styles.statHeading, { color: COLORS.success }]}>
            PAID
          </Text>
          <Text style={[styles.statAmount, { color: COLORS.success }]}>
            {paid}
          </Text>
        </View>
        <View style={styles.statCol}>
          <Text style={[styles.statHeading, { color: COLORS.error }]}>
            CREDIT
          </Text>
          <Text style={[styles.statAmount, { color: COLORS.error }]}>
            {credit}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ---- Income List Item ----
function IncomeItem({ index, item }) {
  return (
    <View style={styles.incomeRow}>
      <View style={styles.incomeAvatar}>
        <Text style={styles.incomeAvatarText}>{index}</Text>
      </View>
      <View style={styles.incomeInfo}>
        <Text style={styles.incomeName}>{item.name}</Text>
        <Text style={styles.incomeDate}>{item.date}</Text>
      </View>
      <View style={styles.incomeRight}>
        <TouchableOpacity style={styles.viewPaymentBtn} activeOpacity={0.8}>
          <Text style={styles.viewPaymentText}>View Payment</Text>
        </TouchableOpacity>
        <Text style={styles.incomeAmount}>₹{item.amount}</Text>
      </View>
    </View>
  );
}

export default function AccountsScreen() {
  const [activeTab, setActiveTab] = useState("EXPENSE");
  const [period, setPeriod] = useState("THIS_MONTH");

  const cyclePeriod = () => {
    const idx = PERIOD_OPTIONS.indexOf(period);
    setPeriod(PERIOD_OPTIONS[(idx + 1) % PERIOD_OPTIONS.length]);
  };

  // Mock net summary values
  const netSummary = {
    income: "3,800.00",
    expense: "0.00",
    payable: "0.00",
    net: "3,800.00",
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      {/* ========= TopNav ========= */}
      <TopNav
        title="Accounts"
        showBack={true}
        transparent={false}
        rightElement={
          <View style={styles.navRight}>
            <TouchableOpacity style={styles.dailyBookBtn} activeOpacity={0.8}>
              <Text style={styles.dailyBookText}>Account Daily Book</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterIconBtn} activeOpacity={0.8}>
              <Ionicons name="filter" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        }
      />

      {/* ========= Period Pill ========= */}
      <View style={styles.periodRow}>
        <TouchableOpacity
          style={styles.periodPill}
          onPress={cyclePeriod}
          activeOpacity={0.8}
        >
          <Text style={styles.periodText}>{period.replace("_", " ")}</Text>
        </TouchableOpacity>
      </View>

      {/* ========= Tabs ========= */}
      <View style={styles.tabsRow}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ========= Tab Content ========= */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ----------- EXPENSE Tab ----------- */}
        {activeTab === "EXPENSE" && (
          <View>
            <AppButton
              title="Add Expense"
              onPress={() => {}}
              variant="gradient"
              size="sm"
              leftIcon="add"
              fullWidth={false}
              style={styles.tabActionBtn}
            />
            <SummaryCard />
          </View>
        )}

        {/* ----------- PART PURCHASE Tab ----------- */}
        {activeTab === "PART_PURCHASE" && (
          <View>
            <View style={styles.actionRow}>
              <AppButton
                title="Add Part Purchase"
                onPress={() => {}}
                variant="gradient"
                size="sm"
                leftIcon="add"
                fullWidth={false}
              />
              <AppButton
                title="View All Vendors Due"
                onPress={() => {}}
                variant="danger"
                size="sm"
                fullWidth={false}
              />
            </View>
            <SummaryCard />
          </View>
        )}

        {/* ----------- INCOME Tab ----------- */}
        {activeTab === "INCOME" && (
          <View>
            {INCOME_DATA.length === 0 ? (
              <EmptyState emoji="💰" title="No income records found" />
            ) : (
              INCOME_DATA.map((item, index) => (
                <IncomeItem key={item.id} index={index + 1} item={item} />
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* ========= Sticky NET Footer ========= */}
      <View style={styles.netFooter}>
        <View style={styles.netLeft}>
          <Text style={styles.netMetaText}>
            Income (by payment) ₹{netSummary.income}
          </Text>
          <Text style={styles.netMetaText}>Expense ₹{netSummary.expense}</Text>
          <Text style={styles.netMetaText}>
            Payable ₹{netSummary.payable} (Credit)
          </Text>
        </View>
        <View style={styles.netRight}>
          <Text style={styles.netLabel}>NET</Text>
          <View style={styles.netAmountRow}>
            <MaterialCommunityIcons
              name="arrow-up-bold"
              size={20}
              color={COLORS.success}
            />
            <Text style={styles.netAmount}>₹{netSummary.net}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  // ---- Header ----
  // ---- Nav Right ----
  navRight: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.sm,
  },
  dailyBookBtn: {
    borderWidth: 1.2,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SIZES.sm + 2,
    paddingVertical: 5,
  },
  dailyBookText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.textXs,
    color: COLORS.primary,
  },
  filterIconBtn: {
    padding: 4,
  },

  // ---- Period Pill ----
  periodRow: {
    alignItems: "center",
    paddingTop: SIZES.sm,
    paddingBottom: 0,
    backgroundColor: COLORS.bgCard,
  },
  periodPill: {
    backgroundColor: COLORS.bgSection,
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: SIZES.md,
    paddingVertical: 5,
  },
  periodText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.textXs,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },

  // ---- Tabs ----
  tabsRow: {
    flexDirection: "row",
    backgroundColor: COLORS.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SIZES.sm + 4,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.textXs,
    color: COLORS.textMuted,
    letterSpacing: 0.4,
  },
  activeTabText: {
    fontFamily: FONTS.semibold,
    color: COLORS.primary,
  },

  // ---- Scroll Content ----
  scrollContent: {
    padding: SIZES.screenPadding,
    paddingBottom: Platform.OS === "ios" ? 200 : 180,
  },

  // ---- Action Buttons ----
  tabActionBtn: {
    marginBottom: SIZES.md,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SIZES.md,
    gap: SIZES.sm,
    flexWrap: "wrap",
  },

  // ---- Summary Card ----
  summaryCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SIZES.md,
    ...SHADOWS.sm,
  },
  legendRow: {
    flexDirection: "row",
    gap: SIZES.md,
    justifyContent: "center",
    marginBottom: SIZES.md,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: SIZES.radiusFull,
  },
  legendText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.textXs,
    color: COLORS.textMuted,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCol: {
    flex: 1,
    alignItems: "center",
  },
  statHeading: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textSm,
    color: COLORS.textPrimary,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  statAmount: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.textSm,
    color: COLORS.textPrimary,
  },

  // ---- Income List Items ----
  incomeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: SIZES.sm,
  },
  incomeAvatar: {
    width: 34,
    height: 34,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  incomeAvatarText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.textSm,
    color: COLORS.white,
  },
  incomeInfo: {
    flex: 1,
  },
  incomeName: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  incomeDate: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.textSm,
    color: COLORS.textMuted,
  },
  incomeRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  viewPaymentBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: SIZES.sm,
    paddingVertical: 4,
  },
  viewPaymentText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.textXs,
    color: COLORS.primary,
  },
  incomeAmount: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textSm,
    color: COLORS.success,
  },

  // ---- NET Footer ----
  netFooter: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 100 : 100,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: COLORS.borderLight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.md,
  },
  netLeft: {
    flex: 1,
    gap: 2,
  },
  netMetaText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.textXs,
    color: COLORS.textMuted,
  },
  netRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.xs,
  },
  netLabel: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
    marginRight: SIZES.xs,
  },
  netAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  netAmount: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.textLg,
    color: COLORS.textPrimary,
  },
});
