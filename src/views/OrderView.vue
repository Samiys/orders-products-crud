<template>
  <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Orders</h1>
      <OrderComponentTable></OrderComponentTable>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import OrderComponentTable from "@/components/OrderComponentTable.vue";

export default defineComponent({
  name: 'OrderView',
  components: {
      OrderComponentTable,
  },
});
</script>

<style scoped></style>
