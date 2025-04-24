<template>
  <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Products</h1>
      <ProductComponentTable></ProductComponentTable>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ProductComponentTable from "@/components/ProductComponentTable.vue";

export default defineComponent({
  name: 'ProductView',
  components: {
      ProductComponentTable,
  },
});
</script>

<style scoped></style>
