import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Category } from '../types/category';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    onCategoriesUpdate: (categories: Category[]) => void;
    currentCategories: Category[];
}

const STORAGE_KEY = '@MyFinances:customCategories';
const COLORS = {
    primary: '#2ecc71',
    error: '#e74c3c',
    text: '#e0e0e0',
    background: '#1a1a1a',
    containerBg: '#2c2c2c',
    border: '#444',
    placeholder: '#999',
};

const DEFAULT_COLOR_OPTIONS = [
    '#e74c3c', '#2ecc71', '#3498db', '#f1c40f', '#9b59b6',
    '#1abc9c', '#e67e22', '#34495e', '#8e44ad', '#16a085',
    '#d35400', '#c0392b', '#27ae60', '#2980b9', '#f39c12'
];

export const CategoryManager = ({ isVisible, onClose, onCategoriesUpdate, currentCategories }: Props) => {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR_OPTIONS[0]);

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            Alert.alert('Erro', 'O nome da categoria é obrigatório');
            return;
        }

        const value = newCategoryName.toLowerCase().replace(/\s+/g, '-');
        
        // Verifica se já existe uma categoria com esse nome
        if (currentCategories.some(cat => cat.value === value)) {
            Alert.alert('Erro', 'Já existe uma categoria com esse nome');
            return;
        }

        const newCategory: Category = {
            value,
            label: newCategoryName.trim(),
            color: selectedColor,
            isCustom: true
        };

        const updatedCategories = [...currentCategories, newCategory];
        
        try {
            const customCategories = updatedCategories.filter(cat => cat.isCustom);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(customCategories));
            onCategoriesUpdate(updatedCategories);
            setNewCategoryName('');
            setSelectedColor(DEFAULT_COLOR_OPTIONS[0]);
        } catch (error) {
            console.error('Erro ao salvar categoria:', error);
            Alert.alert('Erro', 'Não foi possível salvar a categoria');
        }
    };

    const handleDeleteCategory = async (category: Category) => {
        if (!category.isCustom) {
            Alert.alert('Erro', 'Não é possível excluir categorias predefinidas');
            return;
        }

        Alert.alert(
            'Confirmar exclusão',
            `Deseja realmente excluir a categoria "${category.label}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        const updatedCategories = currentCategories.filter(
                            cat => cat.value !== category.value
                        );
                        
                        try {
                            const customCategories = updatedCategories.filter(cat => cat.isCustom);
                            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(customCategories));
                            onCategoriesUpdate(updatedCategories);
                        } catch (error) {
                            console.error('Erro ao excluir categoria:', error);
                            Alert.alert('Erro', 'Não foi possível excluir a categoria');
                        }
                    }
                }
            ]
        );
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Gerenciar Categorias</Text>

                    <View style={styles.addCategorySection}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome da nova categoria"
                            placeholderTextColor={COLORS.placeholder}
                            value={newCategoryName}
                            onChangeText={setNewCategoryName}
                        />
                        
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPicker}>
                            {DEFAULT_COLOR_OPTIONS.map(color => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.colorOption,
                                        { backgroundColor: color },
                                        selectedColor === color && styles.selectedColor
                                    ]}
                                    onPress={() => setSelectedColor(color)}
                                />
                            ))}
                        </ScrollView>

                        <TouchableOpacity 
                            style={styles.addButton}
                            onPress={handleAddCategory}
                        >
                            <Text style={styles.buttonText}>Adicionar Categoria</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.categoriesList}>
                        {currentCategories.map((category) => (
                            <View key={category.value} style={styles.categoryItem}>
                                <View style={styles.categoryInfo}>
                                    <View 
                                        style={[
                                            styles.categoryColor,
                                            { backgroundColor: category.color }
                                        ]} 
                                    />
                                    <Text style={styles.categoryName}>{category.label}</Text>
                                </View>
                                {category.isCustom && (
                                    <TouchableOpacity
                                        onPress={() => handleDeleteCategory(category)}
                                        style={styles.deleteButton}
                                    >
                                        <Text style={styles.deleteButtonText}>Excluir</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity 
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxWidth: 500,
        backgroundColor: COLORS.containerBg,
        borderRadius: 10,
        padding: 20,
        maxHeight: '90%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 20,
    },
    addCategorySection: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: COLORS.background,
        borderRadius: 8,
        padding: 12,
        color: COLORS.text,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 10,
    },
    colorPicker: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    colorOption: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedColor: {
        borderColor: COLORS.text,
    },
    categoriesList: {
        maxHeight: 300,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: COLORS.background,
        borderRadius: 8,
        marginBottom: 8,
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    categoryColor: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 10,
    },
    categoryName: {
        color: COLORS.text,
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: COLORS.error,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    deleteButtonText: {
        color: COLORS.text,
        fontSize: 12,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: COLORS.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: COLORS.border,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
});