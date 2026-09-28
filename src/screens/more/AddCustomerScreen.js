import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES, SHADOWS } from "../../utils/constants";
import TopNav from "../../components/ui/TopNav";
import AppInput from "../../components/ui/AppInput";
import AppButton from "../../components/ui/AppButton";
import { createCustomer } from "../../api/customers";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Section card ─────────────────────────────────────────────────────────────
function SectionCard({ title, icon, children }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionLeft}>
          <View style={styles.sectionIconWrap}>
            <Ionicons name={icon} size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function AddCustomerScreen() {
  const [fullName, setFullName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigation = useNavigation();

  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = "Customer name is required";
    if (!phoneNo.trim()) e.phoneNo = "Phone number is required";
    else if (!/^\d{10}$/.test(phoneNo.trim()))
      e.phoneNo = "Enter a valid 10-digit number";
    if (email.trim() && !EMAIL_REGEX.test(email.trim()))
      e.email = "Enter a valid email address";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async () => {
    if (submitting || !validate()) return;
    const payload = {
      fullName: fullName.trim(),
      phoneNo: phoneNo.trim(),
      emailId: email.trim(),
      address: address.trim(),
      role: "customer",
    };
    try {
      setSubmitting(true);
      await createCustomer(payload);
      Toast.show({ type: "success", text1: "Customer saved", text2: payload.fullName });
      navigation.goBack();
    } catch (err) {
      // Includes the "endpoint not configured" case — never report a fake success
      Toast.show({
        type: "error",
        text1: "Couldn't save customer",
        text2: err?.displayMessage || "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <TopNav title="Add Customer" transparent={false} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Personal Details ── */}
        <SectionCard title="Personal Details" icon="person-outline">
          <AppInput
            label="Full Name *"
            icon="person-outline"
            value={fullName}
            onChangeText={(t) => {
              setFullName(t);
              setErrors((e) => ({ ...e, fullName: null }));
            }}
            placeholder="Enter full name"
            error={errors.fullName}
            autoCapitalize="words"
            accessibilityLabel="Customer full name"
          />
          <AppInput
            label="Phone Number *"
            icon="call-outline"
            value={phoneNo}
            onChangeText={(t) => {
              setPhoneNo(t);
              setErrors((e) => ({ ...e, phoneNo: null }));
            }}
            placeholder="10-digit mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            error={errors.phoneNo}
            accessibilityLabel="Phone number"
          />
          <AppInput
            label="Email Address"
            icon="mail-outline"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setErrors((e) => ({ ...e, email: null }));
            }}
            placeholder="Optional"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            accessibilityLabel="Email address"
          />
          <AppInput
            label="Address"
            icon="location-outline"
            value={address}
            onChangeText={setAddress}
            placeholder="Optional"
            multiline
            numberOfLines={3}
            accessibilityLabel="Address"
          />
        </SectionCard>

        {/* Informational note */}
        <View style={styles.noteCard}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={COLORS.primary}
          />
          <Text style={styles.noteText}>
            After creating the customer, you can add vehicles from the customer
            profile.
          </Text>
        </View>
      </ScrollView>

      {/* ── Floating footer ── */}
      <View style={styles.footer}>
        <AppButton
          title="Create Customer"
          variant="gradient"
          size="lg"
          onPress={handleCreate}
          loading={submitting}
          accessibilityLabel="Create customer"
          accessibilityHint="Saves the new customer record"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: {
    padding: SIZES.screenPadding,
    paddingBottom: 120,
    gap: SIZES.md,
  },

  // ── Section card
  sectionCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: "hidden",
    ...SHADOWS.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.neutral50 || COLORS.bg,
  },
  sectionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.sm,
  },
  sectionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
  },
  sectionBody: {
    padding: SIZES.md,
    paddingBottom: SIZES.sm,
  },

  // ── Info note
  noteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SIZES.sm,
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
    padding: SIZES.md,
  },
  noteText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: SIZES.textSm,
    color: COLORS.primary,
    lineHeight: 20,
  },

  // ── Footer
  footer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.md,
    backgroundColor: "transparent",
  },
});
