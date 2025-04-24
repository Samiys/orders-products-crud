import type { Order } from '@/interfaces/types';

const API = 'http://localhost:3000/orders';

class OrderService {
    async fetchOrders(): Promise<Order[]> {
        const res = await fetch(API);
        return res.json();
    }

    async createOrder(order: Order): Promise<Order> {
        const res = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        return res.json();
    }

    async deleteOrder(id: number): Promise<void> {
        await fetch(`${API}/${id}`, { method: 'DELETE' });
    }

    async updateOrder(order: Order): Promise<Order> {
        const res = await fetch(`${API}/${order.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        return res.json();
    }
}

export default new OrderService();
