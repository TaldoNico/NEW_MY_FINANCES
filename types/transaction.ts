export interface Transaction {
    id: string;
    descricao: string;
    valor: number;
    tipo: 'entrada' | 'saida';
    categoria?: string;
    data: string;
}

export interface ChartData {
    name: string;
    population: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
}

export interface SelectOption {
    label: string;
    value: string;
}