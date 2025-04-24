<template>
    <div class="space-y-4 p-4">
        <!-- Product Name -->
        <div>
            <label for="name" class="block font-medium mb-1">Product Name</label>
            <InputText
                id="name"
                v-model="formData.name"
                :class="{ 'p-invalid': v$.name.$error }"
                class="w-full"
                placeholder="Enter product name"
            />
            <small v-if="v$.name.$error" class="p-error">
                {{ v$.name.$errors[0].$message }}
            </small>
        </div>

        <!-- Description -->
        <div>
            <label for="description" class="block font-medium mb-1">Description</label>
            <Textarea
                id="description"
                v-model="formData.description"
                class="w-full"
                placeholder="Enter product description"
                rows="3"
            />
        </div>

        <!-- Price -->
        <div>
            <label for="price" class="block font-medium mb-1">Price (€)</label>
            <InputNumber
                id="price"
                v-model="formData.price"
                class="w-full"
                mode="currency"
                currency="EUR"
                locale="en-IE"
                :class="{ 'p-invalid': v$.price.$error }"
            />
            <small v-if="v$.price.$error" class="p-error">
                {{ v$.price.$errors[0].$message }}
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
import { ref, computed, inject, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue, minLength } from '@vuelidate/validators';

const store = useStore();
const dialogRef = inject<any>('dialogRef');
const loading = ref(false);

const formData = ref({
    id: undefined,
    name: '',
    description: '',
    price: 0
});

const rules = {
    name: { required, minLength: minLength(3) },
    price: { required, minValue: minValue(1) }
};

const v$ = useVuelidate(rules, formData);
const isEdit = computed(() => !!formData.value.id);

const submitForm = async () => {
    const isValid = await v$.value.$validate();
    if (!isValid) return;

    loading.value = true;

    try {
        const productData = {
            ...formData.value,
            updatedAt: new Date().toISOString(),
            createdAt: isEdit.value ? undefined : new Date().toISOString()
        };

        const action = isEdit.value ? 'editProduct' : 'addProduct';
        const result = await store.dispatch(action, productData);

        dialogRef.value.close({
            productCreated: true,
            id: result?.id || formData.value.id
        });
    } catch (err) {
        console.error('Error saving product:', err);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    const product = dialogRef?.value?.data?.product;
    if (product) {
        formData.value = { ...product };
    }
});

const closeDialog = () => dialogRef.value.close();
</script>
