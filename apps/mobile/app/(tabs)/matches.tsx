import { View, Text } from "react-native";

export default function MatchesScreen() {
  return (
    <View className="flex-1 bg-paper p-6">
      <Text className="font-display text-3xl font-bold text-ink">
        Find matches
      </Text>
      <Text className="mt-2 text-sand-600">
        Discover people to swap skills with.
      </Text>
    </View>
  );
}
