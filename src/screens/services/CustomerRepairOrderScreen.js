import React, { useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES, SHADOWS } from "../../utils/constants";
import TopNav from "../../components/ui/TopNav";
import AppInput from "../../components/ui/AppInput";
import AppButton from "../../components/ui/AppButton";

export default function CustomerRepairOrderScreen() {
  const [regNo, setRegNo] = useState("");
  const [errors, setErrors] = useState({});

  const handleSearch = () => {
    if (!regNo.trim()) {
      setErrors({ regNo: "Please enter a registration number" });
      return;
    }
    setErrors({});
    // TODO: API search
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <TopNav title="Repair Order" transparent={false} />

      <View style={styles.content}>
        {/* Search input */}
        <AppInput
          label="Registration Number"
          icon="id-card-outline"
          placeholder="MH12AB1234"
          value={regNo}
          onChangeText={(t) => {
            setRegNo(t);
            if (errors.regNo) setErrors({});
          }}
          autoCapitalize="characters"
          error={errors.regNo}
          accessibilityLabel="Vehicle registration number"
          accessibilityHint="Enter the vehicle registration number to search"
        />

        <AppButton
          title="Search Vehicle"
          variant="primary"
          size="lg"
          onPress={handleSearch}
          leftIcon="search-outline"
          accessibilityLabel="Search vehicle"
        />

        <AppButton
          title="Create New Vehicle"
          variant="ghost"
          size="lg"
          onPress={() => {}}
          style={styles.createBtn}
          accessibilityLabel="Create new vehicle record"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: {
    flex: 1,
    padding: SIZES.screenPadding,
    paddingTop: SIZES.lg,
  },
  createBtn: {
    marginTop: SIZES.sm,
  },
});
