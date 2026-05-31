import { View, Text } from "react-native";

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-neutral-50 p-6">
      <Text className="text-3xl font-bold text-neutral-900">Profile & Skills</Text>
      <Text className="mt-2 text-neutral-600">
        Manage your profile, skills, and availability here.
      </Text>
    </View>
  );
}
