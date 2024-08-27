<template>
<div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <h1 class="text-3xl font-bold text-center mb-8">My Cart</h1>
    
    <!-- Empty Cart Message -->
    <div v-if="isEmpty" class="text-center py-8">
        <p class="text-gray-600 mb-4">Your cart is currently empty.</p>
        <router-link to="products" class="text-blue-600 hover:text-blue-800 font-semibold">
            Shop Now &raquo;
        </router-link>
    </div>
    
    <!-- Cart Content -->
    <div v-else class="flex flex-col lg:flex-row lg:space-x-8">
        <!-- Cart Items -->
        <div class="flex-1 space-y-2 mb-8 lg:mb-0">
            <CartItemVue 
                v-for="item in cartStore.items" 
                :key="item.title" 
                :item="item"
                @update-qty="cartStore.updateItemQuantity"
                @remove-item="cartStore.removeItem"
            />
            <!-- Clear Cart -->
            <div v-if="cartStore.items.length" class="flex justify-end mb-4">
                <button class="text-red-600 hover:text-red-800 font-semibold">Clear Cart</button>
            </div>

        </div>
        
        <!-- Cart Summary -->
        <div class="bg-gray-100 p-6 rounded-lg flex-shrink-0 lg:w-1/2">
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h4 class="text-lg font-semibold">Subtotal:</h4>
                    <span class="text-xl font-bold">{{ formattedSubtotal }}</span>
                </div>
                
                <!-- Shipping Estimates -->
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
                
                <div class="flex justify-between items-center">
                    <h4 class="text-lg font-semibold">Tax:</h4>
                    <span class="text-xl font-bold">{{ formattedTax }}</span>
                </div>
                
                <div class="flex justify-between items-center text-xl font-bold">
                    <h4>Total:</h4>
                    <span>{{ formattedTotalPrice }}</span>
                </div>
            </div>

            <!-- Secure Stripe Checkout -->
            <StripeButton />
        </div>
    </div>
</div>
</template>
    

<script setup>
import { computed, watch } from 'vue';

// Components
import CartItemVue from '../components/CartItem.vue';
import LoadingDotsVue from '../components/LoadingDots.vue';
import StripeButton from './StripeButton.vue';

// Stores
import { useCartStore } from '../stores/cartStore';
import { formatAsPrice } from '../utils/formats';

const cartStore = useCartStore();
const isEmpty = computed(() => cartStore.cartItemCount === 0);

const formattedSubtotal = computed(() => {
    return formatAsPrice(cartStore.subtotal);
});

const formattedShipping = computed(() => {
    return formatAsPrice(cartStore.shippingEstimate);
});

const formattedTax = computed(() => {
    return formatAsPrice(cartStore.tax);
});

const formattedTotalPrice = computed(() => {
    return formatAsPrice(cartStore.total);
});

watch(() => cartStore.zipCode, async (zipCode) => {
    await cartStore.fetchShippingEstimate(zipCode);
});

watch(() => cartStore.items, async (zipCode) => {
    await cartStore.fetchShippingEstimate(zipCode);
}, { deep: true });


</script>