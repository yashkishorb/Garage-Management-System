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

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "due", label: "DUE", count: 0 },
  { id: "overdue", label: "OVERDUE", count: 0 },
  { id: "done", label: "DONE", count: 0 },
];

// ─── Reminder card ────────────────────────────────────────────────────────────
function ReminderCard({ reminder }) {
  const handleWhatsApp = () =>
    Alert.alert("WhatsApp", `Send WhatsApp reminder to ${reminder.customer}`);
  const handleCall = () => Alert.alert("Call", `Calling ${reminder.phone}`);

  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.cardIcon}>
          <Ionicons name="car-outline" size={20} color={COLORS.primary} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardCustomer} numberOfLines={1}>
            {reminder.customer}
          </Text>
          <Text style={styles.cardVehicle}>
            {reminder.vehicle} · {reminder.regNo}
          </Text>
          <Text style={styles.cardDueDate}>Due: {reminder.dueDate}</Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#25D366" }]}
          onPress={handleWhatsApp}
          accessibilityLabel="Send WhatsApp reminder"
          accessibilityRole="button"
        >
          <Ionicons name="logo-whatsapp" size={14} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: COLORS.primary }]}
          onPress={handleCall}
          accessibilityLabel="Call customer"
          accessibilityRole="button"
        >
          <Ionicons name="call" size={14} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function RemindersEmpty() {
  return (
    <View style={styles.emptyWrap}>
      <Ionicons name="cart-outline" size={64} color={COLORS.borderLight} />
      <Text style={styles.emptyText}>No Reminders found</Text>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ServiceRemindersScreen() {
  const [activeTab, setActiveTab] = useState("due");
  const [reminders] = useState([]);

  const rightElement = (
    <TouchableOpacity
      onPress={() => Alert.alert("Filter", "Filter options coming soon")}
      style={styles.filterBtn}
      accessibilityLabel="Filter reminders"
      accessibilityRole="button"
    >
      <Ionicons name="filter-outline" size={20} color={COLORS.textPrimary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <TopNav
        title="Service Reminders"
        transparent={false}
        rightElement={rightElement}
      />

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
              accessibilityLabel={`${tab.label} tab, ${tab.count} reminders`}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{tab.count}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      {reminders.length === 0 ? (
        <RemindersEmpty />
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReminderCard reminder={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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

  // Tabs
  tabsBar: {
    flexDirection: "row",
    backgroundColor: COLORS.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SIZES.md,
    gap: SIZES.xs,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textSm,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
  tabTextActive: { color: COLORS.primary },
  tabBadge: {
    backgroundColor: "#F97316",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: SIZES.radiusFull,
    minWidth: 22,
    alignItems: "center",
  },
  tabBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.textXs,
    color: COLORS.white,
  },

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
  separator: { height: SIZES.sm },

  // Card
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.bgCard,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SIZES.md,
    gap: SIZES.sm,
    ...SHADOWS.sm,
  },
  cardLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.md,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: { flex: 1 },
  cardCustomer: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
  },
  cardVehicle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.textXs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  cardDueDate: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.textXs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cardActions: { flexDirection: "row", gap: SIZES.sm },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
