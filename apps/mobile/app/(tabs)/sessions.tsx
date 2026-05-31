import { View, Text } from "react-native";

export default function SessionsScreen() {
  return (
    <View className="flex-1 bg-neutral-50 p-6">
      <Text className="text-3xl font-bold text-neutral-900">My Sessions</Text>
      <Text className="mt-2 text-neutral-600">
        View and manage your skill swap sessions.
      </Text>
    </View>
  );
}
