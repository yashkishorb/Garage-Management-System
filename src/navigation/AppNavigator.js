import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import Loader from "../components/ui/Loader";
import AuthStack from "./AuthStack";
import { COLORS, FONTS } from "../utils/constants";
import { selectNeedsGarageSetup } from "../store/slices/authSlice";
import GarageTabs from "./GarageTabs";
import GarageDetails from "../screens/auth/GarageDetails";

// Theme fonts required by native-stack (useHeaderConfigProps reads theme.fonts.regular)
const themeFonts = {
  regular: FONTS?.regular || "Inter_400Regular",
  medium: FONTS?.medium || "Inter_500Medium",
  bold: FONTS?.bold || "Inter_700Bold",
  heavy: FONTS?.extrabold || "Inter_800ExtraBold",
};

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const needsGarageSetup = useSelector(selectNeedsGarageSetup);

  // Show full-screen loader while session is being restored from AsyncStorage
  if (loading) {
    return <Loader fullScreen text="Loading Garage System..." />;
  }

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: COLORS.primary,
          background: COLORS.bg,
          card: COLORS.bgCard,
          text: COLORS.textPrimary,
          border: COLORS.borderLight,
          notification: COLORS.secondary,
        },
        fonts: themeFonts,
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated && needsGarageSetup ? (
          // ─── FIRST-TIME OWNER ONBOARDING ────────────────────────────────────
          // Only the garage form is mounted until the profile is saved; the
          // navigator swaps to the full app as soon as profileComplete is true.
          <Stack.Screen name="GarageDetails" component={GarageDetails} />
        ) : isAuthenticated ? (
          // ─── PRIVATE (authenticated) routes ─────────────────────────────────
          // Auth screens are NOT mounted — user cannot navigate back to Login/OTP
          <>
            <Stack.Screen name="App" component={GarageTabs} />
            <Stack.Screen name="GarageDetails" component={GarageDetails} />
          </>
        ) : (
          // ─── PUBLIC (unauthenticated) routes ────────────────────────────────
          // App screens are NOT mounted — unauthed users cannot reach the app
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
