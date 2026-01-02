import { ColorPickerField } from "@/src/components/ColorPickerField";
import { usePersonsStore } from "@/src/store/usePersonsStore";
import * as Crypto from "expo-crypto";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function NuevaPersona() {
  const addPersona = usePersonsStore((s) => s.addPersona);

  const [nombre, setNombre] = useState("");
  const [saldo, setSaldo] = useState("0");
  const [color, setColor] = useState("#3aff7a");

  const crear = () => {
    if (!nombre) return;

    addPersona({
      id: Crypto.randomUUID(),
      nombre,
      saldo: Number(saldo),
      color,
      movimientos: [],
    });

    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Nueva persona",
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
          <Text style={{ color: "#aaa", fontSize: 14, marginBottom: 6 }}>
            Nombre
          </Text>
          <TextInput
            placeholder="Nombre de la persona"
            placeholderTextColor="#444"
            value={nombre}
            onChangeText={setNombre}
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "500",
              paddingVertical: 8,
              marginBottom: 20,
            }}
          />

          {/* Saldo */}
          <Text style={{ color: "#aaa", fontSize: 14, marginBottom: 6 }}>
            Saldo inicial
          </Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#444"
            keyboardType="numeric"
            value={saldo}
            onChangeText={setSaldo}
            style={{
              fontSize: 24,
              color: "#fff",
              fontWeight: "600",
              paddingVertical: 8,
              marginBottom: 20,
            }}
          />

          {/* Color */}
          <Text style={{ color: "#aaa", fontSize: 14, marginBottom: 8 }}>
            Color identificador
          </Text>
          <ColorPickerField value={color} onChange={setColor} />
        </View>

        {/* Guardar */}
        <Pressable
          onPress={crear}
          style={({ pressed }) => ({
            marginTop: 320,
            paddingVertical: 16,
            borderRadius: 16,
            backgroundColor: color,
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
            Crear persona
          </Text>
        </Pressable>
      </View>
    </>
  );
}
