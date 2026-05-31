import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function SessionRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center bg-sand-950 px-8">
      <Text className="font-display text-2xl font-bold text-sand-50">
        Video call room
      </Text>
      <Text className="mt-2 text-center text-sand-400">
        Session {id} — LiveKit video room will load here.
      </Text>
    </View>
  );
}
