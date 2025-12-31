import { usePersonsStore } from "@/src/store/usePersonsStore";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

export default function Home() {
  const personas = usePersonsStore((s) => s.personas);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Personas",
          headerRight: () => (
            <Pressable onPress={() => router.push("/personas/nueva")}>
              <Ionicons name="person-add" size={30} />
            </Pressable>
          ),
        }}
      />

      <View style={{ flex: 1, padding: 16 }}>
        <FlatList
          data={personas}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text>No hay personas todavía</Text>}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/personas/${item.id}`)}
              style={{
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
                backgroundColor: item.color,
              }}
            >
              <Text style={{ fontSize: 18 }}>{item.nombre}</Text>
              <Text>Saldo: ${item.saldo}</Text>
            </Pressable>
          )}
        />
      </View>
    </>
  );
}
