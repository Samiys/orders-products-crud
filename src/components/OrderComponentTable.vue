<template>
    <div class="card">
        <DataTable
            :value="filteredOrders"
            class="p-datatable-sm"
            stripedRows
            responsiveLayout="scroll"
            paginator
            :rows="10"
            :rowsPerPageOptions="[5, 10, 25, 50]"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            filterDisplay="menu"
            :loading="loading"
        >
            <template #header>
                <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 w-full">
                    <div class="w-full md:w-1/5">
                        <IconField class="w-full">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText
                                v-model="searchTerm"
                                placeholder="Search orders"
                                class="w-full"
                            />
                        </IconField>
                    </div>
                    <Button
                        class="w-full md:w-40"
                        label="Add Order"
                        size="small"
                        @click="openOrderModal"
                    />
                </div>
            </template>

            <template #empty>No Orders found.</template>
            <template #loading>Loading orders data. Please wait.</template>

            <Column field="id" header="Order ID" sortable>
                <template #body="{ data }">
                    <span class="font-medium">ORD-{{ data.id.toString().padStart(5, '0') }}</span>
                </template>
            </Column>

            <Column header="Customer" sortable sortField="customerCompanyId">
                <template #body="{ data }">
                    <div>
                        <div>{{ getCompanyId(data.customerCompanyId) }}</div>
                        <div class="text-gray-500 text-sm">{{ getCompanyName(data.customerCompanyId) }}</div>
                    </div>
                </template>
            </Column>

            <Column header="Supplier" sortable sortField="supplierCompanyId">
                <template #body="{ data }">
                    <div>
                        <div>{{ getCompanyId(data.supplierCompanyId) }}</div>
                        <div class="text-gray-500 text-sm">{{ getCompanyName(data.supplierCompanyId) }}</div>
                    </div>
                </template>
            </Column>

            <Column header="Products">
                <template #body="{ data }">{{ getProductNames(data.productIds) }}</template>
            </Column>

            <Column field="status" header="Status" sortable>
                <template #body="{ data }">{{ data.status || 'N/A' }}</template>
            </Column>

            <Column header="Actions" style="width: 120px;">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button icon="pi pi-pencil" class="p-button-text text-blue-600" @click="handleOrderUpdated(data)" />
                        <Button icon="pi pi-trash" class="p-button-text text-red-600" @click="confirmDelete(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
    <Toast />
    <DynamicDialog />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useDialog } from 'primevue/usedialog';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import AddEditOrderModal from '@/components/modals/AddEditOrderModal.vue';
import DeleteOrderModal from '@/components/modals/DeleteOrderModal.vue';

const store = useStore();
const dialog = useDialog();
const toast = useToast();
const loading = ref(true);
const searchTerm = ref('');

const orders = computed(() => store.getters.orders);

const filteredOrders = computed(() => {
    const query = searchTerm.value.toLowerCase().trim();

    return orders.value.filter(order => {
        const customerName = getCompanyName(order.customerCompanyId).toLowerCase();
        const supplierName = getCompanyName(order.supplierCompanyId).toLowerCase();
        const orderId = order.id.toString();
        const status = order.status?.toLowerCase() || '';
        const productNames = getProductNames(order.productIds).toLowerCase();

        return (
            orderId.includes(query) ||
            customerName.includes(query) ||
            supplierName.includes(query) ||
            status.includes(query) ||
            productNames.includes(query)
        );
    });
});

function getCompanyName(id: string): string {
    const company = store.getters.companies.find((c: any) => c.id === id);
    return company?.name || '';
}

function getCompanyId(id: string): string {
    return id;
}

function getProductNames(ids: number[]): string {
    return ids.map(id => {
        const product = store.getters.products.find((p: any) => p.id === id);
        return product ? product.name : `Product ${id}`;
    }).join(', ');
}

const openOrderModal = () => {
    dialog.open(AddEditOrderModal, {
        props: {
            header: 'Create New Order',
            style: { width: '30vw' },
            modal: true
        },
        onClose: ({ data }) => {
            if (data?.orderCreated) {
                toast.add({
                    severity: 'success',
                    summary: 'Order Created',
                    detail: `Order #${data.id} was created successfully.`,
                    life: 3000
                });
                store.dispatch('loadOrders');
            }
        }
    });
};

const handleOrderUpdated = (order: any) => {
    dialog.open(AddEditOrderModal, {
        props: {
            header: 'Edit Order',
            style: { width: '50vw' },
            modal: true
        },
        data: { order },
        onClose: ({ data }) => {
            if (data?.orderCreated) {
                toast.add({
                    severity: 'success',
                    summary: 'Order Updated',
                    detail: `Order #${order.id} updated successfully.`,
                    life: 3000
                });
                store.dispatch('loadOrders');
            }
        }
    });
};

const confirmDelete = (order: any) => {
    dialog.open(DeleteOrderModal, {
        data: { order },
        props: {
            header: `Delete Order #${order.id}`,
            style: { width: '30vw' },
            modal: true
        },
        onClose: ({ data }) => {
            if (data?.id) {
                store.dispatch('removeOrder', data.id).then(() => {
                    store.dispatch('loadOrders');
                    toast.add({
                        severity: 'success',
                        summary: 'Deleted',
                        detail: `Order #${data.id} was deleted.`,
                        life: 3000
                    });
                });
            }
        }
    });
};

onMounted(async () => {
    loading.value = true;
    await Promise.all([
        store.dispatch('loadOrders'),
        store.dispatch('loadCompanies'),
        store.dispatch('loadProducts')
    ]);
    loading.value = false;
});
</script>
