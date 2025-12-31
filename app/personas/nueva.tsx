import { usePersonsStore } from "@/src/store/usePersonsStore";
import * as Crypto from "expo-crypto";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function NuevaPersona() {
  const addPersona = usePersonsStore((s) => s.addPersona);

  const [nombre, setNombre] = useState("");
  const [saldo, setSaldo] = useState("0");

  const crear = () => {
    addPersona({
      id: Crypto.randomUUID(),
      nombre,
      saldo: Number(saldo),
      color: "#E0E0E0",
      movimientos: [],
    });

    router.back();
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, marginBottom: 16 }}>Nueva Persona</Text>

      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      <TextInput
        placeholder="Saldo inicial"
        keyboardType="numeric"
        value={saldo}
        onChangeText={setSaldo}
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      <Pressable
        onPress={crear}
        style={{ padding: 16, backgroundColor: "#000" }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Guardar</Text>
      </Pressable>
    </View>
  );
}
