<template>
    <div class="space-y-4 p-4">
        <!-- Customer -->
        <div>
            <label for="customer" class="block font-medium mb-1">Customer</label>
            <Dropdown
                id="customer"
                v-model="formData.customerCompanyId"
                :options="customers"
                optionLabel="name"
                optionValue="id"
                placeholder="Select a customer"
                :class="{ 'p-invalid': v$.customerCompanyId.$error }"
                class="w-full h-11"
            />
            <small v-if="v$.customerCompanyId.$error" class="p-error">
                {{ v$.customerCompanyId.$errors[0].$message }}
            </small>
        </div>

        <!-- Supplier -->
        <div>
            <label for="supplier" class="block font-medium mb-1">Supplier</label>
            <Dropdown
                id="supplier"
                v-model="formData.supplierCompanyId"
                :options="suppliers"
                optionLabel="name"
                optionValue="id"
                placeholder="Select a supplier"
                :class="{ 'p-invalid': v$.supplierCompanyId.$error }"
                class="w-full h-11"
            />
            <small v-if="v$.supplierCompanyId.$error" class="p-error">
                {{ v$.supplierCompanyId.$errors[0].$message }}
            </small>
        </div>

        <!-- Products -->
        <div>
            <label for="products" class="block font-medium mb-1">Products</label>
            <MultiSelect
                id="products"
                v-model="formData.productIds"
                :options="products"
                optionLabel="name"
                optionValue="id"
                placeholder="Select products"
                :class="{ 'p-invalid': v$.productIds.$error }"
                class="w-full"
            />
            <small v-if="v$.productIds.$error" class="p-error">
                {{ v$.productIds.$errors[0].$message }}
            </small>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2 pt-4">
            <Button label="Cancel" severity="secondary" @click="closeDialog" />
            <Button label="Save" :loading="loading" @click="submitForm" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, inject } from 'vue';
import { useStore } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { OrderFormData } from '@/interfaces/types';

const store = useStore();
const emit = defineEmits(['close']);
const props = defineProps<{ order?: OrderFormData }>();
const dialogRef = inject<any>('dialogRef');
const loading = ref(false);

const formData = ref<OrderFormData>({
    id: undefined,
    customerCompanyId: null,
    supplierCompanyId: null,
    productIds: [],
    status: 'pending'
});

watch(
    () => props.order,
    (order) => {
        if (order) formData.value = { ...order };
    },
    { immediate: true }
);

onMounted(() => {
    const order = dialogRef?.value?.data?.order;
    if (order) formData.value = { ...order };
});

const rules = {
    customerCompanyId: { required },
    supplierCompanyId: { required },
    productIds: { required, minLength: (v: number[]) => v.length > 0 }
};
const v$ = useVuelidate(rules, formData);

const customers = computed(() =>
    store.getters.companies.filter((c: any) => c.type === 'customer')
);
const suppliers = computed(() =>
    store.getters.companies.filter((c: any) => c.type === 'supplier')
);
const products = computed(() => store.getters.products);

const submitForm = async () => {
    const isValid = await v$.value.$validate();
    if (!isValid) return;

    loading.value = true;
    try {
        const orderData = {
            ...formData.value,
            updatedAt: new Date().toISOString(),
            createdAt: formData.value.id ? undefined : new Date().toISOString()
        };

        const action = formData.value.id ? 'editOrder' : 'addOrder';
        const result = await store.dispatch(action, orderData);

        dialogRef.value.close({
            orderCreated: true,
            id: result?.id || formData.value.id || Math.floor(Math.random() * 10000)
        });
    } catch (err) {
        console.error('Error saving order:', err);
    } finally {
        loading.value = false;
    }
};

const closeDialog = () => emit('close');
</script>
