<template>
  <div class="secure-checkout-container max-w-md mx-auto mt-6 px-4">
    <button
      @click="handleCheckout"
      class="block w-full bg-blue-600 text-white text-center font-bold py-4 px-6 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
      :disabled="isLoading"
      :aria-busy="isLoading"
      aria-label="Secure Checkout"
    >
      <span class="flex items-center justify-center">
        Secure Checkout
        <ArrowRightVue v-if="!isLoading" class="w-5 h-5 ml-2" />
        <LoadingDotsVue v-else />
      </span>
    </button>
    <div class="text-xs text-center mt-2">
      <a target="_blank" href="https://stripe.com" class="inline-flex items-center text-gray-500">
        Powered by <StripeLogo class="ml-1" fill="#333" />
      </a>
    </div>
  </div>

  <!-- Modal for Login Form and Guest Option -->
  <div v-if="showLoginOptions" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full">
      <h2 class="text-xl font-bold mb-4">Checkout Options</h2>
      <div v-if="!showLoginForm" class="space-y-4">
        <button @click="showLoginForm = true" class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
          Login to Continue
        </button>
        <button @click="handleGuestCheckout" class="w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300 transition duration-300">
          Continue as Guest
        </button>
      </div>
      <LoginFormVue v-else @login-success="handleLoginSuccess" />
      <button @click="cancelLoginOptions" class="mt-4 text-sm text-gray-600 hover:text-gray-800">
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { loadStripe } from '@stripe/stripe-js';

import LoginFormVue from './LoginForm.vue'
import ArrowRightVue from './ArrowRight.vue';
import LoadingDotsVue from './LoadingDots.vue';
import StripeLogo from './StripeLogo.vue';

import useApi from '../composables/useApi';
import { useCartStore } from '../stores/cartStore';
import { useUserStore } from '../stores/userStore';
import { stripe_public } from '../config';

const stripePromise = loadStripe(stripe_public);
const { post } = useApi();
const cart = useCartStore();
const userStore = useUserStore();
const isLoading = ref(false);
const showLoginOptions = ref(false);
const showLoginForm = ref(false);

const handleCheckout = async () => {
  if (isLoading.value) return;

  if (userStore.isLoggedOut) {
    showLoginOptions.value = true;
    return;
  }

  proceedToCheckout();
};

const proceedToCheckout = async () => {
  isLoading.value = true;

  try {
    const stripe = await stripePromise;  
    const sessionId = await post('/stripe/create-checkout-session', {
      lineItems: cart.items
    });
    
    const result = await stripe.redirectToCheckout({ sessionId });
    
    if (result.error) {
      console.error(result.error.message);
    }
  } catch (error) {
    console.error('Checkout error:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleLoginSuccess = () => {
  showLoginOptions.value = false;
  showLoginForm.value = false;
  proceedToCheckout();
};

const handleGuestCheckout = () => {
  showLoginOptions.value = false;
  proceedToCheckout();
};

const cancelLoginOptions = () => {
  showLoginOptions.value = false;
  showLoginForm.value = false;
};
</script>