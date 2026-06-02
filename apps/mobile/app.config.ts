import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "SkillSwap",
  slug: "skillswap",
  version: "0.0.1",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "skillswap",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  splash: {
    backgroundColor: "#ffffff",
    resizeMode: "contain",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "app.skillswap.mobile",
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#ffffff",
    },
    package: "app.skillswap.mobile",
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-av",
    [
      "expo-notifications",
      {
        icon: "./assets/notification-icon.png",
        color: "#3b82f6",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    apiUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000",
    livekitHost:
      process.env.NEXT_PUBLIC_LIVEKIT_HOST || "wss://your-project.livekit.cloud",
  },
};

export default config;
