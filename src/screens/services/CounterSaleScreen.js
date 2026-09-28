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
import { COLORS, FONTS, SIZES, SHADOWS } from "../../utils/constants";
import TopNav from "../../components/ui/TopNav";
import AppInput from "../../components/ui/AppInput";
import AppButton from "../../components/ui/AppButton";
import AppToggle from "../../components/ui/AppToggle";

export default function CounterSaleScreen() {
  const [notifyCustomer, setNotifyCustomer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <TopNav title="Counter Sale" transparent={false} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppInput
          icon="search-outline"
          placeholder="Search Customer"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          accessibilityLabel="Search customer"
        />

        {/* Service / parts / tags section */}
        <View style={styles.sectionContainer}>
          <SectionRow label="Services" bgStyle={styles.greenSection} />
          <SectionRow label="Parts/Stocks" bgStyle={styles.greenSection} />
          <SectionRow label="Tags" bgStyle={styles.whiteSection} isLast />
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <SummaryRow label="Services Sub Total" value="0.00" />
          <SummaryRow label="Parts Sub Total" value="0.00" />
          <SummaryRow label="Discount" value="0.00" />
          <SummaryRow label="Total" value="0.00" isLast boldValue />
        </View>

        {/* Notify toggle */}
        <AppToggle
          label="Notify Customer (SMS & email)?"
          icon="notifications-outline"
          value={notifyCustomer}
          onChange={setNotifyCustomer}
          accessibilityLabel="Notify customer"
        />
      </ScrollView>

      {/* Floating footer */}
      <View style={styles.footer}>
        <AppButton
          title="Prepare Invoice"
          variant="primary"
          size="lg"
          onPress={() => {}}
          accessibilityLabel="Prepare invoice"
        />
      </View>
    </SafeAreaView>
  );
}

function SectionRow({ label, bgStyle, isLast }) {
  return (
    <View
      style={[styles.sectionRow, bgStyle, !isLast && styles.sectionRowBorder]}
    >
      <Text style={styles.sectionLabel}>{label}</Text>
      <AppButton
        title="Add"
        variant="primary"
        size="sm"
        leftIcon="add"
        fullWidth={false}
        onPress={() => {}}
        accessibilityLabel={`Add ${label}`}
      />
    </View>
  );
}

function SummaryRow({ label, value, isLast, boldValue }) {
  return (
    <View style={[styles.summaryRow, !isLast && styles.summaryRowBorder]}>
      <Text style={[styles.summaryLabel, isLast && styles.summaryLabelBold]}>
        {label}
      </Text>
      <View
        style={[
          styles.summaryValueContainer,
          isLast && styles.summaryValueContainerBold,
        ]}
      >
        <Text style={[styles.rupeeSymbol, isLast && styles.valueBold]}>₹</Text>
        <Text style={[styles.summaryValue, isLast && styles.valueBold]}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: {
    padding: SIZES.screenPadding,
    paddingBottom: 100,
  },
  searchInput: {
    marginBottom: SIZES.md,
  },

  // Section container
  sectionContainer: {
    marginBottom: SIZES.md,
    overflow: "hidden",
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.bgCard,
    ...SHADOWS.sm,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  sectionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  greenSection: { backgroundColor: COLORS.primaryLight },
  whiteSection: { backgroundColor: COLORS.bgCard },
  sectionLabel: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
  },


  // Summary
  summaryContainer: {
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.bgCard,
    ...SHADOWS.sm,
    marginBottom: SIZES.md,
    overflow: "hidden",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  summaryRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  summaryLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
    flex: 1,
  },
  summaryLabelBold: {
    fontFamily: FONTS.semibold,
    color: COLORS.textPrimary,
  },
  summaryValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bg,
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: SIZES.sm,
    paddingVertical: 6,
    width: 120,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  summaryValueContainerBold: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  rupeeSymbol: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
    marginRight: SIZES.xs,
  },
  summaryValue: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
    textAlign: "right",
  },
  valueBold: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },

  // Footer
  footer: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.md,
    paddingBottom: Platform.OS === "ios" ? 28 : SIZES.md,
    backgroundColor: COLORS.bgCard,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    ...SHADOWS.md,
  },
});
