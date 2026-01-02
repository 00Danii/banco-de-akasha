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
  saldoInicial?: number;
  movimientos: Movimiento[];
};

type State = {
  personas: Persona[];
  addPersona: (persona: Persona) => void;
  updatePersona: (id: string, data: Partial<Persona>) => void;
  deletePersona: (id: string) => void;

  addMovimiento: (personaId: string, movimiento: Movimiento) => void;
  updateMovimiento: (
    personaId: string,
    movimientoId: string,
    data: Partial<Movimiento>
  ) => void;
  deleteMovimiento: (personaId: string, movimientoId: string) => void;
};

const sumMovimientos = (movimientos: Movimiento[]) =>
  movimientos.reduce(
    (acc, m) => (m.tipo === "ingreso" ? acc + m.monto : acc - m.monto),
    0
  );

const calcularSaldo = (movimientos: Movimiento[], base = 0) =>
  base + sumMovimientos(movimientos);

export const usePersonsStore = create<State>()(
  persist(
    (set) => ({
      personas: [],

      addPersona: (persona) =>
        set((state) => ({
          personas: [
            ...state.personas,
            {
              ...persona,
              saldoInicial: persona.saldo ?? 0,
              saldo: persona.saldo ?? 0,
              movimientos: persona.movimientos ?? [],
            },
          ],
        })),

      updatePersona: (id, data) =>
        set((state) => ({
          personas: state.personas.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),

      deletePersona: (id) =>
        set((state) => ({
          personas: state.personas.filter((p) => p.id !== id),
        })),

      addMovimiento: (personaId, movimiento) =>
        set((state) => ({
          personas: state.personas.map((p) => {
            if (p.id !== personaId) return p;

            const movimientos = [...p.movimientos, movimiento];

            const base =
              p.saldoInicial !== undefined
                ? p.saldoInicial
                : p.saldo - sumMovimientos(p.movimientos);

            return {
              ...p,
              movimientos,
              saldo: calcularSaldo(movimientos, base),
            };
          }),
        })),

      updateMovimiento: (personaId, movimientoId, data) =>
        set((state) => ({
          personas: state.personas.map((p) => {
            if (p.id !== personaId) return p;

            const base =
              p.saldoInicial !== undefined
                ? p.saldoInicial
                : p.saldo - sumMovimientos(p.movimientos);

            const movimientos = p.movimientos.map((m) =>
              m.id === movimientoId ? { ...m, ...data } : m
            );

            return {
              ...p,
              movimientos,
              saldo: calcularSaldo(movimientos, base),
            };
          }),
        })),

      deleteMovimiento: (personaId, movimientoId) =>
        set((state) => ({
          personas: state.personas.map((p) => {
            if (p.id !== personaId) return p;

            const base =
              p.saldoInicial !== undefined
                ? p.saldoInicial
                : p.saldo - sumMovimientos(p.movimientos);

            const movimientos = p.movimientos.filter(
              (m) => m.id !== movimientoId
            );

            return {
              ...p,
              movimientos,
              saldo: calcularSaldo(movimientos, base),
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
