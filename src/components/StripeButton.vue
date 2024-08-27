<template>
    <div class="secure-checkout-container mt-6">
      <button
        @click="handleCheckout"
        class="block w-full bg-blue-600 text-white text-center font-bold py-4 px-6 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
        :disabled="isLoading"
        aria-busy="isLoading"
        aria-label="Secure Checkout"
      >
        <span>
          Secure Checkout
        </span>
        <ArrowRightVue v-if="!isLoading" class="inline-block w-5 h-5 ml-2 align-middle" />
        <LoadingDotsVue v-else />
      </button>
      <div class="text-xs text-gray-500 text-center mt-2">
        <a target="_blank" href="https://stripe.com"><span class="lock-icon">&#128274;</span> Powered by Stripe</a>
      </div>
    </div>
  </template>
  

<script setup>
import { ref } from 'vue';
import { loadStripe } from '@stripe/stripe-js';

import ArrowRightVue from './ArrowRight.vue';
import LoadingDotsVue from './LoadingDots.vue';

import { stripe_public } from '../config';
import useApi from '../composables/useApi';
import { useCartStore } from '../stores/cartStore';

const { post } = useApi();
const cart = useCartStore();
const isLoading = ref(false);

const handleCheckout = async () => {
    if(isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    const stripe = await loadStripe(stripe_public);
    
    const sessionId = await post('/stripe/create-checkout-session', {
        lineItems: cart.items
    });
    
    const result = await stripe.redirectToCheckout({ sessionId })
    
    if (result.error) {
        console.error(result.error.message)
    }
}
</script>