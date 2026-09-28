import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { COLORS, FONTS, SIZES, SHADOWS } from "../../utils/constants";
import TopNav from "../../components/ui/TopNav";
import AppInput from "../../components/ui/AppInput";
import AppButton from "../../components/ui/AppButton";
import AppSelect from "../../components/ui/AppSelect";
import { createGarageUser } from "../../api/garageUsers";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROLE_OPTIONS = [
  { value: "GARAGE_OWNER", label: "Garage Owner", icon: "shield-outline" },
  { value: "MECHANIC", label: "Mechanic", icon: "construct-outline" },
  { value: "RECEPTIONIST", label: "Receptionist", icon: "headset-outline" },
  { value: "ACCOUNTANT", label: "Accountant", icon: "calculator-outline" },
];

const INITIAL = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: null,
};

export default function AddGarageUserScreen() {
  const navigation = useNavigation();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone.trim()))
      e.phone = "Enter a valid 10-digit number";
    if (form.email.trim() && !EMAIL_REGEX.test(form.email.trim()))
      e.email = "Enter a valid email address";
    if (!form.role) e.role = "Please select a role";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreateUser = async () => {
    if (submitting || !validate()) return;
    const payload = {
      firstName: form.firstName.trim(),
      ...(form.lastName.trim() && { lastName: form.lastName.trim() }),
      ...(form.email.trim() && { emailId: form.email.trim() }),
      phoneNo: form.phone.trim(),
      role: form.role,
    };
    try {
      setSubmitting(true);
      await createGarageUser(payload);
      Toast.show({ type: "success", text1: "Member added", text2: payload.firstName });
      navigation.goBack();
    } catch (err) {
      // Includes the "endpoint not configured" case — never report a fake success
      Toast.show({
        type: "error",
        text1: "Couldn't add member",
        text2: err?.displayMessage || "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <TopNav title="Add Garage User" transparent={false} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Info */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWrap}>
              <View style={styles.sectionIcon}>{/* person icon */}</View>
            </View>
            <Text style={styles.sectionTitle}>Basic Info</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.rowField}>
              <AppInput
                label="First Name"
                icon="person-outline"
                value={form.firstName}
                onChangeText={set("firstName")}
                placeholder="First name"
                error={errors.firstName}
                accessibilityLabel="First Name"
              />
            </View>
            <View style={styles.rowField}>
              <AppInput
                label="Last Name"
                icon="person-outline"
                value={form.lastName}
                onChangeText={set("lastName")}
                placeholder="Last name"
                accessibilityLabel="Last Name"
              />
            </View>
          </View>

          <AppInput
            label="Email Address"
            icon="mail-outline"
            value={form.email}
            onChangeText={set("email")}
            placeholder="Enter email address"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            accessibilityLabel="Email"
          />

          <AppInput
            label="Phone Number"
            icon="call-outline"
            value={form.phone}
            onChangeText={set("phone")}
            placeholder="10-digit mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            error={errors.phone}
            accessibilityLabel="Phone Number"
          />
        </View>

        {/* Role */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWrap}>
              <View style={styles.sectionIcon} />
            </View>
            <Text style={styles.sectionTitle}>Role & Permissions</Text>
          </View>

          <AppSelect
            label="Assign Role"
            icon="shield-checkmark-outline"
            options={ROLE_OPTIONS}
            value={form.role}
            onChange={set("role")}
            placeholder="Select a role"
            error={errors.role}
          />

          {/* Role hint */}
          {form.role && (
            <View style={styles.roleHint}>
              <View style={styles.roleHintDot} />
              <Text style={styles.roleHintText}>
                {form.role === "GARAGE_OWNER" &&
                  "Full access to all garage settings and data."}
                {form.role === "MECHANIC" &&
                  "Can manage jobs, vehicles and service records."}
                {form.role === "RECEPTIONIST" &&
                  "Can manage customers, bookings and invoices."}
                {form.role === "ACCOUNTANT" &&
                  "Can view and manage financial reports and billing."}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <AppButton
          title="Create Member"
          variant="gradient"
          size="lg"
          onPress={handleCreateUser}
          loading={submitting}
          accessibilityLabel="Create garage member"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    paddingHorizontal: SIZES.screenPadding,
    paddingTop: SIZES.md,
    paddingBottom: 120,
    gap: SIZES.md,
  },

  // Section Card
  sectionCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SIZES.md,
    ...SHADOWS.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.sm,
    marginBottom: SIZES.md,
    paddingBottom: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  sectionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
  },
  sectionTitle: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
  },

  // Side by side fields
  row: {
    flexDirection: "row",
    gap: SIZES.sm,
  },
  rowField: {
    flex: 1,
  },

  // Role hint
  roleHint: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SIZES.sm,
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.sm + 4,
    marginTop: -SIZES.xs,
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
  },
  roleHintDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 5,
  },
  roleHintText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: SIZES.textXs,
    color: COLORS.primaryDark,
    lineHeight: 18,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: SIZES.screenPadding,
    paddingBottom: Platform.OS === "ios" ? 32 : SIZES.md,
  },
});
