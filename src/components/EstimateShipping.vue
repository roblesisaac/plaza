<template>
<div>
    <h4 class="text-lg font-semibold mb-2">
        Estimated Shipping: 
        <LoadingDotsVue v-if="cartStore.status=='loading'" />
    </h4>
    <div v-if="cartStore.shippingEstimate" class="text-xl font-bold mb-2">
        {{ formattedShipping }}
    </div>
    <input 
        type="number" 
        class="w-full p-2 border border-gray-300 rounded" 
        placeholder="Enter Zip Code" 
        v-model="cartStore.zipCode"
    />
    <p v-if="cartStore.shippingError" class="text-red-600 mt-1">
        {{ cartStore.shippingError }}
    </p>
</div>
</template>

<script setup>
    import { watch } from 'vue';
    import LoadingDotsVue from './LoadingDots.vue';
    import { useCartStore } from '../stores/cartStore';

    const formattedShipping = computed(() => {
        return formatAsPrice(cartStore.shippingEstimate);
    });

    watch(() => cartStore.zipCode, async (zipCode) => {
        await cartStore.fetchShippingEstimate(zipCode);
    });
</script>