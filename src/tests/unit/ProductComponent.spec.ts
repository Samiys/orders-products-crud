import { mount } from '@vue/test-utils'
import ProductComponentTable from '@/components/ProductComponentTable.vue'
import PrimeVue from 'primevue/config'
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice'
import { createStore } from 'vuex'

const mockStore = createStore({
    getters: {
        products: () => [{
            id: 1,
            name: 'Product A',
            category: 'Electronics',
            price: 49.99
        }]
    }
});
mockStore.dispatch = vi.fn();

const mountComponent = () =>
    mount(ProductComponentTable, {
        global: {
            plugins: [PrimeVue, DialogService, ToastService, mockStore],
            stubs: ['DataTable', 'Column', 'Toast', 'DynamicDialog', 'Button']
        }
    });

describe('ProductComponentTable', () => {
    it('mounts the component', () => {
        const wrapper = mountComponent();
        expect(wrapper.exists()).toBe(true);
    });

    it('displays product data correctly', () => {
        const wrapper = mountComponent();
        const vm: any = wrapper.vm;

        expect(vm.filteredProducts.length).toBe(1);
        expect(vm.filteredProducts[0].name).toBe('Product A');
    });

    it('filters products based on search', async () => {
        const wrapper = mountComponent();
        const vm: any = wrapper.vm;

        vm.searchQuery = 'electronics';
        await vm.$nextTick();

        const filtered = vm.filteredProducts;
        expect(filtered.length).toBe(1);
        expect(filtered[0].category).toBe('Electronics');
    });
});
