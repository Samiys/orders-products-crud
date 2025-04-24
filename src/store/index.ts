import { createStore } from 'vuex';
import type {Company, Order, Product} from '@/interfaces/types';
import orderService from '@/services/OrderService';
import productService from '@/services/ProductService';
import companyService from '@/services/CompanyService';

interface State {
    orders: Order[];
    loading: boolean;
    products: Product[];
    productLoading: boolean;
    companies: Company[],
}

export default createStore<State>({
    state: {
        orders: [],
        loading: false,
        products: [],
        companies: [],
        productLoading: false
    },
    mutations: {
        setCompanies(state, companies: Company[]) {
            state.companies = companies;
        },
        setOrders(state, orders: Order[]) {
            state.orders = orders;
        },
        setLoading(state, loading: boolean) {
            state.loading = loading;
        },
        addOrder(state, order: Order) {
            state.orders.push(order);
        },
        removeOrder(state, id: number) {
            state.orders = state.orders.filter(o => o.id !== id);
        },
        updateOrder(state, updated: Order) {
            const index = state.orders.findIndex(o => o.id === updated.id);
            if (index !== -1) state.orders[index] = updated;
        },
        setProducts(state, products: Product[]) {
            state.products = products;
        },
        setProductLoading(state, loading: boolean) {
            state.productLoading = loading;
        },
        addProduct(state, product: Product) {
            state.products.push(product);
        },
        removeProduct(state, id: number) {
            state.products = state.products.filter(p => p.id !== id);
        },
        updateProduct(state, updated: Product) {
            const index = state.products.findIndex(p => p.id === updated.id);
            if (index !== -1) state.products[index] = updated;
        }
    },
    actions: {
        async loadOrders({ commit }) {
            commit('setLoading', true);
            const orders = await orderService.fetchOrders();
            commit('setOrders', orders);
            commit('setLoading', false);
        },
        async addOrder({ commit }, order: Order) {
            const newOrder = await orderService.createOrder(order);
            commit('addOrder', newOrder);
        },
        async removeOrder({ commit }, id: number) {
            await orderService.deleteOrder(id);
            commit('removeOrder', id);
        },
        async editOrder({ commit }, updated: Order) {
            const order = await orderService.updateOrder(updated);
            commit('updateOrder', order);
        },
        async loadCompanies({ commit }) {
            const companies = await companyService.fetchCompanies();
            commit('setCompanies', companies);
        },
        async loadProducts({ commit }) {
            commit('setProductLoading', true);
            const products = await productService.fetchProducts();
            commit('setProducts', products);
            commit('setProductLoading', false);
        },
        async addProduct({ commit }, product: Product) {
            const newProduct = await productService.createProduct(product);
            commit('addProduct', newProduct);
        },
        async removeProduct({ commit }, id: number) {
            await productService.deleteProduct(id);
            commit('removeProduct', id);
        },
        async editProduct({ commit }, updated: Product) {
            const product = await productService.updateProduct(updated);
            commit('updateProduct', product);
        }
    },
    getters: {
        orders: state => state.orders,
        loading: state => state.loading,
        products: state => state.products,
        companies: state => state.companies,
        productLoading: state => state.productLoading,
    }
});
