import { usePersonsStore } from "@/src/store/usePersonsStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Crypto from "expo-crypto";
import { router, Stack, useLocalSearchParams } from "expo-router";
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
    if (!monto) return;

    addMovimiento(personaId!, {
      id: Crypto.randomUUID(),
      tipo,
      monto: Number(monto),
      descripcion,
      fecha: fecha.toISOString(),
    });

    router.back();
  };

  const colorTipo = tipo === "ingreso" ? "#3aff7a" : "#ff4d4d";

  return (
    <>
      <Stack.Screen
        options={{
          title: "Nuevo movimiento",
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
        {/* Selector de tipo */}
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

        {/* Card del formulario */}
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
          <Text
            style={{
              color: "#aaa",
              fontSize: 14,
              marginBottom: 6,
            }}
          >
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
          <Text
            style={{
              color: "#aaa",
              fontSize: 14,
              marginBottom: 6,
            }}
          >
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
            onPress={() => setMostrarPicker(true)}
            style={{
              paddingVertical: 12,
              borderTopWidth: 1,
              borderColor: "#222",
            }}
          >
            <Text style={{ color: "#aaa", fontSize: 14 }}>Fecha</Text>
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                marginTop: 4,
              }}
            >
              {fecha.toLocaleDateString()}
            </Text>
          </Pressable>
        </View>

        {mostrarPicker && (
          <DateTimePicker
            value={fecha}
            mode="date"
            display="default"
            onChange={(_, selectedDate) => {
              setMostrarPicker(false);
              if (selectedDate) setFecha(selectedDate);
            }}
          />
        )}

        {/* Botón guardar */}
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
            Guardar movimiento
          </Text>
        </Pressable>
      </View>
    </>
  );
}
