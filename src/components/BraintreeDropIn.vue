<template>
    <div class="payment-container q-grid">
        <!-- Saved Payment Methods -->
        <div v-if="brain.savedPaymentMethods.value.length > 0" class="saved-methods-container q-cell-1">
            <h3 class="section-title">Payment Methods</h3>
            
            <PaymentMethodRowVue 
            v-for="paymentMethod in brain.savedPaymentMethods.value" 
            :key="paymentMethod.nonce || paymentMethod.methodId" 
            :paymentMethod="paymentMethod" 
            :isSelected="isPaymentMethodSelected(paymentMethod)"
            @select-card="selectCard(paymentMethod)"
            class="payment-method-row"
            />
        </div>
        
        <!-- Clear Selected Payment -->
        <div v-if="CheckoutStore.selectedMethodId" class="q-cell-1 right clear-payment-container">
            <a @click="clearPaymentSelection">Clear Payment Selection</a>
        </div>
        
        <!-- PayPal Button -->
        <div class="paypal-container q-cell-1">
            <button @click="handlePayPalClick" class="btn btn-paypal">
                Pay with PayPal
            </button>
        </div>
        
        <!-- Show Hosted Fields -->
        <div v-if="CheckoutStore.selectedMethodId && !showHostedFields" class="q-cell-1">
            <button @click="showHostedFields=true" class="btn btn-primary toggle-btn">
                + Payment Method
            </button>
        </div>
        
        <!-- Loading -->
        <div v-if="isLoading && !CheckoutStore.selectedMethodId" class="loading-container q-cell-1">
            <p>Loading payment options</p>
            <LoadingDotsVue />
        </div>
        
        <!-- Hosted Fields -->
        <div v-show="!isLoading && (!CheckoutStore.selectedMethodId || showHostedFields)" class="hosted-fields-container q-cell-1">
            <div class="q-grid">
                <h3 class="section-title"><span v-if="CheckoutStore.userId">New</span> Payment Details</h3>
                <div class="q-cell-1">
                    <label for="cardholder-name">Cardholder Name</label>
                    <div id="cardholderNameField" class="hosted-field"></div>
                </div>
                <div class="q-cell-1">
                    <label for="card-number">Card Number</label>
                    <div id="cardNumberField" class="hosted-field"></div>
                </div>
                <div class="q-cell-40 pad-right">
                    <label for="exp-date">Exp. Date</label>
                    <div id="expDateField" class="hosted-field"></div>
                </div>
                <div class="q-cell-30 pad-left pad-right">
                    <label for="cvv">CVV</label>
                    <div id="cvvField" class="hosted-field"></div>
                </div>
                <div class="q-cell-30 pad-left">
                    <label for="postal-code">Postal Code</label>
                    <div id="postalCodeField" class="hosted-field"></div>
                </div>
                
                <!-- Save Payment Method For Later Checkbox -->
                <div v-if="CheckoutStore.userId" class="q-cell-1">
                    <label class="align-items-center">
                        <input type="checkbox" id="save-payment" v-model="CheckoutStore.savePaymentForLater" />
                        <span>Save payment method for future purchases</span>
                    </label>
                </div>
            </div>
        </div>
        
        <!-- Hide Hosted Fields -->
        <div v-if="showHostedFields" class="q-cell-1">
            <button @click="showHostedFields=false" class="btn btn-primary toggle-btn">
                - Hide Form
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import LoadingDotsVue from '../components/LoadingDots.vue';
import PaymentMethodRowVue from './PaymentMethodRow.vue';

import useBrain from '../composables/useBrain';
import { useCheckoutStore } from '../stores/checkoutStore';

const emits = defineEmits(['card-selected']);
const brain = useBrain();
const CheckoutStore = useCheckoutStore();
const isLoading = ref(false);
const showHostedFields = ref(false);

const initializeBraintree = async () => {
    try {
        isLoading.value = true;
        
        await brain.initHostedFields({
            styles: {
                'input': {
                    'font-size': '16px',
                    'font-family': 'roboto, verdana, sans-serif'
                },
                '.valid': {
                    'color': 'green'
                },
                '.invalid': {
                    'color': 'red'
                }
            },
            fields: {
                cardholderName: {
                    selector: '#cardholderNameField',
                    placeholder: 'Jon Doe',
                    prefill: CheckoutStore.useForBilling ? CheckoutStore.shippingForm.customerName || '' : ''
                },
                number: {
                    selector: '#cardNumberField',
                    placeholder: '4111 1111 1111 1111'
                },
                expirationDate: {
                    selector: '#expDateField',
                    placeholder: 'MM/YY'
                },
                cvv: {
                    selector: '#cvvField',
                    placeholder: '123'
                },
                postalCode: {
                    selector: '#postalCodeField',
                    placeholder: '92562',
                    prefill: CheckoutStore.useForBilling ? CheckoutStore.shippingForm.zipCode || '' : ''
                }
            }
        });
    } catch (error) {
        console.error('Error initializing Braintree:', error);
    } finally {
        isLoading.value = false;
    }
};

const handlePayPalClick = () => {
    console.log('PayPal payment initiated');
};

function clearPaymentSelection() {
    showHostedFields.value = false;
    brain.selectedPaymentMethod.value = null;
}

function isPaymentMethodSelected(method) {
    const methodNonce = method.nonce || method.methodId;
    return methodNonce === CheckoutStore.selectedMethodId;
}

function selectCard(paymentMethod) {    
    if(!paymentMethod) {
        return;
    }
    
    brain.selectedPaymentMethod.value = paymentMethod;
    emits('card-selected', paymentMethod);
}

onMounted(() => {
    initializeBraintree();
    brain.loadUserPaymentMethods();
});
</script>

<style scoped>
label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
}

h3 {
    margin-bottom: 20px;
}

#save-payment {
    margin-right: 8px;
}

.align-items-center {
    align-items: center;
}

.btn {
    width: 100%;
}

.btn-primary, .btn-paypal {
    padding: 12px 20px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-weight: bold;
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.btn-paypal {
    background-color: #ffc439;
    color: #253b80;
}

.btn-paypal:hover {
    background-color: #f7b731;
}

.clear-payment-container {
    padding-bottom: 10px;
}

.q-cell-50 {
    grid-column: span 1;
}

.hosted-field {
    height: 50px;
    box-sizing: border-box;
    width: 100%;
    padding: 12px;
    display: inline-block;
    box-shadow: none;
    font-weight: 600;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #dddddd;
    line-height: 20px;
    background: #fcfcfc;
    margin-bottom: 12px;
    background: linear-gradient(to right, white 50%, #fcfcfc 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: all 300ms ease-in-out;
}

.hosted-field:focus {
    border-color: #007bff;
}

.hosted-fields-container {
    padding-top: 30px;
}

.pad-right {
    padding-right: 5px;
}

.pad-left {
    padding-left: 5px;
}

.payment-methods, .toggle-btn {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 10px;
}

.payment-method-row {
    margin-top: 10px;
}

.loading-container {
    text-align: center;
    padding: 20px;
    background-color: #f0f0f0;
    border-radius: 8px;
    margin-bottom: 20px;
}

.saved-methods-container, .hosted-fields-container, .paypal-container {
    margin-bottom: 10px;
}

.section-title {
    font-family: 'Arial', sans-serif;
    text-decoration: underline;
    margin-bottom: 15px;
}

.text-right {
    text-align: right;
}
</style>