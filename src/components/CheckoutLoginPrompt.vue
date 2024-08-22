<template>
<div class="q-grid">

    <!-- Login Form -->
    <div class="q-cell-1">
        <LoginFormVue />
    </div>

    <!-- Guest Checkout -->
    <div class="q-cell-1 guest-checkout-container">
        <div class="q-grid">
            <div class="q-cell-1 text-center">
                <h2>- Or -</h2>
            </div>

            <!-- Guest Checkout -->
            <div class="q-cell-1 button-container">
                <button @click="CheckoutStore.continueAsGuest=true" class="guest-checkout">
                    Continue As Guest <ArrowRightBoldVue />
                </button>
            </div>
        </div>
    </div>

</div>
</template>

<script setup>
import LoginFormVue from './LoginForm.vue';
import { useCheckoutStore } from '../stores/checkoutStore';

import ArrowRightBoldVue from 'vue-material-design-icons/ArrowRightBold.vue';

const CheckoutStore = useCheckoutStore();
</script>

<style scoped>
.button-container {
    padding-top: 20px;
}
.guest-checkout-container {
    padding: 30px;
    text-align: center;
}
.guest-checkout-container button {
    width: 100%;
    background: #000;
    color: #fff;
    font-weight: bold;
}
</style>