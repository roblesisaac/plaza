<template>
    <div class="q-grid confirm-address-container">
        
        <div class="q-cell-1">
            <h3>Confirm Your Address</h3>
            Please confirm which address you would like to use.
        </div>
        
        <!-- You Entered -->
        <div class="q-cell-1 address-buttton-container">
            <button @click="selectAddress(checkoutStore.shippingForm)" 
            class="confirm-address-button"
            :class="classIfSelected(checkoutStore.shippingForm)">
                <b>You Entered:</b>
                <br>
                <span v-html="renderAddress(checkoutStore.shippingForm)"></span>
                <a @click="emits('hide-confirm-address')" class="edit-address">Edit</a>
            </button>
        </div>
        
        <!-- Recommended Address -->
        <div class="q-cell-1 address-buttton-container">
            <button @click="selectAddress(checkoutStore.validatedAddress)"
            class="confirm-address-button" :class="classIfSelected(checkoutStore.validatedAddress)">
                <b>We Suggest:</b>
                <br>
                <span v-html="renderAddress(checkoutStore.validatedAddress)"></span>
            </button>
        </div>
        
        <div class="q-cell-1">
        <Transition>
        <div class="q-cell-1 continue-container">
            <button @click="continueToPayment">Continue <ArrowRightBoldVue /></button>
        </div>
    </Transition>
        </div>
        
    </div>
</template>

<script setup>
import { defineEmits, ref } from 'vue';
import { useCheckoutStore } from '../stores/checkoutStore';

import ArrowRightBoldVue from 'vue-material-design-icons/ArrowRightBold.vue';

const checkoutStore = useCheckoutStore();
const emits = defineEmits(['hide-confirm-address']);

const confirmedAddress = ref({ ...checkoutStore.shippingForm });

function renderAddress(address={}) {
    return `
        ${address.street}
        <br/> ${address.city}, ${address.state} ${address.zipCode}
    `;
}

function selectAddress(address) {
    confirmedAddress.value.street = address.street;
    confirmedAddress.value.city = address.city;
    confirmedAddress.value.state = address.state;
    confirmedAddress.value.zipCode = address.zipCode;
    confirmedAddress.value.country = 'US';
}

function classIfSelected(address) {
    let unmatchedKeys = 0;
    
    for (const key in address) {
        if(confirmedAddress.value[key] != address[key]) {
            unmatchedKeys++;
        }
    }
    
    return unmatchedKeys ? '' : 'isSelected';
}

function continueToPayment() {
    checkoutStore.shippingForm = confirmedAddress.value;
    checkoutStore.changePage();
}

</script>

<style scoped>
a {
    float: right;
    font-weight: bold;
}

button {
    width: 100%;
    padding: 10px;
}

.address-buttton-container {
    padding: 20px 0 0 0;
    display: relative;
}

.confirm-address-container {
    padding: 0 0 200px 0;
}

.confirm-address-button {
    display: inherit;
    background: #fafafa;
    color: #000;
    border: 1px solid #333;
    text-align: left;
    line-height: 1.5;
    position: relative;
}

.confirm-address-button>* {
    margin: 0;
}

.confirm-address-button:hover {
    background: #111;
    color: #fff;
}

button.isSelected {
    border: 2px solid #000;
}

.continue-container {
    padding-top: 20px;
}

.continue-container button {
    background: #000;
    color: #fff;   
}

.edit-address {
    position: absolute;
    top: 10px;
    right: 10px;
}
</style>