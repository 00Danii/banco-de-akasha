import { usePersonsStore } from "@/src/store/usePersonsStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Crypto from "expo-crypto";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function NuevoMovimiento() {
  const { personaId } = useLocalSearchParams<{ personaId: string }>();
  const addMovimiento = usePersonsStore((s) => s.addMovimiento);

  const [tipo, setTipo] = useState<"ingreso" | "retiro">("ingreso");
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [fecha, setFecha] = useState<Date>(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);

  const guardar = () => {
    addMovimiento(personaId!, {
      id: Crypto.randomUUID(),
      tipo,
      monto: Number(monto),
      descripcion,
      fecha: fecha.toISOString(),
    });
    router.back();
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, marginBottom: 16 }}>Nuevo movimiento</Text>

      {/* Tipo */}
      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        <Pressable
          onPress={() => setTipo("ingreso")}
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: tipo === "ingreso" ? "#000" : "#ddd",
          }}
        >
          <Text
            style={{
              color: tipo === "ingreso" ? "#fff" : "#000",
              textAlign: "center",
            }}
          >
            Ingreso
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setTipo("retiro")}
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: tipo === "retiro" ? "#000" : "#ddd",
          }}
        >
          <Text
            style={{
              color: tipo === "retiro" ? "#fff" : "#000",
              textAlign: "center",
            }}
          >
            Retiro
          </Text>
        </Pressable>
      </View>

      {/* Monto */}
      <TextInput
        placeholder="Monto"
        keyboardType="numeric"
        value={monto}
        onChangeText={setMonto}
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      {/* Descripción */}
      <TextInput
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      {/* Fecha */}
      <Pressable
        onPress={() => setMostrarPicker(true)}
        style={{
          padding: 12,
          borderWidth: 1,
          marginBottom: 16,
        }}
      >
        <Text>Fecha: {fecha.toLocaleDateString()}</Text>
      </Pressable>

      {mostrarPicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setMostrarPicker(false);
            if (selectedDate) {
              setFecha(selectedDate);
            }
          }}
        />
      )}

      <Pressable
        onPress={guardar}
        style={{ padding: 16, backgroundColor: "#000" }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Guardar movimiento
        </Text>
      </Pressable>
    </View>
  );
}
