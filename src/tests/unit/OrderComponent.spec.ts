import { mount } from '@vue/test-utils'
import OrderComponentTable from '@/components/OrderComponentTable.vue'
import PrimeVue from 'primevue/config'
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice'
import { createStore } from 'vuex'

const mockStore = createStore({
    getters: {
        orders: () => [{
            id: 1,
            customerCompanyId: 'cust-1',
            supplierCompanyId: 'supp-1',
            productIds: [1],
            status: 'pending',
            createdAt: new Date().toISOString(),
            totalValue: 100
        }],
        companies: () => [
            { id: 'cust-1', name: 'Customer One' },
            { id: 'supp-1', name: 'Supplier One' }
        ],
        products: () => [{ id: 1, name: 'Product A' }]
    },
    actions: {
        loadOrders: vi.fn(),
        loadCompanies: vi.fn(),
        loadProducts: vi.fn()
    }
});
mockStore.dispatch = vi.fn();

const mountComponent = () =>
    mount(OrderComponentTable, {
        global: {
            plugins: [PrimeVue, DialogService, ToastService, mockStore],
            stubs: ['DataTable', 'Column', 'Toast', 'DynamicDialog', 'Button']
        }
    });

describe('OrderComponentTable', () => {
    it('mounts the component', () => {
        const wrapper = mountComponent();
        expect(wrapper.exists()).toBe(true);
    });

    it('computes company and product names correctly', () => {
        const wrapper = mountComponent();
        const vm: any = wrapper.vm;

        expect(vm.getCompanyName('cust-1')).toBe('Customer One');
        expect(vm.getCompanyName('supp-1')).toBe('Supplier One');
        expect(vm.getProductNames([1])).toBe('Product A');
    });

    it('formats order ID as ORD-xxxxx', () => {
        const wrapper = mountComponent();
        const vm: any = wrapper.vm;

        const id = 23;
        const formattedId = `ORD-${id.toString().padStart(5, '0')}`;
        expect(formattedId).toBe('ORD-00023');
    });
});
