// context/StatsContext.tsx
// @ts-nocheck
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@user_stats";

const defaultStats = {
  totalRegistrosDespesas: 0,
  relatoriosMensaisConcluidos: 0,
  relatoriosAnuaisConcluidos: 0,
  diasSemGastarDespesa: 0,
  saldoPositivoMes: false,
  depositoCasa: 0,
  depositoPoupanca: 0,
  semGastosCartaoCredito: false,
  diasSemLanches: 0,
  diasAcompanhandoDespesas: 0,
  metasFinanceirasBatidas: 0,
  totalGuardadoPoupanca: 0,
  diasSemAtrasarContas: 0,
  montouGraficoMensal: false,
  economizou50EmUmDia: false,
  diasSemSupérfluos: 0,
  totalEconomizado: 0,
  registrouDespesaAntesDas9: false,
  revisouRelatorioMensal: false,
  comecouMesComSaldoPositivo: false,
  criouFundoEmergencia: false,
  leuEducacaoFinanceira: false,
};

const StatsContext = createContext({
  stats: defaultStats,
  updateStats: (_partial: any) => {},
});

export function StatsProvider({ children }) {
  const [stats, setStats] = useState(defaultStats);

  /* 🔥 CARREGAR STATS DO STORAGE */
  useEffect(() => {
    const loadStats = async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setStats(JSON.parse(saved));
      }
    };
    loadStats();
  }, []);

  /* 💾 ATUALIZAR + SALVAR */
  const updateStats = async (partial) => {
    const updated = { ...stats, ...partial };
    setStats(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <StatsContext.Provider value={{ stats, updateStats }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  return useContext(StatsContext);
}
