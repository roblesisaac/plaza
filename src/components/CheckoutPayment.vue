<template>
<div class="q-grid p20">
    <div class="q-cell-1">
        <BraintreeDropInVue />
    </div>
        
    <div class="q-cell-1 continue-container">
        <button 
            id="review-and-pay"
            @click="reviewAndPay" 
            :disabled="isLoading" 
            class="expanded">
            Review & Pay <ArrowRightBoldVue />
        </button>
    </div>
</div>
</template>

<script setup>
import ArrowRightBoldVue from 'vue-material-design-icons/ArrowRightBold.vue';
import BraintreeDropInVue from './BraintreeDropIn.vue';

import { useCheckoutStore } from '../stores/checkoutStore';
import useBrain from '../composables/useBrain';


const CheckoutStore = useCheckoutStore();
const { tokenizePayment } = useBrain();

async function reviewAndPay() {
    try {
        if(!CheckoutStore.selectedMethodId) {
            const shouldSavePaymentMethod = !!CheckoutStore.savePaymentForLater && !!CheckoutStore.userId;
            const tokenizedPaymentMethod = await tokenizePayment(shouldSavePaymentMethod);

            if(tokenizedPaymentMethod.methodId) {
                CheckoutStore.notify(`Successfully saved payment method ending in ${tokenizedPaymentMethod.last4}.`)
            }
        }

        CheckoutStore.changePage();
    } catch (err) {
        CheckoutStore.notify(err.message);
    }
}

</script>

<style scoped>
.continue-container {
    padding-bottom: 20px;
}

.continue-container button {
    background: #000;
    color: #fff;
}
</style>