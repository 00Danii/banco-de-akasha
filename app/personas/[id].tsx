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

  const movimientos = persona.movimientos ?? [];

  const movimientosOrdenados = [...movimientos].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  const ingresos = movimientos.reduce(
    (acc, m) => (m.tipo === "ingreso" ? acc + m.monto : acc),
    0
  );

  const retiros = movimientos.reduce(
    (acc, m) => (m.tipo === "retiro" ? acc + m.monto : acc),
    0
  );

  const saldoInicial = persona.saldoInicial ?? 0;

  const format = (n: number) => `$${n.toFixed(2)}`;

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
                  width: 10,
                  height: 10,
                  borderRadius: 6,
                  backgroundColor: persona.color,
                  marginRight: 10,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#fff",
                  marginRight: 8,
                }}
              >
                {persona.nombre}
              </Text>

              <Pressable
                onPress={() => router.push(`/personas/${persona.id}/editar`)}
                style={{ marginLeft: 6 }}
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
              style={{ padding: 6 }}
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
            padding: 18,
            borderRadius: 18,
            backgroundColor: "#0A0A0A",
            borderWidth: 1,
            borderColor: `${persona.color}55`,
            marginBottom: 18,
            shadowColor: "#000",
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: "#070707",
                borderWidth: 2,
                borderColor: persona.color,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                {persona.nombre.slice(0, 2).toUpperCase()}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: "#aaa", fontSize: 13 }}>Saldo actual</Text>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 32,
                  fontWeight: "800",
                  marginTop: 2,
                }}
              >
                {format(persona.saldo)}
              </Text>

              <Text style={{ color: "#666", fontSize: 12, marginTop: 6 }}>
                Inicial {format(saldoInicial)} • {movimientos.length}{" "}
                movimientos
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", marginTop: 14, gap: 10 }}>
            <View
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: "#060606",
                borderWidth: 1,
                borderColor: "#1a1a1a",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#aaa", fontSize: 12 }}>Ingresos</Text>
              <Text
                style={{ color: "#3aff7a", fontWeight: "700", marginTop: 6 }}
              >
                {format(ingresos)}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: "#060606",
                borderWidth: 1,
                borderColor: "#1a1a1a",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#aaa", fontSize: 12 }}>Retiros</Text>
              <Text
                style={{ color: "#ff6b6b", fontWeight: "700", marginTop: 6 }}
              >
                {format(retiros)}
              </Text>
            </View>
          </View>
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
                  backgroundColor: "#090909",
                  marginBottom: 12,
                  opacity: pressed ? 0.85 : 1,
                  borderWidth: 1,
                  borderColor: "#151515",
                })}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: esIngreso ? "#3aff7a" : "#ff6b6b",
                      marginRight: 14,
                    }}
                  />

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "700",
                      }}
                    >
                      {item.descripcion || (esIngreso ? "Ingreso" : "Retiro")}
                    </Text>

                    <Text
                      style={{ color: "#777", fontSize: 13, marginTop: 4 }}
                      numberOfLines={1}
                    >
                      {new Date(item.fecha).toLocaleDateString()}
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: esIngreso ? "#3aff7a" : "#ff6b6b",
                      fontSize: 16,
                      fontWeight: "800",
                      marginLeft: 12,
                    }}
                  >
                    {esIngreso ? "+" : "-"}
                    {format(item.monto)}
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
