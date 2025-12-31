import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#ffffffff",
          contentStyle: { backgroundColor: "#000" },
        }}
      />
    </View>
  );
}
