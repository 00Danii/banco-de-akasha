import { usePersonsStore } from "@/src/store/usePersonsStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, Stack, useLocalSearchParams } from "expo-router";
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

  const [tipo, setTipo] = useState<"ingreso" | "retiro">(
    movimiento?.tipo ?? "ingreso"
  );
  const [monto, setMonto] = useState(String(movimiento?.monto ?? ""));
  const [descripcion, setDescripcion] = useState(movimiento?.descripcion ?? "");
  const [fecha, setFecha] = useState(
    movimiento ? new Date(movimiento.fecha) : new Date()
  );
  const [showPicker, setShowPicker] = useState(false);

  if (!movimiento) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#666" }}>Movimiento no encontrado</Text>
      </View>
    );
  }

  const colorTipo = tipo === "ingreso" ? "#3aff7a" : "#ff4d4d";

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
      "¿Estás seguro? Esta acción no se puede deshacer.",
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
    <>
      <Stack.Screen
        options={{
          title: "Editar movimiento",
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
        {/* Selector tipo */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#0A0A0A",
            borderRadius: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: `${colorTipo}55`,
          }}
        >
          <Pressable
            onPress={() => setTipo("ingreso")}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 16,
              backgroundColor: tipo === "ingreso" ? "#111" : "transparent",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: "600",
                color: tipo === "ingreso" ? "#3aff7a" : "#666",
              }}
            >
              Ingreso
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setTipo("retiro")}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 16,
              backgroundColor: tipo === "retiro" ? "#111" : "transparent",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: "600",
                color: tipo === "retiro" ? "#ff4d4d" : "#666",
              }}
            >
              Retiro
            </Text>
          </Pressable>
        </View>

        {/* Card formulario */}
        <View
          style={{
            backgroundColor: "#0A0A0A",
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: "#222",
          }}
        >
          {/* Monto */}
          <Text style={{ color: "#aaa", fontSize: 14, marginBottom: 6 }}>
            Monto
          </Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#444"
            keyboardType="numeric"
            value={monto}
            onChangeText={setMonto}
            style={{
              fontSize: 24,
              color: "#fff",
              fontWeight: "600",
              paddingVertical: 8,
              marginBottom: 16,
            }}
          />

          {/* Descripción */}
          <Text style={{ color: "#aaa", fontSize: 14, marginBottom: 6 }}>
            Descripción
          </Text>
          <TextInput
            placeholder="Opcional"
            placeholderTextColor="#444"
            value={descripcion}
            onChangeText={setDescripcion}
            style={{
              color: "#fff",
              fontSize: 16,
              paddingVertical: 8,
              marginBottom: 16,
            }}
          />

          {/* Fecha */}
          <Pressable
            onPress={() => setShowPicker(true)}
            style={{
              paddingVertical: 12,
              borderTopWidth: 1,
              borderColor: "#222",
            }}
          >
            <Text style={{ color: "#aaa", fontSize: 14 }}>Fecha</Text>
            <Text style={{ color: "#fff", fontSize: 16, marginTop: 4 }}>
              {fecha.toLocaleDateString()}
            </Text>
          </Pressable>
        </View>

        {showPicker && (
          <DateTimePicker
            value={fecha}
            mode="date"
            display="default"
            onChange={(_, d) => {
              setShowPicker(false);
              if (d) setFecha(d);
            }}
          />
        )}

        {/* Guardar */}
        <Pressable
          onPress={guardar}
          style={({ pressed }) => ({
            marginTop: 24,
            paddingVertical: 16,
            borderRadius: 16,
            backgroundColor: colorTipo,
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
            Eliminar movimiento
          </Text>
        </Pressable>
      </View>
    </>
  );
}
