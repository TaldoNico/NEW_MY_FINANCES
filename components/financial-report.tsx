// @ts-nocheck
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
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

    const exportReport = async () => {
        const htmlContent = `
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { color: #2ecc71; text-align: center; }
                        .section { margin-bottom: 20px; border: 1px solid #ddd; padding: 10px; border-radius: 5px; }
                        .balance { font-size: 24px; font-weight: bold; text-align: center; }
                        .positive { color: green; }
                        .negative { color: red; }
                        .tip { background-color: #f9f9f9; padding: 10px; margin: 5px 0; border-radius: 5px; }
                    </style>
                </head>
                <body>
                    <h1>Relatório Financeiro - MyFinances</h1>
                    <div class="section">
                        <h2>Saldo do Período</h2>
                        <p class="balance ${analysis.monthlyBalance >= 0 ? 'positive' : 'negative'}">
                            ${analysis.monthlyBalance >= 0 ? '+ ' : '- '} ${formatCurrency(analysis.monthlyBalance)}
                        </p>
                    </div>
                    <div class="section">
                        <h2>Taxa de Economia</h2>
                        <p>${analysis.savingsRate.toFixed(1)}%</p>
                    </div>
                    ${analysis.biggestExpenseCategory.name ? `
                    <div class="section">
                        <h2>Maior Gasto</h2>
                        <p>${analysis.biggestExpenseCategory.name}: ${formatCurrency(analysis.biggestExpenseCategory.value)} (${analysis.biggestExpenseCategory.percentage.toFixed(1)}%)</p>
                    </div>
                    ` : ''}
                    ${analysis.unusualExpenses.length > 0 ? `
                    <div class="section">
                        <h2>Gastos Incomuns</h2>
                        ${analysis.unusualExpenses.map(expense => `<p>${expense.category}: +${expense.increase.toFixed(1)}%</p>`).join('')}
                    </div>
                    ` : ''}
                    <div class="section">
                        <h2>Dicas e Observações</h2>
                        ${analysis.tips.map(tip => `<div class="tip">${tip}</div>`).join('')}
                    </div>
                </body>
            </html>
        `;
        try {
            const { uri } = await Print.printToFileAsync({ html: htmlContent });
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Compartilhar Relatório Financeiro' });
            } else {
                alert('Compartilhamento não disponível neste dispositivo.');
            }
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            alert('Erro ao gerar o relatório.');
        }
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

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.exportButton} onPress={exportReport}>
                            <Text style={styles.exportButtonText}>Enviar Relatório</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
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
        alignItems: 'center',
        flex: 1,
        marginLeft: 10,
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 15,
    },
    exportButton: {
        backgroundColor: COLORS.warning,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    exportButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});