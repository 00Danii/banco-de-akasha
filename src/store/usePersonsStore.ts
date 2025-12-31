import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Movimiento = {
  id: string;
  tipo: "ingreso" | "retiro";
  monto: number;
  descripcion: string;
  fecha: string;
  fotoUri?: string;
};

export type Persona = {
  id: string;
  nombre: string;
  color: string;
  fotoUri?: string;
  saldo: number;
  movimientos: Movimiento[];
};

type State = {
  personas: Persona[];
  addPersona: (persona: Persona) => void;
  addMovimiento: (personaId: string, movimiento: Movimiento) => void;
  updatePersona: (id: string, data: Partial<Persona>) => void;
};

export const usePersonsStore = create<State>()(
  persist(
    (set, get) => ({
      personas: [],

      addPersona: (persona) =>
        set((state) => ({
          personas: [...state.personas, persona],
        })),

      addMovimiento: (personaId, movimiento) =>
        set((state) => ({
          personas: state.personas.map((p) => {
            if (p.id !== personaId) return p;

            const nuevoSaldo =
              movimiento.tipo === "ingreso"
                ? p.saldo + movimiento.monto
                : p.saldo - movimiento.monto;

            return {
              ...p,
              saldo: nuevoSaldo,
              movimientos: [...p.movimientos, movimiento],
            };
          }),
        })),

      updatePersona: (id, data) =>
        set((state) => ({
          personas: state.personas.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),
    }),
    {
      name: "persons-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
