<template>
    <div class="checkout-navigation q-grid">
        <button
        v-for="(page, index) in pages"
        :key="index"
        @click="navigateToPage(index)"
        :class="{ active: index === checkoutStore.activePage }"
        class="q-cell-33"
        >
        <Transition>
            <CheckCircle v-if="checkoutStore.isPageComplete(page.label)" fillColor="#5d38b6" />
        </Transition>
        <Component v-if="!checkoutStore.isPageComplete(page.label)" :is="page.icon" /> {{ page.title || page.label }}
    </button>
</div>
</template>

<script setup>
import { nextTick } from 'vue';
import { useCheckoutStore } from '../stores/checkoutStore';

// Components
import CircleOne from 'vue-material-design-icons/Numeric1Circle.vue';
import CircleTwo from 'vue-material-design-icons/Numeric2Circle.vue';
import CircleThree from 'vue-material-design-icons/Numeric3Circle.vue';
import CheckCircle from 'vue-material-design-icons/CheckDecagram.vue';

const checkoutStore = useCheckoutStore();

const pages = [
{ label: 'shippingForm', title: 'shipping', name: 'CheckoutShipping', icon: CircleOne },
{ label: 'payment', name: 'CheckoutPayment', icon: CircleTwo },
{ label: 'review', name: 'CheckoutReview', icon: CircleThree },
];

function navigateToPage(index) {
    checkoutStore.activePage = 'loading';
    
    nextTick(() => checkoutStore.activePage = index);
}
</script>

<style scoped>
.checkout-navigation {
    display: flex;
    flex-wrap: wrap;
}

button {
    background: transparent;
    color: #777;
    text-transform: capitalize;
    padding: 20px;
}

button:hover {
    background-color: transparent;
    color: #000;
}

button:active, button:focus {
    outline: none;
    box-shadow: none;
}

button.active {
    color: #000;
    font-weight: bold;
}

.q-grid {
    width: 100%;
    display: flex;
}
</style>
