<template>
    <button @click="handleCheckout" class="block button w-full bg-blue-600 text-white text-center bold p20 rounded-lg mt-6 hover:bg-blue-700 transition duration-300">
        Secure Checkout <ArrowRightVue v-if="!isLoading" /><LoadingDotsVue v-else />
    </button>
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