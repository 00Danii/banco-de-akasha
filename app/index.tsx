import { usePersonsStore } from "@/src/store/usePersonsStore";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import {
  FlatList,
  Platform,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";

export default function Home() {
  const personas = usePersonsStore((s) => s.personas);

  const format = (n: number) => `$${n.toFixed(2)}`;

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack.Screen
        options={{
          title: "Personas",
          headerStyle: { backgroundColor: "#000" },
          headerTitleStyle: { color: "#fff" },
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/personas/nueva")}
              style={{ padding: 6 }}
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
            paddingBottom: 24,
          }}
          ListEmptyComponent={
            <View
              style={{
                marginTop: 64,
                alignItems: "center",
              }}
            >
              <Ionicons name="people-outline" size={56} color="#333" />
              <Text
                style={{
                  color: "#666",
                  marginTop: 14,
                  fontSize: 16,
                }}
              >
                No hay personas todavía
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            // último movimiento (si existe)
            const lastMovimiento = (item.movimientos ?? [])
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
              )[0];

            return (
              <Pressable
                onPress={() => router.push(`/personas/${item.id}`)}
                style={({ pressed }) => ({
                  padding: 14,
                  borderRadius: 16,
                  marginBottom: 14,
                  backgroundColor: "#070707",
                  borderWidth: 1,
                  borderColor: `${item.color}55`,
                  opacity: pressed ? 0.85 : 1,
                  flexDirection: "row",
                  alignItems: "center",
                  // shadow
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOpacity: 0.6,
                      shadowRadius: 10,
                      shadowOffset: { width: 0, height: 6 },
                    },
                    android: {
                      elevation: 6,
                    },
                  }),
                })}
              >
                {/* Accent stripe */}
                <View
                  style={{
                    width: 6,
                    height: 56,
                    borderRadius: 6,
                    backgroundColor: item.color,
                    marginRight: 12,
                    transform: [{ translateY: -2 }],
                  }}
                />

                {/* Avatar */}
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    backgroundColor: "#0a0a0a",
                    borderWidth: 1,
                    borderColor: `${item.color}88`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}
                  >
                    {item.nombre.slice(0, 2).toUpperCase()}
                  </Text>
                </View>

                {/* Texto principal */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: "700",
                      marginBottom: 4,
                    }}
                  >
                    {item.nombre}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {lastMovimiento ? (
                      <>
                        <Text style={{ color: "#aaa", fontSize: 13 }}>
                          {lastMovimiento.tipo === "ingreso"
                            ? "Ingreso"
                            : "Retiro "}
                        </Text>

                        <Text
                          style={{
                            color:
                              lastMovimiento.tipo === "ingreso"
                                ? "#3aff7a"
                                : "#ff6b6b",
                            marginLeft: 8,
                            fontWeight: "700",
                          }}
                        >
                          {lastMovimiento.tipo === "ingreso" ? "+" : "-"}
                          {format(lastMovimiento.monto)}
                        </Text>
                      </>
                    ) : (
                      <Text style={{ color: "#aaa", fontSize: 13 }}>
                        Sin movimientos
                      </Text>
                    )}
                  </View>
                </View>

                {/* Saldo actual */}
                <View style={{ alignItems: "flex-end", marginLeft: 12 }}>
                  <Text style={{ color: "#aaa", fontSize: 12 }}>Saldo</Text>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: "800",
                      marginTop: 4,
                    }}
                  >
                    {format(item.saldo)}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    </>
  );
}
