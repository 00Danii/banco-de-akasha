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
          headerStyle: { backgroundColor: "#000" },
          headerTitleStyle: { color: "#fff" },
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/personas/nueva")}
              style={{ padding: 4 }}
            >
              <Ionicons name="add-circle-outline" size={28} color="#fff" />
            </Pressable>
          ),
        }}
      />

      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          padding: 16,
        }}
      >
        <FlatList
          data={personas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingBottom: 16,
          }}
          ListEmptyComponent={
            <View
              style={{
                marginTop: 64,
                alignItems: "center",
              }}
            >
              <Ionicons name="people-outline" size={48} color="#333" />
              <Text
                style={{
                  color: "#666",
                  marginTop: 12,
                  fontSize: 16,
                }}
              >
                No hay personas todavía
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/personas/${item.id}`)}
              style={({ pressed }) => ({
                padding: 16,
                borderRadius: 16,
                marginBottom: 14,
                backgroundColor: "#0A0A0A",
                borderWidth: 1,
                borderColor: `${item.color}55`,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {/* Indicador de color */}
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: item.color,
                    marginRight: 12,
                  }}
                />

                {/* Texto */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: "600",
                      marginBottom: 4,
                    }}
                  >
                    {item.nombre}
                  </Text>

                  <Text
                    style={{
                      color: "#aaa",
                      fontSize: 14,
                    }}
                  >
                    Saldo · ${item.saldo}
                  </Text>
                </View>

                {/* Flecha */}
                <Ionicons name="chevron-forward" size={20} color="#444" />
              </View>
            </Pressable>
          )}
        />
      </View>
    </>
  );
}
