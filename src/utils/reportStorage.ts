// src/utils/reportStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";

/* ======================================================
   🔹 RELATÓRIO ATIVO (JÁ EXISTIA – MANTIDO)
====================================================== */

const ACTIVE_REPORT_KEY = "@active_report_id";

export async function getReportStorageKey() {
  const reportId = await AsyncStorage.getItem(ACTIVE_REPORT_KEY);
  if (!reportId) return null;
  return `transactions_${reportId}`;
}

export async function loadReportTransactions() {
  const key = await getReportStorageKey();
  if (!key) return [];
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export async function saveReportTransactions(transactions: any[]) {
  const key = await getReportStorageKey();
  if (!key) return;
  await AsyncStorage.setItem(key, JSON.stringify(transactions));
}

/* ======================================================
   🔹 RELATÓRIOS DO USUÁRIO (NOVO – PARA CONQUISTAS)
====================================================== */

export async function getUserReports(userId: string) {
  const ref = collection(db, "users", userId, "reports");
  const snap = await getDocs(ref);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/* ======================================================
   🔹 ESTATÍSTICAS PARA CONQUISTAS
====================================================== */

export async function calculateReportStats(userId: string) {
  const reports = await getUserReports(userId);

  const totalRelatorios = reports.length;

  const meses = new Set(
    reports.map((r: any) => r.date)
  );

  return {
    totalRelatorios,
    relatoriosMensaisConcluidos: meses.size,
    relatoriosAnuaisConcluidos: meses.size >= 12 ? 1 : 0,
  };
}
