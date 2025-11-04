import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Category } from '../types/category';
import { Transaction } from '../types/transaction';
import { analyzeFinances } from '../utils/financial-analysis';

interface FinancialReportProps {
    isVisible: boolean;
    onClose: () => void;
    transactions: Transaction[];
    categories: Category[];
    previousMonthTransactions?: Transaction[];
}

const COLORS = {
    primary: '#2ecc71',
    error: '#e74c3c',
    warning: '#f1c40f',
    background: '#1a1a1a',
    containerBg: '#2c2c2c',
    listBg: '#3a3a3a',
    text: '#e0e0e0',
    border: '#444',
};

export const FinancialReport = ({ 
    isVisible, 
    onClose, 
    transactions,
    categories,
    previousMonthTransactions 
}: FinancialReportProps) => {
    const analysis = analyzeFinances(transactions, categories, previousMonthTransactions);

    const formatCurrency = (value: number): string => {
        return `R$ ${Math.abs(value).toFixed(2).replace('.', ',')}`;
    };

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Análise Financeira</Text>

                    <ScrollView style={styles.scrollContent}>
                        {/* Saldo Mensal */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Saldo do Período</Text>
                            <Text style={[
                                styles.balanceValue,
                                { color: analysis.monthlyBalance >= 0 ? COLORS.primary : COLORS.error }
                            ]}>
                                {analysis.monthlyBalance >= 0 ? '+ ' : '- '}
                                {formatCurrency(analysis.monthlyBalance)}
                            </Text>
                        </View>

                        {/* Taxa de Economia */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Taxa de Economia</Text>
                            <View style={styles.savingsContainer}>
                                <View style={[
                                    styles.savingsBar,
                                    { width: `${Math.min(100, Math.max(0, analysis.savingsRate))}%` }
                                ]} />
                                <Text style={styles.savingsText}>
                                    {analysis.savingsRate.toFixed(1)}%
                                </Text>
                            </View>
                        </View>

                        {/* Maior Categoria de Gasto */}
                        {analysis.biggestExpenseCategory.name && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Maior Gasto</Text>
                                <Text style={styles.categoryText}>
                                    {analysis.biggestExpenseCategory.name}:
                                    {' '}{formatCurrency(analysis.biggestExpenseCategory.value)}
                                    {' '}({analysis.biggestExpenseCategory.percentage.toFixed(1)}%)
                                </Text>
                            </View>
                        )}

                        {/* Gastos Incomuns */}
                        {analysis.unusualExpenses.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Gastos Incomuns</Text>
                                {analysis.unusualExpenses.map((expense, index) => (
                                    <Text key={index} style={styles.warningText}>
                                        {expense.category}: +{expense.increase.toFixed(1)}%
                                    </Text>
                                ))}
                            </View>
                        )}

                        {/* Dicas */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Dicas e Observações</Text>
                            {analysis.tips.map((tip, index) => (
                                <View key={index} style={styles.tipContainer}>
                                    <Text style={styles.tipText}>{tip}</Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxWidth: 500,
        maxHeight: '90%',
        backgroundColor: COLORS.containerBg,
        borderRadius: 12,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 20,
    },
    scrollContent: {
        maxHeight: '80%',
    },
    section: {
        backgroundColor: COLORS.listBg,
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10,
    },
    balanceValue: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    savingsContainer: {
        height: 30,
        backgroundColor: COLORS.background,
        borderRadius: 15,
        overflow: 'hidden',
        position: 'relative',
    },
    savingsBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        backgroundColor: COLORS.primary,
    },
    savingsText: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        lineHeight: 30,
        color: COLORS.text,
        fontWeight: 'bold',
    },
    categoryText: {
        color: COLORS.text,
        fontSize: 16,
    },
    warningText: {
        color: COLORS.warning,
        fontSize: 16,
        marginBottom: 5,
    },
    tipContainer: {
        backgroundColor: COLORS.background,
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    tipText: {
        color: COLORS.text,
        fontSize: 14,
        lineHeight: 20,
    },
    closeButton: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 8,
        marginTop: 15,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});