import { View, Text } from "react-native";

export default function DashboardScreen() {
  return (
    <View className="flex-1 bg-neutral-50 p-6">
      <Text className="text-3xl font-bold text-neutral-900">Dashboard</Text>
      <Text className="mt-2 text-neutral-600">
        Your skill swap overview will appear here.
      </Text>
    </View>
  );
}
