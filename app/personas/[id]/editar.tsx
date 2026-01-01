import { ColorPickerField } from "@/src/components/ColorPickerField";
import { usePersonsStore } from "@/src/store/usePersonsStore";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function EditarPersona() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const persona = usePersonsStore((s) => s.personas.find((p) => p.id === id));
  const updatePersona = usePersonsStore((s) => s.updatePersona);
  const deletePersona = usePersonsStore((s) => s.deletePersona);

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

  const confirmarEliminar = () => {
    Alert.alert(
      "Eliminar persona",
      "Se eliminarán todos los movimientos asociados. ¿Deseas continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            deletePersona(persona.id);
            router.replace("/");
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: "Editar persona" }} />

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 22, marginBottom: 16, color: "#fff" }}>
          Editar persona
        </Text>

        <TextInput
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre"
          style={{
            borderWidth: 1,
            padding: 12,
            marginBottom: 12,
            borderColor: "#ffffffff",
            color: "#ffffffff",
          }}
        />

        <ColorPickerField value={color} onChange={setColor} />

        {/* Guardar */}
        <Pressable
          onPress={guardar}
          style={{
            padding: 16,
            backgroundColor: color,
            marginTop: 320,
          }}
        >
          <Text style={{ color: "#000000ff", textAlign: "center" }}>
            Guardar cambios
          </Text>
        </Pressable>

        {/* Eliminar */}
        <Pressable
          onPress={confirmarEliminar}
          style={{
            padding: 16,
            backgroundColor: "#df2440ff",
            marginTop: 12,
          }}
        >
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
            }}
          >
            Eliminar persona
          </Text>
        </Pressable>
      </View>
    </>
  );
}
