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
      "Se eliminarán todos los movimientos asociados. Esta acción no se puede deshacer.",
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
      <Stack.Screen
        options={{
          title: "Editar persona",
          headerStyle: { backgroundColor: "#000" },
          headerTitleStyle: { color: "#fff" },
          headerShadowVisible: false,
        }}
      />

      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          padding: 16,
        }}
      >
        {/* Card principal */}
        <View
          style={{
            backgroundColor: "#0A0A0A",
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: "#222",
          }}
        >
          {/* Nombre */}
          <Text
            style={{
              color: "#aaa",
              fontSize: 14,
              marginBottom: 6,
            }}
          >
            Nombre
          </Text>
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre"
            placeholderTextColor="#444"
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "500",
              paddingVertical: 8,
              marginBottom: 20,
            }}
          />

          {/* Color */}
          <Text
            style={{
              color: "#aaa",
              fontSize: 14,
              marginBottom: 8,
            }}
          >
            Color identificador
          </Text>
          <ColorPickerField value={color} onChange={setColor} />
        </View>

        {/* Guardar */}
        <Pressable
          onPress={guardar}
          style={({ pressed }) => ({
            marginTop: 320,
            paddingVertical: 16,
            borderRadius: 16,
            backgroundColor: color || "#3aff7a",
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text
            style={{
              color: "#000",
              fontSize: 16,
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Guardar cambios
          </Text>
        </Pressable>

        {/* Eliminar */}
        <Pressable
          onPress={confirmarEliminar}
          style={({ pressed }) => ({
            marginTop: 12,
            paddingVertical: 16,
            borderRadius: 16,
            backgroundColor: "#200",
            borderWidth: 1,
            borderColor: "#ff4d4d",
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text
            style={{
              color: "#ff4d4d",
              fontSize: 16,
              fontWeight: "600",
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
