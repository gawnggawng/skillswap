import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function LandingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-paper px-8">
      <Text className="font-display text-5xl font-bold text-ink">SkillSwap</Text>
      <Text className="mt-3 text-lg text-sand-600">
        Barter your knowledge. No money.
      </Text>
      <Text className="mt-2 text-center text-sand-500">
        Teach a 30-minute session, earn a credit. Learn from someone else, spend
        a credit. Simple.
      </Text>
      <View className="mt-10 w-full gap-3">
        <Link
          href="/signup"
          className="w-full rounded-xl bg-clay-500 py-4 text-center font-semibold text-paper"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="w-full rounded-xl border border-sand-300 py-4 text-center font-semibold text-sand-700"
        >
          Sign in
        </Link>
      </View>
    </View>
  );
}
