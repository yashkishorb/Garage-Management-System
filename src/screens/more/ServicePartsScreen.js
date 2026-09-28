import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES, SHADOWS } from "../../utils/constants";
import TopNav from "../../components/ui/TopNav";
import AppInput from "../../components/ui/AppInput";
import AppButton from "../../components/ui/AppButton";
import AppRadioGroup from "../../components/ui/AppRadioGroup";
import AppSelect from "../../components/ui/AppSelect";
import AppCheckbox from "../../components/ui/AppCheckbox";
import AppToggle from "../../components/ui/AppToggle";
import EmptyState from "../../components/ui/EmptyState";
import Badge from "../../components/ui/Badge";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_SERVICES = [
  {
    id: "1",
    no: "S001",
    name: "Air filter hose Cleaning",
    mrp: 150,
    category: "Cleaning",
  },
  {
    id: "2",
    no: "S002",
    name: "Engine Oil Check",
    mrp: 0,
    category: "Inspection",
  },
  { id: "3", no: "S003", name: "Adjust idle", mrp: 100, category: "Tuning" },
  {
    id: "4",
    no: "S004",
    name: "Adjust the high beam",
    mrp: 80,
    category: "Electrical",
  },
  {
    id: "5",
    no: "S005",
    name: "Brake cable end cleaning, adjust and lubricate.",
    mrp: 200,
    category: "Brakes",
  },
  {
    id: "6",
    no: "S006",
    name: "Brake caliper pin cleaning and lubrication",
    mrp: 250,
    category: "Brakes",
  },
  {
    id: "7",
    no: "S007",
    name: "Brake disc cleaning",
    mrp: 180,
    category: "Brakes",
  },
  {
    id: "8",
    no: "S008",
    name: "Brake fluid topup",
    mrp: 120,
    category: "Brakes",
  },
  {
    id: "9",
    no: "S009",
    name: "Brake lever cleaning, lubrication and adjust free play",
    mrp: 200,
    category: "Brakes",
  },
  {
    id: "10",
    no: "S010",
    name: "Brake links cleaning, lubrication and adjusting",
    mrp: 180,
    category: "Brakes",
  },
];

const MOCK_PARTS = [
  {
    id: "P001",
    no: "P001",
    name: "Engine Oil 10W30 — 1L",
    mrp: 320,
    stock: 12,
  },
  {
    id: "P002",
    no: "P002",
    name: "Air Filter — Honda Activa",
    mrp: 450,
    stock: 5,
  },
  {
    id: "P003",
    no: "P003",
    name: "Brake Pads Set — Universal",
    mrp: 780,
    stock: 8,
  },
];

const SERVICE_CATEGORIES = [
  "Cleaning",
  "Inspection",
  "Tuning",
  "Electrical",
  "Brakes",
  "Engine",
  "Suspension",
  "Tyres",
  "AC",
  "Other",
].map((v) => ({ value: v, label: v }));

const PARTS_CATEGORIES = [
  "Engine",
  "Brakes",
  "Suspension",
  "Electrical",
  "Body",
  "Filters",
  "Tyres & Wheels",
  "Transmission",
  "AC",
  "Other",
].map((v) => ({ value: v, label: v }));

const MANUFACTURERS = [
  "Hero",
  "Honda",
  "TVS",
  "Bajaj",
  "Yamaha",
  "Suzuki",
  "Royal Enfield",
  "KTM",
  "Kawasaki",
  "Other",
].map((v) => ({ value: v, label: v }));

const APPLICABILITY_OPTIONS = [
  { value: "generic", label: "Generic (Applicable for all Models)" },
  { value: "specific", label: "Specific for Vehicle Brand(s) and/or Model(s)" },
];

const TABS = [
  { id: "SERVICES", label: "Services", icon: "construct-outline" },
  { id: "PARTS", label: "Parts", icon: "cube-outline" },
];

// ─── Applicable Picker Row ────────────────────────────────────────────────────
function ApplicablePickerRow({ label, count = 0, onPress }) {
  return (
    <TouchableOpacity
      style={styles.applicableRow}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <Text style={styles.applicableLabel}>{label}</Text>
      <View style={styles.applicableRight}>
        {count > 0 && (
          <View style={styles.applicableCountBadge}>
            <Text style={styles.applicableCountText}>{count}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────
function ModalShell({ visible, title, onClose, children }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: COLORS.bg }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity
            onPress={onClose}
            style={styles.modalClose}
            accessibilityLabel="Close"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.modalDivider} />

        <ScrollView
          contentContainerStyle={styles.modalBody}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Specific Applicability Section ──────────────────────────────────────────
function SpecificApplicability({ brands, models }) {
  return (
    <View style={styles.applicableSection}>
      <ApplicablePickerRow
        label="Choose Applicable Brands"
        count={brands.length}
        onPress={() => Alert.alert("Brands", "Brand picker coming soon")}
      />
      <View style={styles.applicableDivider} />
      <ApplicablePickerRow
        label="Choose Applicable Models"
        count={models.length}
        onPress={() => Alert.alert("Models", "Model picker coming soon")}
      />
    </View>
  );
}

// ─── Add Service Modal ────────────────────────────────────────────────────────
const SERVICE_INIT = {
  name: "",
  mrp: "",
  serviceNo: "",
  category: null,
  applicability: "generic",
  brands: [],
  models: [],
};

function AddServiceModal({ visible, onClose, onAdd }) {
  const [form, setForm] = useState(SERVICE_INIT);
  const [errors, setErrors] = useState({});

  const set = (key) => (val) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Service name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    onAdd(form);
    setForm(SERVICE_INIT);
    setErrors({});
    onClose();
  };

  return (
    <ModalShell title="Add New Service" visible={visible} onClose={onClose}>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionCardTitle}>Service Details</Text>

        <AppInput
          label="Service Name"
          icon="construct-outline"
          placeholder="e.g. Engine Oil Change"
          value={form.name}
          onChangeText={set("name")}
          error={errors.name}
          accessibilityLabel="Service name"
        />

        <View style={styles.rowFields}>
          <View style={styles.rowField}>
            <AppInput
              label="Price (MRP)"
              icon="pricetag-outline"
              placeholder="0.00"
              value={form.mrp}
              onChangeText={set("mrp")}
              keyboardType="numeric"
              accessibilityLabel="Price MRP"
            />
          </View>
          <View style={styles.rowField}>
            <AppInput
              label="Service No."
              icon="barcode-outline"
              placeholder="Optional"
              value={form.serviceNo}
              onChangeText={set("serviceNo")}
              accessibilityLabel="Service number"
            />
          </View>
        </View>

        <AppSelect
          label="Category"
          icon="grid-outline"
          placeholder="Select category"
          options={SERVICE_CATEGORIES}
          value={form.category}
          onChange={set("category")}
        />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionCardTitle}>Applicability</Text>
        <AppRadioGroup
          options={APPLICABILITY_OPTIONS}
          value={form.applicability}
          onChange={set("applicability")}
          direction="column"
        />
        {form.applicability === "specific" && (
          <SpecificApplicability brands={form.brands} models={form.models} />
        )}
      </View>

      <AppButton
        title="Add Service"
        variant="gradient"
        size="lg"
        onPress={handleAdd}
      />
    </ModalShell>
  );
}

// ─── Add Part Modal ───────────────────────────────────────────────────────────
const PART_INIT = {
  name: "",
  mrp: "",
  purchasePrice: "",
  partNo: "",
  category: null,
  manufacturer: null,
  applicability: "generic",
  brands: [],
  models: [],
  manageInventory: false,
};

function AddPartModal({ visible, onClose, onAdd }) {
  const [form, setForm] = useState(PART_INIT);
  const [errors, setErrors] = useState({});

  const set = (key) => (val) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Part name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    onAdd(form);
    setForm(PART_INIT);
    setErrors({});
    onClose();
  };

  return (
    <ModalShell title="Add New Part" visible={visible} onClose={onClose}>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionCardTitle}>Part Details</Text>

        <AppInput
          label="Part Name"
          icon="cube-outline"
          placeholder="e.g. Engine Oil 10W30"
          value={form.name}
          onChangeText={set("name")}
          error={errors.name}
          accessibilityLabel="Part name"
        />

        <View style={styles.rowFields}>
          <View style={styles.rowField}>
            <AppInput
              label="MRP"
              icon="pricetag-outline"
              placeholder="0.00"
              value={form.mrp}
              onChangeText={set("mrp")}
              keyboardType="numeric"
              accessibilityLabel="MRP"
            />
          </View>
          <View style={styles.rowField}>
            <AppInput
              label="Purchase Price (GST)"
              icon="receipt-outline"
              placeholder="0.00"
              value={form.purchasePrice}
              onChangeText={set("purchasePrice")}
              keyboardType="numeric"
              accessibilityLabel="Purchase price with GST"
            />
          </View>
        </View>

        <AppInput
          label="Part No."
          icon="barcode-outline"
          placeholder="Optional"
          value={form.partNo}
          onChangeText={set("partNo")}
          accessibilityLabel="Part number"
        />

        <AppSelect
          label="Category"
          icon="grid-outline"
          placeholder="Select category"
          options={PARTS_CATEGORIES}
          value={form.category}
          onChange={set("category")}
        />

        <AppSelect
          label="Manufacturer"
          icon="business-outline"
          placeholder="Select manufacturer"
          options={MANUFACTURERS}
          value={form.manufacturer}
          onChange={set("manufacturer")}
        />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionCardTitle}>Applicability</Text>
        <AppRadioGroup
          options={APPLICABILITY_OPTIONS}
          value={form.applicability}
          onChange={set("applicability")}
          direction="column"
        />
        {form.applicability === "specific" && (
          <SpecificApplicability brands={form.brands} models={form.models} />
        )}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionCardTitle}>Inventory</Text>
        <AppToggle
          label="Manage Inventory"
          sublabel="Track stock levels for this part"
          icon="archive-outline"
          value={form.manageInventory}
          onChange={set("manageInventory")}
        />
      </View>

      <AppButton
        title="Add Part"
        variant="gradient"
        size="lg"
        onPress={handleAdd}
      />
    </ModalShell>
  );
}

// ─── Service Row ──────────────────────────────────────────────────────────────
function ServiceRow({ item, isLast, onEdit }) {
  return (
    <View style={[styles.tableRow, isLast && styles.tableRowLast]}>
      <View style={styles.tableRowMain}>
        <Text style={styles.tableNoText}>{item.no}</Text>
        <Text style={styles.tableNameText} numberOfLines={2}>
          {item.name}
        </Text>
        {item.category ? (
          <Badge label={item.category} variant="info" size="sm" />
        ) : null}
      </View>
      <Text style={styles.tableMrpText}>
        {item.mrp > 0 ? `₹${item.mrp}` : "—"}
      </Text>
      <TouchableOpacity
        onPress={() => onEdit(item)}
        style={styles.editBtn}
        activeOpacity={0.7}
        accessibilityLabel={`Edit ${item.name}`}
        accessibilityRole="button"
      >
        <Ionicons name="create-outline" size={18} color={COLORS.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

// ─── Part Row ─────────────────────────────────────────────────────────────────
function PartRow({ item, isLast, onEdit }) {
  return (
    <View style={[styles.tableRow, isLast && styles.tableRowLast]}>
      <View style={styles.tableRowMain}>
        <Text style={styles.tableNoText}>{item.no}</Text>
        <Text style={styles.tableNameText} numberOfLines={2}>
          {item.name}
        </Text>
      </View>
      <View style={styles.partRight}>
        <Text style={styles.tableMrpText}>
          {item.mrp > 0 ? `₹${item.mrp}` : "—"}
        </Text>
        <Badge
          label={`Qty ${item.stock}`}
          variant={item.stock <= 5 ? "error" : "success"}
          size="sm"
        />
      </View>
      <TouchableOpacity
        onPress={() => onEdit(item)}
        style={styles.editBtn}
        activeOpacity={0.7}
        accessibilityLabel={`Edit ${item.name}`}
        accessibilityRole="button"
      >
        <Ionicons name="create-outline" size={18} color={COLORS.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ServicePartsScreen() {
  const [activeTab, setActiveTab] = useState("SERVICES");
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState(MOCK_SERVICES);
  const [parts, setParts] = useState(MOCK_PARTS);
  const [showAddService, setShowAddService] = useState(false);
  const [showAddPart, setShowAddPart] = useState(false);

  const isServices = activeTab === "SERVICES";

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.no.toLowerCase().includes(q) ||
        (s.category || "").toLowerCase().includes(q),
    );
  }, [services, searchQuery]);

  const filteredParts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return parts;
    return parts.filter(
      (p) => p.name.toLowerCase().includes(q) || p.no.toLowerCase().includes(q),
    );
  }, [parts, searchQuery]);

  const handleAddService = (form) => {
    setServices((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        no: form.serviceNo || `S${String(prev.length + 1).padStart(3, "0")}`,
        name: form.name,
        mrp: parseFloat(form.mrp) || 0,
        category: form.category || "",
      },
    ]);
  };

  const handleAddPart = (form) => {
    setParts((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        no: form.partNo || `P${String(prev.length + 1).padStart(3, "0")}`,
        name: form.name,
        mrp: parseFloat(form.mrp) || 0,
        stock: 0,
      },
    ]);
  };

  const data = isServices ? filteredServices : filteredParts;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <TopNav
        title="Services & Parts"
        transparent={false}
        rightElement={
          <TouchableOpacity
            style={styles.filterBtn}
            accessibilityLabel="Filter"
            accessibilityRole="button"
          >
            <Ionicons
              name="filter-outline"
              size={20}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
        }
      />

      {/* Tabs */}
      <View style={styles.tabsBar}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => {
                setActiveTab(tab.id);
                setSearchQuery("");
              }}
              activeOpacity={0.8}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={tab.label}
            >
              <Ionicons
                name={tab.icon}
                size={15}
                color={active ? COLORS.primary : COLORS.textMuted}
              />
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {tab.label}
              </Text>
              {/* Count pill */}
              <View style={[styles.tabCount, active && styles.tabCountActive]}>
                <Text
                  style={[
                    styles.tabCountText,
                    active && styles.tabCountTextActive,
                  ]}
                >
                  {tab.id === "SERVICES" ? services.length : parts.length}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Search + Action bar */}
      <View style={styles.topBar}>
        <View style={styles.searchWrap}>
          <AppInput
            icon="search-outline"
            placeholder={`Search ${isServices ? "services" : "parts"}…`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel={`Search ${activeTab.toLowerCase()}`}
          />
        </View>
        <View style={styles.topBarActions}>
          <TouchableOpacity
            style={styles.csvBtn}
            onPress={() => Alert.alert("Upload CSV", "CSV upload coming soon")}
            activeOpacity={0.8}
            accessibilityLabel="Upload CSV"
            accessibilityRole="button"
          >
            <Ionicons
              name="cloud-upload-outline"
              size={15}
              color={COLORS.primary}
            />
            <Text style={styles.csvText}>CSV</Text>
          </TouchableOpacity>

          <AppButton
            title={isServices ? "+ Service" : "+ Part"}
            variant="gradient"
            size="sm"
            onPress={() =>
              isServices ? setShowAddService(true) : setShowAddPart(true)
            }
          />
        </View>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.colHead, { flex: 3 }]}>
          ({isServices ? "No." : "No."}) Name
        </Text>
        <Text style={[styles.colHead, { width: 60, textAlign: "right" }]}>
          MRP
        </Text>
        <Text style={[styles.colHead, { width: 44, textAlign: "right" }]}>
          Edit
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) =>
          isServices ? (
            <ServiceRow
              item={item}
              isLast={index === data.length - 1}
              onEdit={() => Alert.alert("Edit", `Editing ${item.name}`)}
            />
          ) : (
            <PartRow
              item={item}
              isLast={index === data.length - 1}
              onEdit={() => Alert.alert("Edit", `Editing ${item.name}`)}
            />
          )
        }
        ListEmptyComponent={
          <EmptyState
            emoji={isServices ? "🔧" : "📦"}
            title={`No ${isServices ? "services" : "parts"} found`}
            description={
              searchQuery
                ? "Try a different search term"
                : `Tap "+ ${isServices ? "Service" : "Part"}" to get started`
            }
          />
        }
      />

      <AddServiceModal
        visible={showAddService}
        onClose={() => setShowAddService(false)}
        onAdd={handleAddService}
      />
      <AddPartModal
        visible={showAddPart}
        onClose={() => setShowAddPart(false)}
        onAdd={handleAddPart}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.bgSection,
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
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textSm,
    color: COLORS.textMuted,
  },
  tabTextActive: { color: COLORS.primary },
  tabCount: {
    minWidth: 20,
    height: 18,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.bgSection,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  tabCountActive: { backgroundColor: COLORS.primaryLight },
  tabCountText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  tabCountTextActive: { color: COLORS.primary },

  // Search + action
  topBar: {
    paddingHorizontal: SIZES.screenPadding,
    paddingTop: SIZES.sm,
    gap: SIZES.sm,
  },
  searchWrap: {},
  topBarActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  csvBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radiusFull,
    paddingVertical: 6,
    paddingHorizontal: SIZES.sm + 4,
    backgroundColor: COLORS.primaryLight,
  },
  csvText: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textSm,
    color: COLORS.primary,
  },

  // Table
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.bgSection,
  },
  colHead: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textXs,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  listContent: { paddingBottom: 40 },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.bgCard,
  },
  tableRowLast: { borderBottomWidth: 0 },
  tableRowMain: {
    flex: 3,
    paddingRight: SIZES.sm,
    gap: 3,
  },
  tableNoText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.textXs,
    color: COLORS.textMuted,
  },
  tableNameText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  tableMrpText: {
    width: 60,
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textSm,
    color: COLORS.textPrimary,
    textAlign: "right",
  },
  partRight: {
    width: 60,
    alignItems: "flex-end",
    gap: 4,
  },
  editBtn: {
    width: 44,
    alignItems: "flex-end",
    paddingRight: 2,
  },

  // Modal
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.md,
  },
  modalTitle: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textLg,
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  modalClose: {
    width: 34,
    height: 34,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.bgSection,
    alignItems: "center",
    justifyContent: "center",
  },
  modalDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
  },
  modalBody: {
    padding: SIZES.screenPadding,
    gap: SIZES.md,
    paddingBottom: 60,
  },

  // Section cards inside modal
  sectionCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SIZES.md,
    gap: SIZES.xs,
    ...SHADOWS.sm,
  },
  sectionCardTitle: {
    fontFamily: FONTS.semibold,
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
    marginBottom: SIZES.sm,
    paddingBottom: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },

  // Row fields
  rowFields: {
    flexDirection: "row",
    gap: SIZES.sm,
  },
  rowField: { flex: 1 },

  // Applicable
  applicableSection: {
    backgroundColor: COLORS.bg,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: "hidden",
    marginTop: SIZES.xs,
  },
  applicableRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  applicableLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.textBase,
    color: COLORS.textSecondary,
    flex: 1,
  },
  applicableRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  applicableCountBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  applicableCountText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: COLORS.primary,
  },
  applicableDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: SIZES.md,
  },
});
