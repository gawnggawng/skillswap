import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function SignupScreen() {
  return (
    <View className="flex-1 justify-center bg-neutral-50 px-8">
      <Text className="text-2xl font-bold">Create your account</Text>
      <Text className="mt-1 text-neutral-600">
        Get 2 free credits to start learning. Teach a session to earn more.
      </Text>
      <View className="mt-8 space-y-3">
        <Pressable className="w-full rounded-xl border border-neutral-300 py-4">
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
        Already have an account?{" "}
        <Link href="/login">
          <Text className="text-primary-600">Sign in</Text>
        </Link>
      </Text>
    </View>
  );
}
