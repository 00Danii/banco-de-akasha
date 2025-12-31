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
  updatePersona: (id: string, data: Partial<Persona>) => void;

  addMovimiento: (personaId: string, movimiento: Movimiento) => void;
  updateMovimiento: (
    personaId: string,
    movimientoId: string,
    data: Partial<Movimiento>
  ) => void;
  deleteMovimiento: (personaId: string, movimientoId: string) => void;
};

const calcularSaldo = (movimientos: Movimiento[]) =>
  movimientos.reduce(
    (acc, m) => (m.tipo === "ingreso" ? acc + m.monto : acc - m.monto),
    0
  );

export const usePersonsStore = create<State>()(
  persist(
    (set) => ({
      personas: [],

      addPersona: (persona) =>
        set((state) => ({
          personas: [...state.personas, persona],
        })),

      updatePersona: (id, data) =>
        set((state) => ({
          personas: state.personas.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),

      addMovimiento: (personaId, movimiento) =>
        set((state) => ({
          personas: state.personas.map((p) => {
            if (p.id !== personaId) return p;

            const movimientos = [...p.movimientos, movimiento];

            return {
              ...p,
              movimientos,
              saldo: calcularSaldo(movimientos),
            };
          }),
        })),

      updateMovimiento: (personaId, movimientoId, data) =>
        set((state) => ({
          personas: state.personas.map((p) => {
            if (p.id !== personaId) return p;

            const movimientos = p.movimientos.map((m) =>
              m.id === movimientoId ? { ...m, ...data } : m
            );

            return {
              ...p,
              movimientos,
              saldo: calcularSaldo(movimientos),
            };
          }),
        })),

      deleteMovimiento: (personaId, movimientoId) =>
        set((state) => ({
          personas: state.personas.map((p) => {
            if (p.id !== personaId) return p;

            const movimientos = p.movimientos.filter(
              (m) => m.id !== movimientoId
            );

            return {
              ...p,
              movimientos,
              saldo: calcularSaldo(movimientos),
            };
          }),
        })),
    }),
    {
      name: "persons-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
