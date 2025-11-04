import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { CategoryManager } from '../../components/category-manager';
import { Category, DEFAULT_CATEGORIES } from '../../types/category';
import { ChartData, Transaction } from '../../types/transaction';

// --- Configurações e Constantes ---

const { width } = Dimensions.get('window');
const screenWidth = width;
const MAX_WIDTH = 700;
const isWideScreen = width >= MAX_WIDTH;

const COLORS = {
  primary: '#2ecc71',
  primaryHover: '#27ae60',
  error: '#e74c3c',
  listBg: '#3a3a3a',
  containerBg: '#2c2c2c',
  text: '#e0e0e0',
  background: '#1a1a1a',
  placeholder: '#999',
  border: '#444',
};

const TIPOS: Category[] = [
    { value: 'entrada', label: 'Entrada', color: COLORS.primary },
    { value: 'saida', label: 'Saída', color: COLORS.error }
];

// --- Funções Auxiliares ---

const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
  if (isNaN(numValue)) return 'R$ 0,00';
  return `R$ ${numValue.toFixed(2).replace('.', ',')}`;
};

const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

const formatCategoryDisplayName = (categoryValue: string, categoriesList: Category[]): string => {
  const category = categoriesList.find(c => c.value === categoryValue);
  if (category) {
      return category.label;
  }
  return categoryValue
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getCategoryColor = (categoryValue: string, categoriesList: Category[]): string => {
    const category = categoriesList.find(c => c.value === categoryValue);
    return category ? category.color : DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1].color;
};

const calculateCategoryTotals = (transactions: Transaction[], categoriesList: Category[]): ChartData[] => {
    const outputTransactions = transactions.filter(t => t.tipo === 'saida');
    
    const totals = outputTransactions.reduce<Record<string, number>>((acc, t) => {
        const cat = t.categoria || 'outros'; 
        acc[cat] = (acc[cat] || 0) + t.valor;
        return acc;
    }, {});

    return Object.keys(totals).map(categoryValue => {
        const totalValue = totals[categoryValue];
        const displayName = formatCategoryDisplayName(categoryValue, categoriesList);
        
        return {
            name: displayName,
            population: parseFloat(totalValue.toFixed(2)),
            color: getCategoryColor(categoryValue, categoriesList),
            legendFontColor: COLORS.text,
            legendFontSize: 12,
        };
    }).sort((a, b) => b.population - a.population);
};

// --- Componentes ---

interface SelectInputProps {
  placeholder: string;
  options: Category[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

const SelectInput = ({ placeholder, options, selectedValue, onValueChange, disabled = false }: SelectInputProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const displayOption = options.find(opt => opt.value === selectedValue);
  const displayValue = displayOption ? displayOption.label : placeholder;

  return (
    <>
      <TouchableOpacity 
        onPress={() => !disabled && setIsModalVisible(true)} 
        style={[styles.selectContainer, disabled && styles.inputDisabled]} 
        activeOpacity={disabled ? 1 : 0.7}
      >
        <Text style={[styles.selectText, !displayOption && { color: COLORS.placeholder }]}>
          {displayValue}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1} 
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>{placeholder}</Text>
            <ScrollView style={styles.optionsList}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    option.value === selectedValue && {
                      backgroundColor: option.color || COLORS.primary
                    }
                  ]}
                  onPress={() => {
                    onValueChange(option.value);
                    setIsModalVisible(false);
                  }}
                >
                  {option.color && (
                    <View 
                      style={[
                        styles.optionColor, 
                        { backgroundColor: option.color }
                      ]} 
                    />
                  )}
                  <Text 
                    style={[
                      styles.optionText,
                      option.value === selectedValue && styles.optionTextSelected
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: () => void;
  categories: Category[];
}

const TransactionItem = ({ transaction, onDelete, categories }: TransactionItemProps) => {
  const typeStyle = transaction.tipo === 'entrada' ? styles.entrada : styles.saida;
  
  let categoryLabel = '';
  if (transaction.tipo === 'saida' && transaction.categoria) {
      categoryLabel = formatCategoryDisplayName(transaction.categoria, categories);
  }

  return (
    <View style={[styles.transactionItem, typeStyle]}>
      <Text style={styles.transactionText}>
        <Text style={{fontWeight: 'bold'}}>{transaction.descricao}</Text> - {formatCurrency(transaction.valor)} 
        {categoryLabel ? ` (${categoryLabel})` : ''} ({transaction.data})
      </Text>
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <Text style={styles.deleteBtnText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function FinanceApp() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('entrada');
  const [categoria, setCategoria] = useState('');
  const [customCategoryText, setCustomCategoryText] = useState('');
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isCategoryManagerVisible, setIsCategoryManagerVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar transações
        const storedTransactions = await AsyncStorage.getItem('transactions');
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        }

        // Carregar categorias personalizadas
        const storedCategories = await AsyncStorage.getItem('@MyFinances:customCategories');
        if (storedCategories) {
          const customCategories = JSON.parse(storedCategories) as Category[];
          setCategories([...DEFAULT_CATEGORIES.slice(0, -1), ...customCategories, DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]]);
        }
      } catch (e) {
        console.error('Failed to load data:', e);
      }
    };
    loadData();
  }, []);

  const saveTransactions = useCallback(async (newTransactions: Transaction[]) => {
    try {
      await AsyncStorage.setItem('transactions', JSON.stringify(newTransactions));
      setTransactions(newTransactions);
    } catch (e) {
      console.error('Failed to save transactions.', e);
    }
  }, []);

  useEffect(() => {
    const newTotal = transactions.reduce(
      (acc, t) => acc + (t.tipo === 'entrada' ? t.valor : -t.valor),
      0
    );
    setTotal(newTotal);
    setChartData(calculateCategoryTotals(transactions, categories));
  }, [transactions, categories]);
  
  useEffect(() => {
    if (tipo === 'entrada') {
      setCategoria(''); 
      setCustomCategoryText('');
    }
  }, [tipo]);

  useEffect(() => {
    if (categoria !== 'outros') {
      setCustomCategoryText('');
    }
  }, [categoria]);

  const handleAddTransaction = () => {
    const parsedValor = parseFloat(valor.replace(',', '.'));
    let finalCategoryValue = categoria;

    if (categoria === 'outros') {
      finalCategoryValue = customCategoryText.trim().toLowerCase().replace(/\s+/g, '-');
      if (!finalCategoryValue) {
        Alert.alert('Erro', 'O campo "Outros (Especifique)" deve ser preenchido.');
        return;
      }
    }

    if (!descricao || isNaN(parsedValor) || parsedValor <= 0) {
      Alert.alert('Erro', 'Preencha a descrição e o valor corretamente.');
      return;
    }
    
    if (tipo === 'saida' && !finalCategoryValue) {
      Alert.alert('Erro', 'A Categoria é obrigatória para transações de Saída.');
      return;
    }

    const novaTransacao: Transaction = {
      descricao,
      valor: parsedValor,
      tipo,
      data: getCurrentDate(),
      id: Date.now().toString(),
      ...(tipo === 'saida' && finalCategoryValue && { categoria: finalCategoryValue }),
    };

    saveTransactions([novaTransacao, ...transactions]);

    setDescricao('');
    setValor('');
    setTipo('entrada');
    setCategoria('');
    setCustomCategoryText('');
  };

  const handleDeleteTransaction = (id: string) => {
    const newTransactions = transactions.filter(t => t.id !== id);
    saveTransactions(newTransactions);
  };
  
  const handleGenerateReport = () => {
    Alert.alert(
      'Gerar Relatório',
      'Funcionalidade de PDF não implementada (requer bibliotecas nativas como react-native-html-to-pdf).'
    );
  };
  
  const ChartLegend = () => (
    <View style={styles.chartLegend}>
      {chartData.map((data, index) => (
        <View key={index} style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: data.color }]} />
          <Text style={styles.legendText}>
            {data.name}: {formatCurrency(data.population)}
          </Text>
        </View>
      ))}
      {chartData.length === 0 && <Text style={styles.emptyText}>Sem gastos registrados para o gráfico.</Text>}
    </View>
  );
  
  const chartConfig = {
    backgroundColor: COLORS.listBg,
    backgroundGradientFrom: COLORS.listBg,
    backgroundGradientTo: COLORS.listBg,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    propsForLabels: {
      fontSize: 12,
      fontWeight: 'bold',
      fill: COLORS.text
    }
  };

  const isCategoryDisabled = tipo !== 'saida';
  const showCustomCategoryInput = tipo === 'saida' && categoria === 'outros';
  
  return (
    <SafeAreaView style={styles.fillScreen}> 
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.saldo}>
          <Text style={styles.saldoText}>
            Saldo Atual: <Text style={[styles.saldoValue, { color: total >= 0 ? COLORS.primary : COLORS.error }]}>
              {formatCurrency(total)}
            </Text>
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            placeholderTextColor={COLORS.placeholder}
            value={descricao}
            onChangeText={setDescricao}
          />
          <TextInput
            style={styles.input}
            placeholder="Valor"
            placeholderTextColor={COLORS.placeholder}
            value={valor}
            onChangeText={setValor}
            keyboardType="numeric"
          />
          
          <SelectInput
            placeholder="Tipo (Entrada/Saída)"
            selectedValue={tipo}
            options={TIPOS}
            onValueChange={(value) => setTipo(value as 'entrada' | 'saida')}
          />
          
          <SelectInput
            placeholder="Categoria (apenas para saídas)"
            disabled={isCategoryDisabled}
            selectedValue={categoria}
            options={categories}
            onValueChange={setCategoria}
          />
          
          <TouchableOpacity 
            style={[styles.buttonOutline, { marginBottom: 12 }]}
            onPress={() => setIsCategoryManagerVisible(true)}
          >
            <Text style={styles.buttonOutlineText}>Gerenciar Categorias</Text>
          </TouchableOpacity>
          
          {showCustomCategoryInput && (
            <TextInput
              style={styles.inputFullWidth}
              placeholder="Outros (Especifique a Nova Categoria)"
              placeholderTextColor={COLORS.placeholder}
              value={customCategoryText}
              onChangeText={setCustomCategoryText}
            />
          )}
          
          <TouchableOpacity onPress={handleAddTransaction} style={styles.buttonFull}>
            <Text style={styles.buttonText}>ADICIONAR</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsList}>
          <Text style={styles.h2}>Últimas Transações</Text>
          {transactions.length > 0 ? (
            transactions.map((t) => ( 
              <TransactionItem
                key={t.id}
                transaction={t}
                categories={categories}
                onDelete={() => handleDeleteTransaction(t.id)}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhuma transação registrada.</Text>
          )}
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.h2}>Gastos por Categoria</Text>
          
          {chartData.length > 0 ? (
            <PieChart
              data={chartData}
              width={isWideScreen ? MAX_WIDTH - 50 : screenWidth - 50}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
            />
          ) : (
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartPlaceholderText}>
                Registre saídas para visualizar o gráfico.
              </Text>
            </View>
          )}

          <ChartLegend />
        </View>

        <TouchableOpacity onPress={handleGenerateReport} style={styles.reportButton}>
          <Text style={styles.buttonText}>GERAR RELATÓRIO</Text>
        </TouchableOpacity>
      </ScrollView>

      <CategoryManager
        isVisible={isCategoryManagerVisible}
        onClose={() => setIsCategoryManagerVisible(false)}
        onCategoriesUpdate={setCategories}
        currentCategories={categories}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fillScreen: { 
    flex: 1, 
    backgroundColor: COLORS.background, 
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: COLORS.containerBg,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: COLORS.listBg,
  },
  optionColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  optionItemSelected: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.text,
    fontSize: 16,
  },
  optionTextSelected: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalCancelButton: {
    marginTop: 15,
    padding: 15,
    borderRadius: 8,
    backgroundColor: COLORS.error,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOutlineText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  container: { 
    padding: 25, 
    backgroundColor: COLORS.containerBg, 
    marginHorizontal: isWideScreen ? 'auto' : 0, 
    width: isWideScreen ? MAX_WIDTH : '100%', 
    flexGrow: 1, 
  },
  h2: { 
    color: COLORS.text, 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 15, 
  },
  saldo: { 
    textAlign: 'center', 
    marginBottom: 20, 
    padding: 15, 
    backgroundColor: COLORS.listBg, 
    borderRadius: 8, 
    alignItems: 'center', 
  },
  saldoText: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: COLORS.text, 
  },
  saldoValue: {},
  form: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginBottom: 25, 
  },
  input: { 
    width: isWideScreen ? '23%' : (width > 450 ? '48%' : '100%'), 
    padding: 12, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    borderRadius: 8, 
    fontSize: 14, 
    backgroundColor: COLORS.listBg, 
    color: COLORS.text, 
    marginBottom: 12, 
  },
  inputFullWidth: { 
    width: '100%', 
    padding: 12, 
    borderWidth: 1, 
    borderColor: COLORS.primary, 
    borderRadius: 8, 
    fontSize: 14, 
    backgroundColor: COLORS.listBg, 
    color: COLORS.text, 
    marginBottom: 12, 
  },
  selectContainer: { 
    width: isWideScreen ? '23%' : (width > 450 ? '48%' : '100%'), 
    padding: 12, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    borderRadius: 8, 
    backgroundColor: COLORS.listBg, 
    justifyContent: 'center', 
    marginBottom: 12, 
  },
  selectText: { 
    fontSize: 14, 
    color: COLORS.text, 
  },
  inputDisabled: { 
    opacity: 0.5, 
    backgroundColor: '#444', 
  },
  buttonFull: { 
    backgroundColor: COLORS.primary, 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '100%', 
    marginTop: 0, 
  },
  buttonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
  },
  reportButton: { 
    backgroundColor: COLORS.primary, 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 20, 
  },
  transactionsList: { 
    marginBottom: 20, 
  },
  transactionItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: COLORS.listBg, 
    padding: 12, 
    marginBottom: 10, 
    borderRadius: 8, 
    borderLeftWidth: 6, 
  },
  transactionText: { 
    color: COLORS.text, 
    flexShrink: 1, 
    marginRight: 10, 
  },
  entrada: { 
    borderLeftColor: COLORS.primary, 
  },
  saida: { 
    borderLeftColor: COLORS.error, 
  },
  deleteBtn: { 
    backgroundColor: COLORS.error, 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 4, 
    marginLeft: 'auto', 
  },
  deleteBtnText: { 
    color: 'white', 
    fontSize: 12, 
    fontWeight: 'bold', 
  },
  emptyText: { 
    color: COLORS.placeholder, 
    textAlign: 'center', 
    marginTop: 10, 
  },
  chartContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: COLORS.listBg,
    borderRadius: 15,
    alignItems: 'center',
  },
  chartPlaceholder: {
    height: 150,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 10,
    marginBottom: 10,
  },
  chartPlaceholderText: {
    color: COLORS.text,
    fontStyle: 'italic',
  },
  chartLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
    maxWidth: isWideScreen ? '45%' : '90%',
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    color: COLORS.text,
    fontSize: 12,
  }
});