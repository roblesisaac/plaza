<template>
    <button @click="handleCheckout" class="block button w-full bg-blue-600 text-white text-center bold p20 rounded-lg mt-6 hover:bg-blue-700 transition duration-300">
        Secure Checkout <ArrowRight />
    </button>
</template>

<script setup>
import ArrowRight from './ArrowRight.vue';
import { loadStripe } from '@stripe/stripe-js';
import { stripe_public } from '../config';
import useApi from '../composables/useApi';

const { post } = useApi();

const handleCheckout = async () => {
    const stripe = await loadStripe(stripe_public);
    
    const sessionId = await post('/stripe/create-checkout-session');
    
    const result = await stripe.redirectToCheckout({ sessionId })
    
    if (result.error) {
        console.error(result.error.message)
    }
}
</script>