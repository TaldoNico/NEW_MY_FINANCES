// context/ReportsContext.tsx
// @ts-nocheck
import React, { createContext, useContext, useState } from "react";

/* =====================
   TIPOS
===================== */

export interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: string;
}

export interface Report {
  id: string;
  name: string;
  color: string;
  date: string; // ex: 2025-01
  transactions: Transaction[];
}

export interface ReportsContextType {
  reports: Report[];

  currentReport: Report | null;
  setCurrentReport: (report: Report | null) => void;

  addReport: (data: Omit<Report, "id" | "transactions">) => void;
  updateReport: (id: string, report: Partial<Report>) => void;
  deleteReport: (id: string) => void;

  addTransactionToReport: (
    reportId: string,
    transaction: Transaction
  ) => void;
}

/* =====================
   CONTEXT
===================== */

export const ReportsContext = createContext<
  ReportsContextType | undefined
>(undefined);

/* =====================
   PROVIDER
===================== */

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);

  /* =====================
     CRIAR RELATÓRIO
  ===================== */
  const addReport = (data: Omit<Report, "id" | "transactions">) => {
    const newReport: Report = {
      id: Date.now().toString(),
      ...data,
      transactions: [],
    };

    setReports((prev) => [...prev, newReport]);
    setCurrentReport(newReport); // 🔥 ESSENCIAL
  };

  /* =====================
     ATUALIZAR RELATÓRIO
  ===================== */
  const updateReport = (id: string, updatedData: Partial<Report>) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r))
    );

    if (currentReport?.id === id) {
      setCurrentReport((prev) =>
        prev ? { ...prev, ...updatedData } : prev
      );
    }
  };

  /* =====================
     DELETAR RELATÓRIO
  ===================== */
  const deleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));

    if (currentReport?.id === id) {
      setCurrentReport(null);
    }
  };

  /* =====================
     ADICIONAR TRANSAÇÃO
  ===================== */
  const addTransactionToReport = (
    reportId: string,
    transaction: Transaction
  ) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, transactions: [...r.transactions, transaction] }
          : r
      )
    );

    if (currentReport?.id === reportId) {
      setCurrentReport((prev) =>
        prev
          ? { ...prev, transactions: [...prev.transactions, transaction] }
          : prev
      );
    }
  };

  return (
    <ReportsContext.Provider
      value={{
        reports,
        currentReport,
        setCurrentReport,
        addReport,
        updateReport,
        deleteReport,
        addTransactionToReport,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
}

/* =====================
   HOOK
===================== */

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error("useReports must be used within ReportsProvider");
  }
  return context;
}
