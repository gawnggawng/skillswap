import { View, Text } from "react-native";

export default function MatchesScreen() {
  return (
    <View className="flex-1 bg-neutral-50 p-6">
      <Text className="text-3xl font-bold text-neutral-900">Find Matches</Text>
      <Text className="mt-2 text-neutral-600">
        Discover people to swap skills with.
      </Text>
    </View>
  );
}
