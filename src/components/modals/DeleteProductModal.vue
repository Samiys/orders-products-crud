<template>
  <div class="p-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
    <p v-if="product" class="text-gray-600 mb-6">
      Are you sure you want to delete <strong>Product #{{ product.id }}</strong> ({{ product.name }})?
    </p>
    <div class="flex justify-end gap-3">
      <Button label="Cancel" severity="secondary" @click="cancel" />
      <Button label="Delete" severity="danger" @click="confirmDelete" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, onMounted } from 'vue';

const dialogRef = inject('dialogRef') as any;
const product = ref<any>(null);

onMounted(() => {
  const data = dialogRef?.value?.data;
  if (data?.product) {
    product.value = { ...data.product };
  } else {
    console.warn('No product provided to DeleteProductModal');
  }
});

const confirmDelete = () => {
  if (product.value?.id) {
    dialogRef.value.close({ id: product.value.id });
  } else {
    console.error('Product is undefined or missing id');
    dialogRef.value.close();
  }
};

const cancel = () => {
  dialogRef.value.close();
};
</script>
