import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export default function LoginScreen() {
  const handleGoogleLogin = async () => {
    await WebBrowser.openAuthSessionAsync(
      `${API_URL}/api/auth/signin/google?callbackUrl=skillswap://login`
    );
  };

  return (
    <View className="flex-1 justify-center bg-paper px-8">
      <Text className="font-display text-2xl font-bold text-ink">
        Welcome back
      </Text>
      <Text className="mt-1 text-sand-600">
        Sign in to your SkillSwap account
      </Text>
      <View className="mt-8 gap-3">
        <Pressable
          onPress={handleGoogleLogin}
          className="w-full rounded-xl border border-sand-300 py-4 active:bg-sand-200"
        >
          <Text className="text-center font-semibold text-sand-700">
            Continue with Google
          </Text>
        </Pressable>
        <Pressable className="w-full rounded-xl border border-sand-300 py-4 active:bg-sand-200">
          <Text className="text-center font-semibold text-sand-700">
            Continue with GitHub
          </Text>
        </Pressable>
      </View>
      <Text className="mt-6 text-center text-sm text-sand-500">
        No account yet?{" "}
        <Link href="/signup">
          <Text className="font-semibold text-clay-600">Sign up</Text>
        </Link>
      </Text>
    </View>
  );
}
