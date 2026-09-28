import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { COLORS, FONTS, SIZES, SHADOWS } from "../../utils/constants";
import TopNav from "../../components/ui/TopNav";

function InfoRow({ icon, label, value, isLast }) {
  return (
    <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
      <View style={styles.infoIconWrap}>
        <Ionicons name={icon} size={16} color={COLORS.primary} />
      </View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || "—"}</Text>
      </View>
    </View>
  );
}

export default function MyGarageProfileScreen() {
  const navigation = useNavigation();
  // Live garage data from Redux (set after OTP verify or after editing)
  const garage = useSelector((state) => state.auth.garage);

  const INFO_FIELDS = [
    {
      label: "Garage Name",
      value: garage?.garageName,
      icon: "storefront-outline",
    },
    {
      label: "Owner Name",
      value: garage?.garageOwnerName,
      icon: "person-outline",
    },
    {
      label: "Contact No",
      value: garage?.garageContactNumber,
      icon: "call-outline",
    },
    { label: "Email", value: garage?.emailId, icon: "mail-outline" },
    {
      label: "Address",
      value: garage?.garageAddress,
      icon: "location-outline",
    },
    { label: "Garage Type", value: garage?.garageType, icon: "car-outline" },
    { label: "State", value: garage?.state, icon: "map-outline" },
  ];

  const logoUri = garage?.garageLogo || null;
  const garageName = garage?.garageName || "My Garage";
  const garageAddress = garage?.garageAddress || "";

  return (
    <View style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* TopNav floats over gradient */}
        <TopNav
          title="My Garage Profile"
          showBack={true}
          transparent
          dark={false}
        />

        {/* Hero */}
        <LinearGradient
          colors={COLORS.gradPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroContent}>
            {/* Logo */}
            <View style={styles.logoWrap}>
              {logoUri ? (
                <Image source={{ uri: logoUri }} style={styles.logoImage} />
              ) : (
                <View style={[styles.logoImage, styles.logoPlaceholder]}>
                  <Ionicons
                    name="storefront-outline"
                    size={36}
                    color={COLORS.white}
                  />
                </View>
              )}
              <View style={styles.logoBadge}>
                <Ionicons name="checkmark" size={10} color={COLORS.white} />
              </View>
            </View>
            <Text style={styles.garageName}>{garageName}</Text>
            <View style={styles.heroMeta}>
              <Ionicons
                name="location-outline"
                size={13}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.heroMetaText}>{garageAddress}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Stats Strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>128</Text>
            <Text style={styles.statLabel}>Jobs Done</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8★</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3 yrs</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Garage Details</Text>
            <TouchableOpacity
              style={styles.editBtn}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("GarageDetails", { garage })}
              accessibilityLabel="Edit Garage Profile"
              accessibilityRole="button"
            >
              <Ionicons
                name="pencil-outline"
                size={13}
                color={COLORS.primary}
              />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {INFO_FIELDS.map((field, index) => (
              <InfoRow
                key={field.label}
                icon={field.icon}
                label={field.label}
                value={field.value}
                isLast={index === INFO_FIELDS.length - 1}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingBottom: 80,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: SIZES.xxl,
  },

  // Hero
  hero: {
    marginTop: -96,
    paddingTop: 96,
    paddingBottom: SIZES.xxl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
  },
  heroContent: {
    alignItems: "center",
    paddingHorizontal: SIZES.screenPadding,
  },
  logoWrap: {
    position: "relative",
    marginBottom: SIZES.sm,
  },
  logoImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.6)",
  },
  logoPlaceholder: {
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primaryDark,
    borderWidth: 2,
    borderColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  garageName: {
    fontFamily: FONTS.extrabold,
    fontSize: 24,
    color: COLORS.white,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  heroMetaText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.textSm,
    color: "rgba(255,255,255,0.8)",
  },

  // Stats Strip
  statsStrip: {
    flexDirection: "row",
    backgroundColor: COLORS.bgCard,
    marginHorizontal: SIZES.screenPadding,
    marginTop: -20,
    borderRadius: SIZES.radiusLg,
    paddingVertical: SIZES.md,
    ...SHADOWS.md,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.textMd,
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.textXs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.borderLight,
  },

  // Sections
  section: {
    marginTop: SIZES.lg,
    paddingHorizontal: SIZES.screenPadding,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.sm,
  },
  sectionTitle: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: SIZES.sm + 4,
    paddingVertical: 5,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.primaryLight,
  },
  editBtnText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.textXs,
    color: COLORS.primary,
  },

  // Card
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: "hidden",
    ...SHADOWS.sm,
  },

  // Info Row
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm + 4,
    gap: SIZES.sm,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.textXs,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textSm,
    color: COLORS.textPrimary,
  },
});
