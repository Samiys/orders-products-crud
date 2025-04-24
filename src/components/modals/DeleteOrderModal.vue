<template>
  <div class="p-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
    <p v-if="order" class="text-gray-600 mb-6">
      Are you sure you want to delete <strong>Order #{{ order.id }}</strong>?
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
const order = ref<any>(null);

onMounted(() => {
  const data = dialogRef?.value?.data;
  if (data?.order) {
    order.value = { ...data.order };
  } else {
    console.warn('No order provided to DeleteOrderModal');
  }
});

const confirmDelete = () => {
  if (order.value?.id) {
    dialogRef.value.close({ id: order.value.id });
  } else {
    console.error('Order is undefined or missing id');
    dialogRef.value.close();
  }
};

const cancel = () => {
  dialogRef.value.close();
};
</script>