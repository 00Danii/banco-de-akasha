import { usePersonsStore } from "@/src/store/usePersonsStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";

export default function PersonaDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const persona = usePersonsStore((s) => s.personas.find((p) => p.id === id));

  if (!persona) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#666" }}>Persona no encontrada</Text>
      </View>
    );
  }

  const movimientosOrdenados = [...persona.movimientos].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#000" },
          headerShadowVisible: false,
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: persona.color,
                  marginRight: 8,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#fff",
                  marginRight: 8,
                }}
              >
                {persona.nombre}
              </Text>

              <Pressable
                onPress={() => router.push(`/personas/${persona.id}/editar`)}
              >
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={18}
                  color="#aaa"
                />
              </Pressable>
            </View>
          ),
          headerRight: () => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/movimientos/nuevo",
                  params: { personaId: persona.id },
                })
              }
              style={{ padding: 4 }}
            >
              <MaterialCommunityIcons name="transfer" size={26} color="#fff" />
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
        {/* Card de resumen */}
        <View
          style={{
            padding: 16,
            borderRadius: 16,
            backgroundColor: "#0A0A0A",
            borderWidth: 1,
            borderColor: `${persona.color}55`,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: "#aaa",
              fontSize: 14,
              marginBottom: 4,
            }}
          >
            Saldo actual
          </Text>

          <Text
            style={{
              color: "#fff",
              fontSize: 28,
              fontWeight: "600",
            }}
          >
            ${persona.saldo}
          </Text>
        </View>

        {/* Lista de movimientos */}
        <FlatList
          data={movimientosOrdenados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 16 }}
          ListEmptyComponent={
            <View
              style={{
                marginTop: 48,
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="playlist-remove"
                size={48}
                color="#333"
              />
              <Text
                style={{
                  color: "#666",
                  marginTop: 12,
                }}
              >
                No hay movimientos
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const esIngreso = item.tipo === "ingreso";

            return (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/movimientos/[id]",
                    params: {
                      id: item.id,
                      personaId: persona.id,
                    },
                  })
                }
                style={({ pressed }) => ({
                  padding: 14,
                  borderRadius: 14,
                  backgroundColor: "#0A0A0A",
                  marginBottom: 12,
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {/* Indicador */}
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: esIngreso ? "#3aff7a" : "#ff4d4d",
                      marginRight: 12,
                    }}
                  />

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                        marginBottom: 2,
                      }}
                    >
                      {esIngreso ? "+" : "-"}${item.monto}
                    </Text>

                    <Text
                      style={{
                        color: "#aaa",
                        fontSize: 14,
                      }}
                      numberOfLines={1}
                    >
                      {item.descripcion}
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: "#555",
                      fontSize: 12,
                    }}
                  >
                    {new Date(item.fecha).toLocaleDateString()}
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
