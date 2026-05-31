import "../../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ApiProvider } from "@skillswap/api";
import { setTokenProvider } from "@skillswap/api/client";
import * as SecureStore from "expo-secure-store";

setTokenProvider(async () => {
  return await SecureStore.getItemAsync("sessionToken");
});

export default function RootLayout() {
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
