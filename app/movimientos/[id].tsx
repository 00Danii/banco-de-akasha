import { usePersonsStore } from "@/src/store/usePersonsStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function EditarMovimiento() {
  const { id, personaId } = useLocalSearchParams<{
    id: string;
    personaId: string;
  }>();

  const persona = usePersonsStore((s) =>
    s.personas.find((p) => p.id === personaId)
  );

  const movimiento = persona?.movimientos.find((m) => m.id === id);

  const updateMovimiento = usePersonsStore((s) => s.updateMovimiento);
  const deleteMovimiento = usePersonsStore((s) => s.deleteMovimiento);

  const [tipo, setTipo] = useState(movimiento?.tipo ?? "ingreso");
  const [monto, setMonto] = useState(String(movimiento?.monto ?? ""));
  const [descripcion, setDescripcion] = useState(movimiento?.descripcion ?? "");
  const [fecha, setFecha] = useState(
    movimiento ? new Date(movimiento.fecha) : new Date()
  );
  const [showPicker, setShowPicker] = useState(false);

  if (!movimiento) {
    return <Text>Movimiento no encontrado</Text>;
  }

  const guardar = () => {
    updateMovimiento(personaId!, id!, {
      tipo,
      monto: Number(monto),
      descripcion,
      fecha: fecha.toISOString(),
    });

    router.back();
  };

  const confirmarEliminar = () => {
    Alert.alert(
      "Eliminar movimiento",
      "¿Estás seguro de eliminar este movimiento? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            deleteMovimiento(personaId!, id!);
            router.replace(`/personas/${personaId}`);
          },
        },
      ]
    );
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, marginBottom: 16 }}>Editar movimiento</Text>

      {/* Tipo */}
      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        {["ingreso", "retiro"].map((t) => (
          <Pressable
            key={t}
            onPress={() => setTipo(t as any)}
            style={{
              flex: 1,
              padding: 12,
              backgroundColor: tipo === t ? "#000" : "#ddd",
            }}
          >
            <Text
              style={{
                color: tipo === t ? "#fff" : "#000",
                textAlign: "center",
              }}
            >
              {t === "ingreso" ? "Ingreso" : "Retiro"}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        placeholder="Monto"
        keyboardType="numeric"
        value={monto}
        onChangeText={setMonto}
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      <TextInput
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      <Pressable
        onPress={() => setShowPicker(true)}
        style={{ borderWidth: 1, padding: 12, marginBottom: 16 }}
      >
        <Text>Fecha: {fecha.toLocaleDateString()}</Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          onChange={(_, d) => {
            setShowPicker(false);
            if (d) setFecha(d);
          }}
        />
      )}

      <Pressable
        onPress={guardar}
        style={{ padding: 16, backgroundColor: "#000", marginBottom: 12 }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Guardar cambios
        </Text>
      </Pressable>

      <Pressable
        onPress={confirmarEliminar}
        style={{
          padding: 16,
          backgroundColor: "#b00020",
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Eliminar movimiento
        </Text>
      </Pressable>
    </View>
  );
}
