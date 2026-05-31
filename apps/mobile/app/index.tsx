import { Link, Redirect } from "expo-router";
import { View, Text } from "react-native";

export default function LandingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-50 px-8">
      <Text className="text-5xl font-bold text-neutral-900">SkillSwap</Text>
      <Text className="mt-3 text-lg text-neutral-600">
        Barter your knowledge. No money.
      </Text>
      <Text className="mt-2 text-center text-neutral-500">
        Teach a 30-minute session, earn a credit. Learn from someone else, spend
        a credit. Simple.
      </Text>
      <View className="mt-10 w-full space-y-3">
        <Link
          href="/signup"
          className="w-full rounded-xl bg-primary-600 py-4 text-center font-semibold text-white"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="w-full rounded-xl border border-neutral-300 py-4 text-center font-semibold text-neutral-700"
        >
          Sign in
        </Link>
      </View>
    </View>
  );
}
