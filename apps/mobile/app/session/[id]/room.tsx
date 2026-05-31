import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function SessionRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center bg-neutral-900">
      <Text className="text-2xl font-bold text-white">Video Call Room</Text>
      <Text className="mt-2 text-neutral-400">
        Session {id} — LiveKit video room will load here.
      </Text>
    </View>
  );
}
