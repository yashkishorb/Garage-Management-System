import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES, SHADOWS } from "../../utils/constants";
import TopNav from "../../components/ui/TopNav";
import AppButton from "../../components/ui/AppButton";
import AppRadioGroup from "../../components/ui/AppRadioGroup";
import AppSelect from "../../components/ui/AppSelect";

const SEARCH_OPTIONS = [
  { value: "jobcard", label: "By Jobcards/Repair Order number" },
  { value: "invoice", label: "By invoice number" },
  { value: "daterange", label: "By date range" },
];

const DATE_RANGE_OPTIONS = [
  "Today",
  "Yesterday",
  "This Week",
  "Last Week",
  "This Month",
  "Last Month",
  "Custom Range",
].map((v) => ({ value: v, label: v }));

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function OrderSearchScreen() {
  const [searchType, setSearchType] = useState("daterange");
  const [inputValue, setInputValue] = useState("");
  const [dateRange, setDateRange] = useState("");

  const handleSearch = () => {
    Alert.alert(
      "Search",
      `Searching by: ${SEARCH_OPTIONS.find((o) => o.id === searchType)?.label}`,
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <TopNav title="Search orders by" transparent={false} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Search type options */}
        <AppRadioGroup
          options={SEARCH_OPTIONS}
          value={searchType}
          onChange={(v) => {
            setSearchType(v);
            setInputValue("");
            setDateRange("");
          }}
          direction="column"
        />

        {/* Dynamic input based on search type */}
        {searchType === "daterange" && (
          <View style={styles.inputSection}>
            <AppSelect
              icon="calendar-outline"
              placeholder="By Date"
              options={DATE_RANGE_OPTIONS}
              value={dateRange}
              onChange={setDateRange}
            />
          </View>
        )}

        {(searchType === "jobcard" || searchType === "invoice") && (
          <View style={styles.inputSection}>
            <View style={styles.textInputWrap}>
              <Ionicons
                name="search-outline"
                size={18}
                color={COLORS.textMuted}
                style={{ marginRight: SIZES.sm }}
              />
              <Text style={styles.textInputPlaceholder}>
                {searchType === "jobcard"
                  ? "Enter Jobcard / Repair Order number"
                  : "Enter invoice number"}
              </Text>
            </View>
          </View>
        )}

        {/* Search button */}
        <View style={styles.searchBtnWrap}>
          <AppButton
            title="Search"
            variant="primary"
            size="md"
            onPress={handleSearch}
            fullWidth={false}
            style={styles.searchBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: {
    paddingHorizontal: SIZES.screenPadding,
    paddingTop: SIZES.md,
    paddingBottom: 120,
  },

  searchBtnWrap: { alignItems: "center", marginTop: SIZES.sm },
  searchBtn: { paddingHorizontal: SIZES.xxl },
});
