export interface Order {
    id?: number;
    customerCompanyId: string;
    supplierCompanyId: string;
    productIds: string[];
}

export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
}

export interface Company {
    id: string;
    name: string;
    type?: 'customer' | 'supplier';
}

export interface RootState {
    orders: Order[];
    companies: Company[];
    loading: boolean;
}

export interface OrderFormData {
    id?: number | null;
    customerCompanyId: string | null;
    supplierCompanyId: string | null;
    productIds: number[];
    status: string;
}
