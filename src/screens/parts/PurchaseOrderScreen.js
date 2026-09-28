import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES, SHADOWS } from "../../utils/constants";
import TopNav from "../../components/ui/TopNav";
import AppInput from "../../components/ui/AppInput";
import AppButton from "../../components/ui/AppButton";
import AppSelect from "../../components/ui/AppSelect";
import AppToggle from "../../components/ui/AppToggle";
import EmptyState from "../../components/ui/EmptyState";

const TABS = [
  { id: "CREATE_ORDER", label: "CREATE ORDER" },
  { id: "ORDERS", label: "ORDERS" },
];

export default function PurchaseOrderScreen() {
  const [activeTab, setActiveTab] = useState("CREATE_ORDER");
  const [vendor, setVendor] = useState("");
  const [repairOrder, setRepairOrder] = useState("");
  const [parts, setParts] = useState([]);
  const [comments, setComments] = useState("");
  const [notifyVendor, setNotifyVendor] = useState(false);
  const [orders] = useState([]); // Replace with real orders data

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <TopNav title="Purchase Order" transparent={false} />

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
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

      {activeTab === "CREATE_ORDER" ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Vendor Dropdown */}
          <AppSelect
            icon="person-outline"
            placeholder="Vendor"
            options={[]}
            value={vendor}
            onChange={setVendor}
          />

          {/* Repair Order Dropdown */}
          <AppSelect
            icon="document-text-outline"
            placeholder="Repair Order"
            options={[]}
            value={repairOrder}
            onChange={setRepairOrder}
          />

          {/* Parts/Stocks Section */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>PARTS/STOCKS</Text>
              <AppButton
                title="Add"
                variant="primary"
                size="sm"
                leftIcon="add-circle"
                fullWidth={false}
                onPress={() => {}}
              />
            </View>

            {/* Parts Column Headers */}
            <View style={styles.partsHeader}>
              <Text style={[styles.partsCol, { flex: 1.5 }]}>Part No.</Text>
              <Text style={[styles.partsCol, { flex: 2 }]}>Part Name</Text>
              <Text style={[styles.partsCol, { flex: 1, textAlign: "center" }]}>
                Qty
              </Text>
              <Text style={[styles.partsCol, { flex: 1, textAlign: "right" }]}>
                Image
              </Text>
            </View>

            {parts.length === 0 ? (
              <View style={styles.partEmptyWrap}>
                <EmptyState emoji="🔩" title="No parts added yet" />
              </View>
            ) : (
              parts.map((p, i) => (
                <View key={i} style={styles.partRow}>
                  <Text style={[styles.partCell, { flex: 1.5 }]}>{p.no}</Text>
                  <Text style={[styles.partCell, { flex: 2 }]}>{p.name}</Text>
                  <Text
                    style={[styles.partCell, { flex: 1, textAlign: "center" }]}
                  >
                    {p.qty}
                  </Text>
                </View>
              ))
            )}
          </View>

          {/* Comments */}
          <AppInput
            placeholder="Comments or instructions to vendor?"
            value={comments}
            onChangeText={setComments}
            multiline
            numberOfLines={3}
            style={styles.commentsInput}
          />

          {/* Notify Vendor Toggle */}
          <AppToggle
            label="Notify Vendor (SMS & e-mail)?"
            icon="notifications-outline"
            value={notifyVendor}
            onChange={setNotifyVendor}
          />

          {/* Create Order Button */}
          <AppButton
            title="Create Order"
            onPress={() => {}}
            variant="primary"
            size="lg"
            style={styles.createOrderBtn}
          />
        </ScrollView>
      ) : (
        // ORDERS Tab
        <View style={styles.ordersTab}>
          {orders.length === 0 ? (
            <EmptyState emoji="📋" title="No purchase orders found" />
          ) : (
            <FlatList
              data={orders}
              keyExtractor={(item) => item.id.toString()}
              renderItem={() => null}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  tabsWrapper: {
    flexDirection: "row",
    backgroundColor: COLORS.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.md,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.textSm,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  activeTabText: {
    fontFamily: FONTS.semibold,
    color: COLORS.primary,
  },
  scrollContent: {
    padding: SIZES.screenPadding,
    paddingBottom: Platform.OS === "ios" ? 120 : 100,
  },

  sectionBlock: {
    marginTop: SIZES.sm,
    marginBottom: SIZES.md,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.bgCard,
    overflow: "hidden",
    ...SHADOWS.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  sectionLabel: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textSm,
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },

  partsHeader: {
    flexDirection: "row",
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  partsCol: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.textXs,
    color: COLORS.textMuted,
  },
  partEmptyWrap: {
    paddingVertical: SIZES.md,
  },
  partRow: {
    flexDirection: "row",
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  partCell: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.textSm,
    color: COLORS.textPrimary,
  },
  commentsInput: {
    marginBottom: SIZES.md,
  },
  createOrderBtn: {
    backgroundColor: COLORS.primaryDark,
  },
  ordersTab: {
    flex: 1,
    padding: SIZES.screenPadding,
  },
});
