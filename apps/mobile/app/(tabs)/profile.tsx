import { View, Text } from "react-native";

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-paper p-6">
      <Text className="font-display text-3xl font-bold text-ink">
        Profile & skills
      </Text>
      <Text className="mt-2 text-sand-600">
        Manage your profile, skills, and availability here.
      </Text>
    </View>
  );
}
