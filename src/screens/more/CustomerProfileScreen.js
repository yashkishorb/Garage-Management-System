import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS, FONTS, SIZES, SHADOWS } from "../../utils/constants";
import TopNav from "../../components/ui/TopNav";
import AppInput from "../../components/ui/AppInput";
import AppButton from "../../components/ui/AppButton";
import Avatar from "../../components/ui/Avatar";
import EmptyState from "../../components/ui/EmptyState";

// ─── Info row inside profile card ──────────────────────────────────────────────
function InfoRow({ icon, value, muted }) {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={14} color={COLORS.textMuted} />
      <Text style={[styles.infoText, muted && styles.infoMuted]}>{value}</Text>
    </View>
  );
}

// ─── Vehicle Card ─────────────────────────────────────────────────────────────
function VehicleCard({ vehicle, index }) {
  return (
    <View style={styles.vehicleCard}>
      <View style={styles.vehicleIconWrap}>
        <MaterialCommunityIcons
          name="car-outline"
          size={20}
          color={COLORS.primary}
        />
      </View>
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleName}>
          {vehicle.make} {vehicle.model}
        </Text>
        {vehicle.regNo ? (
          <View style={styles.vehicleMeta}>
            <Ionicons
              name="id-card-outline"
              size={12}
              color={COLORS.textMuted}
            />
            <Text style={styles.vehicleMetaText}>{vehicle.regNo}</Text>
          </View>
        ) : null}
        {vehicle.purchaseDate ? (
          <View style={styles.vehicleMeta}>
            <Ionicons
              name="calendar-outline"
              size={12}
              color={COLORS.textMuted}
            />
            <Text style={styles.vehicleMetaText}>{vehicle.purchaseDate}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.vehicleIndexWrap}>
        <Text style={styles.vehicleIndex}>{index}</Text>
      </View>
    </View>
  );
}

// ─── Add Vehicle Bottom Sheet Modal ───────────────────────────────────────────
function AddVehicleModal({ visible, onClose, onSave }) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [regNo, setRegNo] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [engineNo, setEngineNo] = useState("");
  const [vin, setVin] = useState("");
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [insuranceExpiry, setInsuranceExpiry] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setMake("");
    setModel("");
    setRegNo("");
    setPurchaseDate("");
    setEngineNo("");
    setVin("");
    setInsuranceProvider("");
    setPolicyNumber("");
    setInsuranceExpiry("");
    setShowMore(false);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = () => {
    const e = {};
    if (!make.trim()) e.make = "Make is required";
    if (!model.trim()) e.model = "Model is required";
    if (!regNo.trim()) e.regNo = "Registration number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      id: Date.now().toString(),
      make: make.trim(),
      model: model.trim(),
      regNo: regNo.trim(),
      purchaseDate: purchaseDate.trim(),
      engineNo: engineNo.trim(),
      vin: vin.trim(),
      insuranceProvider: insuranceProvider.trim(),
      policyNumber: policyNumber.trim(),
      insuranceExpiry: insuranceExpiry.trim(),
    });
    resetForm();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalKAV}
        >
          <View style={styles.modalSheet}>
            {/* Drag handle */}
            <View style={styles.dragHandle} />

            {/* Modal header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={styles.modalIconWrap}>
                  <MaterialCommunityIcons
                    name="car-outline"
                    size={18}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.modalTitle}>Add Vehicle</Text>
              </View>
              <TouchableOpacity
                onPress={handleClose}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Close modal"
                accessibilityRole="button"
              >
                <Ionicons
                  name="close-circle"
                  size={24}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalScroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Required fields */}
              <Text style={styles.fieldGroupLabel}>BASIC DETAILS</Text>

              <AppInput
                label="Make *"
                icon="medal-outline"
                value={make}
                onChangeText={(t) => {
                  setMake(t);
                  setErrors((e) => ({ ...e, make: null }));
                }}
                placeholder="e.g. Maruti, Honda"
                error={errors.make}
                autoCapitalize="words"
                accessibilityLabel="Vehicle make"
              />
              <AppInput
                label="Model *"
                icon="car-sport-outline"
                value={model}
                onChangeText={(t) => {
                  setModel(t);
                  setErrors((e) => ({ ...e, model: null }));
                }}
                placeholder="e.g. Swift, Activa"
                error={errors.model}
                autoCapitalize="words"
                accessibilityLabel="Vehicle model"
              />
              <AppInput
                label="Registration Number *"
                icon="id-card-outline"
                value={regNo}
                onChangeText={(t) => {
                  setRegNo(t);
                  setErrors((e) => ({ ...e, regNo: null }));
                }}
                placeholder="MH12AB1234"
                autoCapitalize="characters"
                error={errors.regNo}
                accessibilityLabel="Registration number"
              />
              <AppInput
                label="Purchase Date"
                icon="calendar-outline"
                value={purchaseDate}
                onChangeText={setPurchaseDate}
                placeholder="DD/MM/YYYY"
                accessibilityLabel="Purchase date"
              />

              {/* Toggle more fields */}
              <TouchableOpacity
                style={styles.moreToggle}
                onPress={() => setShowMore((p) => !p)}
                activeOpacity={0.7}
                accessibilityRole="button"
              >
                <Text style={styles.moreToggleText}>
                  {showMore ? "Hide advanced fields" : "Show advanced fields"}
                </Text>
                <Ionicons
                  name={showMore ? "chevron-up" : "chevron-down"}
                  size={14}
                  color={COLORS.primary}
                />
              </TouchableOpacity>

              {showMore && (
                <>
                  <Text
                    style={[styles.fieldGroupLabel, { marginTop: SIZES.sm }]}
                  >
                    ADVANCED DETAILS
                  </Text>
                  <AppInput
                    label="Engine Number"
                    icon="settings-outline"
                    value={engineNo}
                    onChangeText={setEngineNo}
                    placeholder="Optional"
                    autoCapitalize="characters"
                    accessibilityLabel="Engine number"
                  />
                  <AppInput
                    label="VIN / Chassis Number"
                    icon="barcode-outline"
                    value={vin}
                    onChangeText={setVin}
                    placeholder="Optional"
                    autoCapitalize="characters"
                    accessibilityLabel="VIN or chassis number"
                  />
                  <Text
                    style={[styles.fieldGroupLabel, { marginTop: SIZES.xs }]}
                  >
                    INSURANCE
                  </Text>
                  <AppInput
                    label="Insurance Provider"
                    icon="shield-outline"
                    value={insuranceProvider}
                    onChangeText={setInsuranceProvider}
                    placeholder="Optional"
                    accessibilityLabel="Insurance provider"
                  />
                  <AppInput
                    label="Policy Number"
                    icon="document-outline"
                    value={policyNumber}
                    onChangeText={setPolicyNumber}
                    placeholder="Optional"
                    accessibilityLabel="Policy number"
                  />
                  <AppInput
                    label="Insurance Expiry"
                    icon="time-outline"
                    value={insuranceExpiry}
                    onChangeText={setInsuranceExpiry}
                    placeholder="DD/MM/YYYY"
                    accessibilityLabel="Insurance expiry date"
                  />
                </>
              )}
            </ScrollView>

            {/* Save button */}
            <View style={styles.modalFooter}>
              <AppButton
                title="Save Vehicle"
                variant="gradient"
                size="lg"
                onPress={handleSave}
                accessibilityLabel="Save vehicle"
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function CustomerProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const customer = route.params?.customer ?? {
    id: "preview",
    name: "Unknown Customer",
    mobile: "—",
    email: "",
    address: "",
    regNo: "",
  };

  const [vehicles, setVehicles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddVehicle = (vehicle) => {
    setVehicles((prev) => [...prev, vehicle]);
    setModalVisible(false);
  };

  const rightElement = (
    <TouchableOpacity
      style={styles.addVehicleBtn}
      onPress={() => setModalVisible(true)}
      activeOpacity={0.8}
      accessibilityLabel="Add vehicle"
      accessibilityRole="button"
    >
      <Ionicons name="add" size={16} color={COLORS.primary} />
      <Text style={styles.addVehicleBtnText}>Add Vehicle</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <TopNav
        title="Customer Profile"
        transparent={false}
        showBack
        rightElement={rightElement}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Profile Card ── */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <Avatar name={customer.name} size="lg" />
            <View style={styles.profileMeta}>
              <Text style={styles.profileName} numberOfLines={1}>
                {customer.name}
              </Text>
              <InfoRow icon="call-outline" value={customer.mobile} />
              <InfoRow icon="mail-outline" value={customer.email} />
            </View>
          </View>
          {customer.address ? (
            <View style={styles.addressRow}>
              <Ionicons
                name="location-outline"
                size={14}
                color={COLORS.textMuted}
              />
              <Text style={styles.addressText} numberOfLines={2}>
                {customer.address}
              </Text>
            </View>
          ) : null}
        </View>

        {/* ── Vehicles Section ── */}
        <View style={styles.vehiclesSection}>
          <View style={styles.vehiclesSectionHeader}>
            <View style={styles.vehiclesSectionLeft}>
              <MaterialCommunityIcons
                name="car-multiple"
                size={18}
                color={COLORS.primary}
              />
              <Text style={styles.vehiclesSectionTitle}>Vehicles</Text>
              {vehicles.length > 0 && (
                <View style={styles.vehicleCountBadge}>
                  <Text style={styles.vehicleCountText}>{vehicles.length}</Text>
                </View>
              )}
            </View>
          </View>

          {vehicles.length === 0 ? (
            <EmptyState
              emoji="🚗"
              title="No vehicles added"
              description="Tap 'Add Vehicle' to register a vehicle for this customer."
            />
          ) : (
            <View style={styles.vehicleList}>
              {vehicles.map((v, idx) => (
                <VehicleCard key={v.id} vehicle={v} index={idx + 1} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Add Vehicle Modal ── */}
      <AddVehicleModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddVehicle}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: {
    padding: SIZES.screenPadding,
    paddingBottom: 120,
    gap: SIZES.md,
  },

  // ── Edit button
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: SIZES.sm + 2,
    paddingVertical: 5,
  },
  editBtnText: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textXs,
    color: COLORS.primary,
  },

  // ── Profile card
  profileCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SIZES.md,
    gap: SIZES.sm,
    ...SHADOWS.sm,
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.md,
  },
  profileMeta: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.textMd,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  infoText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.textSm,
    color: COLORS.textSecondary,
  },
  infoMuted: {
    color: COLORS.textMuted,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
    paddingTop: SIZES.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  addressText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: SIZES.textSm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  // ── Vehicles section
  vehiclesSection: {
    backgroundColor: COLORS.bgCard,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: "hidden",
    ...SHADOWS.sm,
  },
  vehiclesSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.neutral50 || COLORS.bg,
  },
  vehiclesSectionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.sm,
  },
  vehiclesSectionTitle: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
  },
  vehicleCountBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  vehicleCountText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.textXs,
    color: COLORS.primary,
  },
  addVehicleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: SIZES.sm + 2,
    paddingVertical: 5,
  },
  addVehicleBtnText: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textXs,
    color: COLORS.primary,
  },
  vehicleList: {
    padding: SIZES.md,
    gap: SIZES.sm,
  },

  // ── Vehicle card
  vehicleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.md,
    backgroundColor: COLORS.bgSection,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SIZES.md,
  },
  vehicleIconWrap: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleInfo: {
    flex: 1,
    gap: 3,
  },
  vehicleName: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
  },
  vehicleMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  vehicleMetaText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.textXs,
    color: COLORS.textMuted,
  },
  vehicleIndexWrap: {
    width: 24,
    height: 24,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.bgInput,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  vehicleIndex: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.textXs,
    color: COLORS.textSecondary,
  },

  // ── Modal overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalKAV: {
    width: "100%",
  },
  modalSheet: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: SIZES.radiusXl,
    borderTopRightRadius: SIZES.radiusXl,
    paddingTop: SIZES.sm,
    paddingBottom: Platform.OS === "ios" ? 34 : SIZES.md,
    maxHeight: "100%",
    ...SHADOWS.lg,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.borderLight,
    alignSelf: "center",
    marginBottom: SIZES.md,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.screenPadding,
    paddingBottom: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  modalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.sm,
  },
  modalIconWrap: {
    width: 32,
    height: 32,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.textMd,
    color: COLORS.textPrimary,
  },
  modalScroll: {
    paddingHorizontal: SIZES.screenPadding,
    paddingTop: SIZES.md,
    paddingBottom: SIZES.lg,
  },
  fieldGroupLabel: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textXs,
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: SIZES.sm,
    textTransform: "uppercase",
  },
  moreToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: SIZES.sm,
    marginBottom: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.primaryLight,
  },
  moreToggleText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.textSm,
    color: COLORS.primary,
  },
  modalFooter: {
    paddingHorizontal: SIZES.screenPadding,
    paddingTop: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
});
