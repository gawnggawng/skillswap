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
    <View className="flex-1 justify-center bg-neutral-50 px-8">
      <Text className="text-2xl font-bold">Welcome back</Text>
      <Text className="mt-1 text-neutral-600">
        Sign in to your SkillSwap account
      </Text>
      <View className="mt-8 space-y-3">
        <Pressable
          onPress={handleGoogleLogin}
          className="w-full rounded-xl border border-neutral-300 py-4"
        >
          <Text className="text-center font-semibold text-neutral-700">
            Continue with Google
          </Text>
        </Pressable>
        <Pressable className="w-full rounded-xl border border-neutral-300 py-4">
          <Text className="text-center font-semibold text-neutral-700">
            Continue with GitHub
          </Text>
        </Pressable>
      </View>
      <Text className="mt-6 text-center text-sm text-neutral-500">
        No account yet?{" "}
        <Link href="/signup">
          <Text className="text-primary-600">Sign up</Text>
        </Link>
      </Text>
    </View>
  );
}
