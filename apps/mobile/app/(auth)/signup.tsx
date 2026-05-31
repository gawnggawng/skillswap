import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function SignupScreen() {
  return (
    <View className="flex-1 justify-center bg-paper px-8">
      <Text className="font-display text-2xl font-bold text-ink">
        Create your account
      </Text>
      <Text className="mt-1 text-sand-600">
        Get 2 free credits to start learning. Teach a session to earn more.
      </Text>
      <View className="mt-8 gap-3">
        <Pressable className="w-full rounded-xl border border-sand-300 py-4 active:bg-sand-200">
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
        Already have an account?{" "}
        <Link href="/login">
          <Text className="font-semibold text-clay-600">Sign in</Text>
        </Link>
      </Text>
    </View>
  );
}
