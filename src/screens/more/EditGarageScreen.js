import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS, FONTS, SIZES, SHADOWS } from "../../utils/constants";
import TopNav from "../../components/ui/TopNav";
import AppInput from "../../components/ui/AppInput";
import AppButton from "../../components/ui/AppButton";
import AppRadioGroup from "../../components/ui/AppRadioGroup";
import AppSelect from "../../components/ui/AppSelect";
import AppToggle from "../../components/ui/AppToggle";

const GARAGE_DATA = {
  type: "two",
  name: "GarBlaz",
  owner: "Dnyaneshwar",
  email: "dk.kamblednyaneshwar@gmail.com",
  contact: "8766492553",
  state: "Maharashtra",
  address: "Rohidas, Nagar",
  smsSender: "GARAGE",
  googleBusinessLink: "",
  logo: "https://via.placeholder.com/150",
  gstApplicable: false,
};

function SectionCard({ title, icon, children }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionCardHeader}>
        <View style={styles.sectionIconWrap}>
          <Ionicons name={icon} size={15} color={COLORS.primary} />
        </View>
        <Text style={styles.sectionCardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default function EditGarageScreen() {
  const navigation = useNavigation();
  const [data, setData] = useState(GARAGE_DATA);

  const set = (key) => (val) => setData((prev) => ({ ...prev, [key]: val }));

  const handleSave = () => {
    Alert.alert(
      "Garage Updated",
      "Garage details have been saved successfully.",
      [{ text: "OK", onPress: () => navigation.goBack() }],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <TopNav title="Edit Garage" transparent={false} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Garage Type ── */}
        <SectionCard title="Garage Type" icon="construct-outline">
          <AppRadioGroup
            options={[
              { value: "two", label: "Two Wheeler", icon: "bicycle-outline" },
              { value: "four", label: "Four Wheeler", icon: "car-outline" },
            ]}
            value={data.type}
            onChange={set("type")}
            direction="row"
          />
        </SectionCard>

        {/* ── Basic Info ── */}
        <SectionCard title="Basic Info" icon="information-circle-outline">
          <AppInput
            label="Garage Name"
            icon="storefront-outline"
            value={data.name}
            onChangeText={set("name")}
            placeholder="Enter garage name"
          />
          <AppInput
            label="Owner Name"
            icon="person-outline"
            value={data.owner}
            onChangeText={set("owner")}
            placeholder="Enter owner name"
          />
          <AppInput
            label="Contact Number"
            icon="call-outline"
            value={data.contact}
            onChangeText={set("contact")}
            placeholder="10-digit mobile number"
            keyboardType="phone-pad"
          />
          <AppInput
            label="Email Address"
            icon="mail-outline"
            value={data.email}
            onChangeText={set("email")}
            placeholder="Enter email address"
            keyboardType="email-address"
          />
        </SectionCard>

        {/* ── Location ── */}
        <SectionCard title="Location" icon="location-outline">
          <AppSelect
            label="State"
            icon="map-outline"
            options={[
              "Andhra Pradesh",
              "Arunachal Pradesh",
              "Assam",
              "Bihar",
              "Chhattisgarh",
              "Goa",
              "Gujarat",
              "Haryana",
              "Himachal Pradesh",
              "Jharkhand",
              "Karnataka",
              "Kerala",
              "Madhya Pradesh",
              "Maharashtra",
              "Manipur",
              "Meghalaya",
              "Mizoram",
              "Nagaland",
              "Odisha",
              "Punjab",
              "Rajasthan",
              "Sikkim",
              "Tamil Nadu",
              "Telangana",
              "Tripura",
              "Uttar Pradesh",
              "Uttarakhand",
              "West Bengal",
            ].map((s) => ({ value: s, label: s }))}
            value={data.state}
            onChange={set("state")}
            placeholder="Select State"
          />

          <AppInput
            label="Address"
            icon="location-outline"
            value={data.address}
            onChangeText={set("address")}
            placeholder="Enter full address"
          />
        </SectionCard>

        {/* ── Branding ── */}
        <SectionCard title="Branding" icon="color-palette-outline">
          {/* Logo */}
          <View style={styles.logoSection}>
            <View style={styles.logoPreviewWrap}>
              <Image source={{ uri: data.logo }} style={styles.logoPreview} />
              <TouchableOpacity
                style={styles.logoCameraBtn}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={14} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.logoMeta}>
              <Text style={styles.logoMetaTitle}>Garage Logo</Text>
              <Text style={styles.logoMetaSub}>Recommended: 512×512 PNG</Text>
              <TouchableOpacity
                style={styles.updateLogoBtn}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="cloud-upload-outline"
                  size={14}
                  color={COLORS.primary}
                />
                <Text style={styles.updateLogoText}>Upload New Logo</Text>
              </TouchableOpacity>
            </View>
          </View>

          <AppInput
            label="SMS Sender Name"
            icon="chatbubble-outline"
            value={data.smsSender}
            onChangeText={set("smsSender")}
            placeholder="Sender name"
            editable={false}
          />
          <AppInput
            label="Google My Business Link"
            icon="link-outline"
            value={data.googleBusinessLink}
            onChangeText={set("googleBusinessLink")}
            placeholder="Paste your Google Business URL"
            keyboardType="url"
          />
        </SectionCard>

        {/* ── Tax ── */}
        <SectionCard title="Tax Settings" icon="receipt-outline">
          <AppToggle
            label="GST Applicable"
            sublabel="Enable if your garage is GST registered"
            icon="document-text-outline"
            value={data.gstApplicable}
            onChange={set("gstApplicable")}
          />
        </SectionCard>
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <AppButton
          title="Save Changes"
          variant="gradient"
          size="lg"
          onPress={handleSave}
          accessibilityLabel="Save Garage Details"
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
    paddingBottom: 160,
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
  sectionCardHeader: {
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
  sectionCardTitle: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
  },

  // Logo
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.md,
    marginBottom: SIZES.md,
    padding: SIZES.md,
    backgroundColor: COLORS.bg,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  logoPreviewWrap: {
    position: "relative",
  },
  logoPreview: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  logoCameraBtn: {
    position: "absolute",
    bottom: -6,
    right: -6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  logoMeta: {
    flex: 1,
    gap: 4,
  },
  logoMetaTitle: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
  },
  logoMetaSub: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.textXs,
    color: COLORS.textMuted,
  },
  updateLogoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: SIZES.sm + 4,
    paddingVertical: 5,
    backgroundColor: COLORS.primaryLight,
  },
  updateLogoText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.textXs,
    color: COLORS.primary,
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
