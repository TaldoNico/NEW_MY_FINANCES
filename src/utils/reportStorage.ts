import AsyncStorage from '@react-native-async-storage/async-storage';

const ACTIVE_REPORT_KEY = '@active_report_id';

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
