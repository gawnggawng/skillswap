import { View, Text } from "react-native";

export default function DashboardScreen() {
  return (
    <View className="flex-1 bg-paper p-6">
      <Text className="font-display text-3xl font-bold text-ink">Dashboard</Text>
      <Text className="mt-2 text-sand-600">
        Your skill swap overview will appear here.
      </Text>
    </View>
  );
}
