export interface Category {
    value: string;
    label: string;
    color: string;
    isCustom?: boolean;
}

export const DEFAULT_CATEGORIES: Category[] = [
    { value: 'saude', label: 'Saúde', color: '#e74c3c' },
    { value: 'lazer', label: 'Lazer', color: '#2ecc71' },
    { value: 'alimentacao', label: 'Alimentação', color: '#3498db' },
    { value: 'transporte', label: 'Transporte', color: '#f1c40f' },
    { value: 'moradia', label: 'Moradia', color: '#9b59b6' },
    { value: 'educacao', label: 'Educação', color: '#1abc9c' },
    { value: 'vestuario', label: 'Vestuário', color: '#e67e22' },
    { value: 'tecnologia', label: 'Tecnologia', color: '#34495e' },
    { value: 'outros', label: 'Outros', color: '#95a5a5' }
];