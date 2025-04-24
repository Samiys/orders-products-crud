import type { Product } from '@/interfaces/types';

const API = 'http://localhost:3000/products';

class ProductService {
    async fetchProducts(): Promise<Product[]> {
        const res = await fetch(API);
        return res.json();
    }

    async createProduct(product: Product): Promise<Product> {
        const res = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        return res.json();
    }

    async deleteProduct(id: number): Promise<void> {
        await fetch(`${API}/${id}`, { method: 'DELETE' });
    }

    async updateProduct(product: Product): Promise<Product> {
        const res = await fetch(`${API}/${product.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        return res.json();
    }
}

export default new ProductService();
