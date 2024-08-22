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
        
        <!-- Cart Items -->
        <div v-else class="space-y-4 mb-8">
            <CartItemVue 
            v-for="item in cartStore.items" 
            :key="item.title" 
            :item="item"
            @update-qty="cartStore.updateItemQuantity"
            @remove-item="cartStore.removeItem"
            />
        </div>
        
        <!-- Clear Cart -->
        <div v-if="cartStore.items.length > 1" class="text-right mb-4">
            <button @click="cartStore.clearCart" class="text-red-600 hover:text-red-800 font-semibold">
                Clear Cart
            </button>
        </div>
        
        <!-- Cart Summary -->
        <div class="bg-gray-100 p-6 rounded-lg">
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
            
            <!-- Proceed To Checkout -->
            <router-link 
            v-if="cartStore.items.length > 0" 
            to="/checkout" 
            class="block button w-full bg-blue-600 text-white text-center bold p20 rounded-lg mt-6 hover:bg-blue-700 transition duration-300"
            >
            Proceed To Checkout 
            <ArrowRightBoldVue class="inline-block ml-2" />
        </router-link>
    </div>
</div>
</template>

<script setup>
import { computed, watch } from 'vue';

// Components
import ArrowRightBoldVue from 'vue-material-design-icons/ArrowRightBold.vue';
import CartItemVue from '../components/CartItem.vue';
import LoadingDotsVue from '../components/LoadingDots.vue';

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