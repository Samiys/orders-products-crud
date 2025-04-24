<template>
    <div class="w-full bg-gray-900 text-white">
        <div class="container mx-auto px-8 py-2 flex items-center">
            <div class="text-lg font-bold text-teal-500">
                <router-link to="/">
                    VERSO
                </router-link>
            </div>
            <nav class="flex-grow flex justify-center text-sm font-bold">
                <router-link
                    v-for="link in links"
                    :key="link.id"
                    :to="link.url"
                    class="mx-4 py-2 no-underline border-b-2 tracking-wide"
                    :class="{
            'border-teal-500 text-teal-500': activeLink === link.id,
            'border-transparent text-gray-400 hover:text-teal-400': activeLink !== link.id,
          }"
                    @click="setActive(link.id)"
                >
                    {{ link.name }}
                </router-link>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const links = [
  { id: 'orders', name: 'Orders', url: '/' },
  { id: 'products', name: 'Products', url: 'products' }
];

const activeLink = ref('orders');

function setActive(linkId: string) {
  activeLink.value = linkId;
}
</script>
