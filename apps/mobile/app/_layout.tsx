import "../../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Fraunces_600SemiBold } from "@expo-google-fonts/fraunces";
import { PlusJakartaSans_400Regular } from "@expo-google-fonts/plus-jakarta-sans";
import { ApiProvider } from "@skillswap/api";
import { setTokenProvider } from "@skillswap/api/client";
import * as SecureStore from "expo-secure-store";

setTokenProvider(async () => {
  return await SecureStore.getItemAsync("sessionToken");
});

export default function RootLayout() {
  // Register the brand faces under the family names used by NativeWind's
  // font-display / font-sans tokens (see apps/mobile/global.css).
  const [fontsLoaded] = useFonts({
    Fraunces: Fraunces_600SemiBold,
    PlusJakartaSans: PlusJakartaSans_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <ApiProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="session/[id]/room"
          options={{ headerShown: false, presentation: "fullScreenModal" }}
        />
      </Stack>
    </ApiProvider>
  );
}
