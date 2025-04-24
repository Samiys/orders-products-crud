<template>
    <div class="card">
        <DataTable
            :value="filteredProducts"
            class="p-datatable-sm"
            stripedRows
            responsiveLayout="scroll"
            paginator
            :rows="10"
            :rowsPerPageOptions="[5, 10, 25]"
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
                                placeholder="Search products"
                                class="w-full"
                            />
                        </IconField>
                    </div>
                    <Button
                        class="w-full md:w-40"
                        label="Add Product"
                        size="small"
                        @click="openProductModal"
                    />
                </div>
            </template>


            <template #empty> No Products found. </template>
            <template #loading> Loading products data. Please wait. </template>

            <Column field="id" header="Product ID" sortable />
            <Column field="name" header="Name" sortable />
            <Column field="description" header="Description" sortable />
            <Column field="price" header="Price (€)" sortable>
                <template #body="{ data }">€{{ data.price?.toFixed(2) }}</template>
            </Column>
            <Column header="Actions">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button
                            icon="pi pi-pencil"
                            class="p-button-text text-blue-600"
                            @click="handleProductUpdated(data)"
                        />
                        <Button
                            icon="pi pi-trash"
                            class="p-button-text text-red-600"
                            @click="confirmDelete(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
    <Toast />
    <DynamicDialog />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useDialog } from 'primevue/usedialog'
import { useToast } from 'primevue/usetoast'
import AddEditProductModal from '@/components/modals/AddEditProductModal.vue'
import DeleteProductModal from '@/components/modals/DeleteProductModal.vue'
import Button from "primevue/button";

const dialog = useDialog()
const toast = useToast()
const store = useStore()
const searchTerm = ref('')
const loading = ref(true)

const products = computed(() => store.getters.products)

const filteredProducts = computed(() => {
    const query = searchTerm.value.toLowerCase().trim()

    return products.value.filter(p => {
        const name = p.name?.toLowerCase() || ''
        const category = p.category?.toLowerCase() || ''
        const price = p.price?.toString() || ''

        return (
            name.includes(query) ||
            category.includes(query) ||
            price.includes(query)
        )
    })
})

const openProductModal = () => {
    dialog.open(AddEditProductModal, {
        props: {
            header: 'Create Product',
            style: { width: '30vw' },
            modal: true
        },
        onClose: ({ data }) => {
            if (data?.productCreated) {
                toast.add({
                    severity: 'success',
                    summary: 'Product Created',
                    detail: `Product #${data.name} was created successfully.`,
                    life: 3000
                })
                store.dispatch('loadProducts')
            }
        }
    })
}

const handleProductUpdated = (product: any) => {
    dialog.open(AddEditProductModal, {
        props: {
            header: 'Edit Product',
            style: { width: '40vw' },
            modal: true
        },
        data: { product },
        onClose: ({ data }) => {
            if (data?.productCreated) {
                toast.add({
                    severity: 'success',
                    summary: 'Updated',
                    detail: `Product #${product.id} updated successfully.`,
                    life: 3000
                })
                store.dispatch('loadProducts')
            }
        }
    })
}

const confirmDelete = (product: any) => {
    dialog.open(DeleteProductModal, {
        data: { product },
        props: {
            header: `Delete Product #${product.id}`,
            style: { width: '30vw' },
            modal: true
        },
        onClose: ({ data }) => {
            if (data?.id) {
                store.dispatch('removeProduct', data.id).then(() => {
                    store.dispatch('loadProducts')
                    toast.add({
                        severity: 'success',
                        summary: 'Deleted',
                        detail: `Product #${data.id} was deleted.`,
                        life: 3000
                    })
                })
            }
        }
    })
}

onMounted(async () => {
    loading.value = true
    await store.dispatch('loadProducts')
    loading.value = false
})
</script>
