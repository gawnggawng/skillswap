import { View, Text } from "react-native";

export default function SessionsScreen() {
  return (
    <View className="flex-1 bg-paper p-6">
      <Text className="font-display text-3xl font-bold text-ink">
        My sessions
      </Text>
      <Text className="mt-2 text-sand-600">
        View and manage your skill swap sessions.
      </Text>
    </View>
  );
}
