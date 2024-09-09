<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <h1 class="text-3xl font-bold text-center mb-8">My Cart</h1>
    
    <!-- Loading Screen -->
    <div v-show="cartStore.isLoading && !loginSuccess" class="flex flex-col items-center justify-center py-12">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-4"></div>
      <p class="text-gray-700 text-xl">Loading your cart...</p>
    </div>
    
    <!-- Cart Content -->
    <div v-show="!cartStore.isLoading || loginSuccess">
      <!-- Empty Cart Message -->
      <div v-if="isEmpty" class="bg-white shadow-md rounded-lg p-8 text-center">
        <ShoppingCartIcon class="mx-auto h-16 w-16 text-gray-400" />
        <h2 class="mt-4 text-2xl font-semibold text-gray-900">Your cart is empty</h2>
        <p class="mt-2 text-gray-600">Looks like you haven't added any items to your cart yet.</p>
        <router-link 
          to="products" 
          class="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Start Shopping
          <ArrowRightIcon class="ml-2 -mr-1 h-5 w-5" />
        </router-link>
      </div>
      
      <!-- Cart Items and Summary -->
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
            <button @click="cartStore.clearCart()" class="text-red-600 hover:text-red-800 font-semibold">Clear Cart</button>
          </div>
        </div>
        
        <!-- Cart Summary -->
        <div class="bg-gray-100 p-6 rounded-lg flex-shrink-0 lg:w-1/2">
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h4 class="text-lg font-semibold">Subtotal:</h4>
              <span class="text-xl font-bold">{{ formattedSubtotal }}</span>
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
  </div>
</template>

<script setup>
import { computed } from 'vue';

const params = new URLSearchParams(window.location.search);
const loginSuccess = params.get('loginSuccess');

// Components
import { ShoppingCartIcon } from 'lucide-vue-next';
import { ArrowRightIcon } from 'lucide-vue-next';
import CartItemVue from '../components/CartItem.vue';
import StripeButton from './StripeButton.vue';

// Stores
import { useCartStore } from '../stores/cartStore';
import { formatAsPrice } from '../utils/formats';

const cartStore = useCartStore();
const isEmpty = computed(() => cartStore.cartItemCount === 0);

const formattedSubtotal = computed(() => {
  return formatAsPrice(cartStore.subtotal);
});

const formattedTax = computed(() => {
  return formatAsPrice(cartStore.tax);
});

const formattedTotalPrice = computed(() => {
  return formatAsPrice(cartStore.total);
});

if(!cartStore.isInit) {
  cartStore.init();  
}
</script>