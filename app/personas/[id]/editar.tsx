import { usePersonsStore } from "@/src/store/usePersonsStore";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function EditarPersona() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const persona = usePersonsStore((s) => s.personas.find((p) => p.id === id));
  const updatePersona = usePersonsStore((s) => s.updatePersona);

  const [nombre, setNombre] = useState(persona?.nombre ?? "");
  const [color, setColor] = useState(persona?.color ?? "");

  if (!persona) {
    return <Text>Persona no encontrada</Text>;
  }

  const guardar = () => {
    updatePersona(persona.id, {
      nombre,
      color,
    });

    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: "Editar persona" }} />

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 22, marginBottom: 16 }}>Editar persona</Text>

        <TextInput
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre"
          style={{
            borderWidth: 1,
            padding: 12,
            marginBottom: 12,
          }}
        />

        <TextInput
          value={color}
          onChangeText={setColor}
          placeholder="Color (#hex)"
          style={{
            borderWidth: 1,
            padding: 12,
            marginBottom: 12,
          }}
        />

        <Pressable
          onPress={guardar}
          style={{
            padding: 16,
            backgroundColor: "#000",
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>
            Guardar cambios
          </Text>
        </Pressable>
      </View>
    </>
  );
}
