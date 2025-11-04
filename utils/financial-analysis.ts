import { Category } from '../types/category';
import { Transaction } from '../types/transaction';

interface FinancialAnalysis {
    monthlyBalance: number;
    biggestExpenseCategory: {
        name: string;
        value: number;
        percentage: number;
    };
    unusualExpenses: Array<{
        category: string;
        increase: number;
    }>;
    savingsRate: number;
    tips: string[];
}

export function analyzeFinances(
    transactions: Transaction[], 
    categories: Category[],
    previousMonthTransactions?: Transaction[]
): FinancialAnalysis {
    // Calcula o saldo mensal
    const monthlyBalance = transactions.reduce(
        (acc, t) => acc + (t.tipo === 'entrada' ? t.valor : -t.valor),
        0
    );

    // Calcula gastos totais e por categoria
    const expenses = transactions.filter(t => t.tipo === 'saida');
    const totalExpenses = expenses.reduce((acc, t) => acc + t.valor, 0);
    
    // Agrupa gastos por categoria
    const expensesByCategory = expenses.reduce<Record<string, number>>((acc, t) => {
        const category = t.categoria || 'outros';
        acc[category] = (acc[category] || 0) + t.valor;
        return acc;
    }, {});

    // Encontra a categoria com maior gasto
    let biggestExpenseCategory = {
        name: '',
        value: 0,
        percentage: 0
    };

    Object.entries(expensesByCategory).forEach(([category, value]) => {
        if (value > biggestExpenseCategory.value) {
            const categoryObj = categories.find(c => c.value === category);
            biggestExpenseCategory = {
                name: categoryObj?.label || category,
                value,
                percentage: (value / totalExpenses) * 100
            };
        }
    });

    // Calcula a taxa de economia (entradas - saídas) / entradas
    const totalIncome = transactions
        .filter(t => t.tipo === 'entrada')
        .reduce((acc, t) => acc + t.valor, 0);
    
    const savingsRate = totalIncome > 0 
        ? ((totalIncome - totalExpenses) / totalIncome) * 100 
        : 0;

    // Analisa gastos incomuns (comparando com mês anterior se disponível)
    const unusualExpenses: Array<{category: string; increase: number}> = [];
    
    if (previousMonthTransactions) {
        const previousExpenses = previousMonthTransactions
            .filter(t => t.tipo === 'saida')
            .reduce<Record<string, number>>((acc, t) => {
                const category = t.categoria || 'outros';
                acc[category] = (acc[category] || 0) + t.valor;
                return acc;
            }, {});

        Object.entries(expensesByCategory).forEach(([category, value]) => {
            const previousValue = previousExpenses[category] || 0;
            if (previousValue > 0) {
                const increase = ((value - previousValue) / previousValue) * 100;
                if (increase > 30) { // Aumento de 30% ou mais
                    const categoryObj = categories.find(c => c.value === category);
                    unusualExpenses.push({
                        category: categoryObj?.label || category,
                        increase
                    });
                }
            }
        });
    }

    // Gera dicas personalizadas baseadas na análise
    const tips: string[] = [];

    // Dicas baseadas no saldo
    if (monthlyBalance < 0) {
        tips.push('🚨 Atenção: Seu saldo está negativo este mês. Considere reduzir gastos não essenciais.');
    }

    // Dicas baseadas na categoria de maior gasto
    if (biggestExpenseCategory.percentage > 40) {
        tips.push(`📊 ${biggestExpenseCategory.name} representa ${biggestExpenseCategory.percentage.toFixed(1)}% dos seus gastos. Considere buscar alternativas para reduzir esta despesa.`);
    }

    // Dicas baseadas na taxa de economia
    if (savingsRate < 10) {
        tips.push('💰 Sua taxa de economia está baixa. Tente guardar pelo menos 20% da sua renda.');
    } else if (savingsRate >= 20) {
        tips.push('🌟 Parabéns! Você está mantendo uma boa taxa de economia. Continue assim!');
    }

    // Dicas baseadas em gastos incomuns
    unusualExpenses.forEach(({category, increase}) => {
        tips.push(`⚠️ Seus gastos em ${category} aumentaram ${increase.toFixed(1)}% em relação ao mês anterior.`);
    });

    // Dicas gerais baseadas em padrões
    if (Object.keys(expensesByCategory).length <= 2) {
        tips.push('📝 Tente categorizar melhor seus gastos para ter uma visão mais clara de suas finanças.');
    }

    return {
        monthlyBalance,
        biggestExpenseCategory,
        unusualExpenses,
        savingsRate,
        tips
    };
}