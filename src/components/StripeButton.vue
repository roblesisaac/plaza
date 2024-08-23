<template>
    <button @click="handleCheckout" class="block button w-full bg-blue-600 text-white text-center bold p20 rounded-lg mt-6 hover:bg-blue-700 transition duration-300">
        Secure Checkout <ArrowRight />
    </button>
</template>

<script setup>
import { loadStripe } from '@stripe/stripe-js';
import { stripe_public } from '../config';
import useApi from '../composables/useApi';
import ArrowRight from './ArrowRight.vue';

const { post } = useApi();
const stripePromise = loadStripe(stripe_public);

const handleCheckout = async () => {
    const stripe = await stripePromise;
    
    const session = await post('/stripe/create-checkout-session');
}
</script>