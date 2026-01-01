import { ColorPickerField } from "@/src/components/ColorPickerField";
import { usePersonsStore } from "@/src/store/usePersonsStore";
import * as Crypto from "expo-crypto";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function NuevaPersona() {
  const addPersona = usePersonsStore((s) => s.addPersona);

  const [nombre, setNombre] = useState("");
  const [saldo, setSaldo] = useState("0");
  const [color, setColor] = useState("#FFF");

  const crear = () => {
    addPersona({
      id: Crypto.randomUUID(),
      nombre,
      saldo: Number(saldo),
      color: color,
      movimientos: [],
    });

    router.back();
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, marginBottom: 16, color: "#fff" }}>
        Nueva Persona
      </Text>

      <TextInput
        placeholder="Nombre de la persona"
        value={nombre}
        onChangeText={setNombre}
        style={{
          borderWidth: 1,
          borderColor: "#fff",
          padding: 12,
          marginBottom: 12,
          color: "#fff",
        }}
      />

      <TextInput
        placeholder="Saldo inicial"
        keyboardType="numeric"
        value={saldo}
        onChangeText={setSaldo}
        style={{
          borderWidth: 1,
          padding: 12,
          marginBottom: 12,
          borderColor: "#fff",
          color: "#fff",
        }}
      />

      <ColorPickerField value={color} onChange={setColor} />

      <Pressable
        onPress={crear}
        style={{
          padding: 16,
          backgroundColor: color,
          marginTop: 320,
        }}
      >
        <Text style={{ color: "#000000ff", textAlign: "center" }}>Guardar</Text>
      </Pressable>
    </View>
  );
}
