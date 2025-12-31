import { usePersonsStore } from "@/src/store/usePersonsStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";

export default function PersonaDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const persona = usePersonsStore((s) => s.personas.find((p) => p.id === id));

  if (!persona) {
    return <Text>Persona no encontrada</Text>;
  }

  // Copia ordenada: más reciente primero
  const movimientosOrdenados = [...persona.movimientos].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: persona.nombre,
          headerRight: () => (
            <Pressable
              onPress={() =>
                router.push(`/movimientos/nuevo?personaId=${persona.id}`)
              }
            >
              <MaterialCommunityIcons name="transfer" size={30} color="black" />
            </Pressable>
          ),
        }}
      />

      <View style={{ flex: 1, padding: 16 }}>
        <View
          style={{
            padding: 16,
            borderRadius: 16,
            backgroundColor: persona.color,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 22 }}>{persona.nombre}</Text>
          <Text style={{ fontSize: 18 }}>Saldo: ${persona.saldo}</Text>
        </View>

        <FlatList
          data={movimientosOrdenados}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text>No hay movimientos</Text>}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 12,
                borderBottomWidth: 1,
                borderColor: "#ddd",
              }}
            >
              <Text>
                {item.tipo === "ingreso" ? "➕" : "➖"} ${item.monto}
              </Text>
              <Text>{item.descripcion}</Text>
              <Text>{new Date(item.fecha).toLocaleDateString()}</Text>
            </View>
          )}
        />
      </View>
    </>
  );
}
