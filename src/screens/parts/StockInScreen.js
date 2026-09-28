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
import TopNav from "../../components/ui/TopNav";
import AppInput from "../../components/ui/AppInput";
import AppButton from "../../components/ui/AppButton";
import AppSelect from "../../components/ui/AppSelect";
import AppToggle from "../../components/ui/AppToggle";

const PAYMENT_OPTIONS = ["CASH", "CARD", "UPI", "BANK"].map((v) => ({ value: v, label: v }));

export default function StockInScreen() {
  const [date, setDate] = useState("13-03-2026");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [linkPurchaseOrder, setLinkPurchaseOrder] = useState(false);
  const [vendor, setVendor] = useState("");
  const [paymentChannel, setPaymentChannel] = useState("CASH");
  const [sendReport, setSendReport] = useState(false);
  const [parts, setParts] = useState([]);
  const [paidAmount, setPaidAmount] = useState("0");
  const [total] = useState("0.00");



  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <TopNav title="Stock In Information" transparent={false} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Row 1: Date + Invoice No */}
        <View style={styles.row}>
          {/* Date Field */}
          <View style={[styles.dateField, { flex: 1.2 }]}>
            <Text style={styles.dateText}>{date}</Text>
            <TouchableOpacity
              style={styles.dateClear}
              onPress={() => setDate("")}
              hitSlop={8}
            >
              <Ionicons name="close" size={14} color={COLORS.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity hitSlop={8}>
              <MaterialCommunityIcons
                name="calendar"
                size={18}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>

          {/* Invoice No */}
          <AppInput
            placeholder="Invoice No."
            value={invoiceNo}
            onChangeText={setInvoiceNo}
            style={{ flex: 1 }}
          />
        </View>

        {/* Link existing purchase order checkbox */}
        <TouchableOpacity
          style={styles.checkRow}
          onPress={() => setLinkPurchaseOrder((p) => !p)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.checkbox,
              linkPurchaseOrder && styles.checkboxChecked,
            ]}
          >
            {linkPurchaseOrder && (
              <Ionicons name="checkmark" size={13} color={COLORS.white} />
            )}
          </View>
          <Text style={styles.checkLabel}>Link existing purchase order.</Text>
        </TouchableOpacity>

        {/* Vendor Dropdown */}
        <AppSelect
          icon="person-outline"
          placeholder="Vendor"
          options={[]}
          value={vendor}
          onChange={setVendor}
        />

        {/* Payment Channel */}
        <AppSelect
          label="Payment Channel"
          icon="card-outline"
          options={PAYMENT_OPTIONS}
          value={paymentChannel}
          onChange={setPaymentChannel}
        />

        {/* Add Invoice Image Button */}
        <View style={styles.invoiceImgRow}>
          <AppButton
            title="Add Invoice Image"
            onPress={() => {}}
            variant="ghost"
            size="sm"
            leftIcon="camera-outline"
            fullWidth={false}
          />
        </View>

        {/* Scan Barcode + Add Part/Stock Buttons */}
        <View style={styles.barcodeRow}>
          <AppButton
            title="Scan Barcode"
            onPress={() => {}}
            variant="ghost"
            size="sm"
            leftIcon="barcode-outline"
            style={styles.halfBtn}
            fullWidth={false}
          />
          <AppButton
            title="Add Part/Stock"
            onPress={() => {}}
            variant="gradient"
            size="sm"
            leftIcon="add-circle-outline"
            style={styles.halfBtn}
            fullWidth={false}
          />
        </View>

        {/* Send Stock In report via email toggle */}
        <AppToggle
          label="Send Stock In report via email"
          icon="mail-outline"
          value={sendReport}
          onChange={setSendReport}
        />

        {/* Column Headers */}
        <View style={styles.columnHeader}>
          <Text style={[styles.colText, { flex: 2 }]}>(P.No.) Name</Text>
          <Text style={[styles.colText, { flex: 1, textAlign: "center" }]}>
            Current{"\n"}Stock
          </Text>
          <Text style={[styles.colText, { flex: 1, textAlign: "center" }]}>
            New{"\n"}Stock
          </Text>
          <Text style={[styles.colText, { flex: 1, textAlign: "center" }]}>
            Purch. price
          </Text>
          <Text style={[styles.colText, { flex: 1, textAlign: "right" }]}>
            MRP
          </Text>
        </View>

        {/* Empty parts area placeholder */}
        {parts.length === 0 && <View style={styles.emptyArea} />}
      </ScrollView>

      {/* Footer: Paid Amount + Total + Save */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerSmLabel}>Paid Amount:</Text>
            <AppInput
              value={paidAmount}
              onChangeText={setPaidAmount}
              keyboardType="numeric"
              style={styles.paidInputCompact}
            />
          </View>
          <View style={styles.footerCenter}>
            <Text style={styles.footerSmLabel}>Total:</Text>
            <Text style={styles.totalText}>₹{total}</Text>
          </View>
          <AppButton
            title="Save Data"
            onPress={() => {}}
            variant="gradient"
            size="sm"
            fullWidth={false}
          />
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
  scrollContent: {
    padding: SIZES.screenPadding,
    paddingBottom: 120,
  },
  row: {
    flexDirection: "row",
    gap: SIZES.sm,
    marginBottom: SIZES.md,
  },
  dateField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.sm + 2,
    gap: SIZES.xs,
  },
  dateText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: SIZES.textSm,
    color: COLORS.textPrimary,
  },
  dateClear: {
    padding: 2,
  },
  invoiceImgRow: {
    alignItems: "flex-end",
    marginBottom: SIZES.sm,
  },
  barcodeRow: {
    flexDirection: "row",
    gap: SIZES.sm,
    marginBottom: SIZES.md,
    justifyContent: "space-between",
  },
  halfBtn: {
    flex: 1,
  },
  columnHeader: {
    flexDirection: "row",
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SIZES.xs,
  },
  colText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.textXs,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  emptyArea: {
    height: 60,
  },
  footer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 90 : 70,
    left: 0,
    right: 0,
    backgroundColor: COLORS.bgCard,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.sm,
    ...SHADOWS.md,
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.md,
  },
  footerLeft: {
    flex: 1.2,
  },
  footerCenter: {
    flex: 1,
  },
  footerSmLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.textXs,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  paidInputCompact: {
    marginBottom: 0,
  },
  totalText: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
  },
});
