<template>
  <div class="q-grid pad">

    <!-- Address Form -->
    <Transition>  
    <div v-if="!showConfirmAddressForm" class="q-cell-1">
      <div class="q-grid">

        <!-- Recipient Name -->
          <div class="q-cell-1">
          <label for="customer-name-input">Name</label>
          <input type="text" v-model="checkoutStore.shippingForm.customerName" id="customer-name-input">
        </div>

        <!-- Email If Checking out as guest -->
        <div v-if="checkoutStore.continueAsGuest" class="q-cell-1">
          <label for="email-input">Email</label>
          <input type="text" v-model="checkoutStore.shippingForm.email" id="email-input">
        </div>

        <!-- Street -->
        <div class="q-cell-1">
          <label for="street-input">Street</label>
          <input type="text" v-model="checkoutStore.shippingForm.street" id="street-input">
        </div>
        
        <!-- City -->
        <div class="q-cell-1">
          <label for="city-input">City</label>
          <input type="text" v-model="checkoutStore.shippingForm.city" id="city-input">
        </div>
        
        <!-- State -->
        <div class="q-cell-30 pad-right">
          <label for="state-input">State</label>
          <select v-model="checkoutStore.shippingForm.state">
            <option v-for="state in usStates" :value="state">{{ state }}</option>
          </select>
        </div>
        
        <!-- ZipCode -->
        <div class="q-cell-40 pad-left pad-right">
          <label for="zip-input">Zip Code</label>
          <input type="tel" v-model="checkoutStore.shippingForm.zipCode" id="zip-input">
        </div>
        
        <!-- Country -->
        <div class="q-cell-30 pad-left">
          <!-- Select With Only one option for US -->
          <label for="country-input">Country</label>
          <select v-model="checkoutStore.shippingForm.country" id="country-input">
            <option value="US">US</option>
          </select>
        </div>

        <!-- Use For Billing Checkbox -->
        <div class="q-cell-1 checkbox-container">
            <label>
                <input type="checkbox" v-model="checkoutStore.useForBilling">
                <span>Use For Billing</span>
            </label>
        </div>

      </div>
    </div>
    </Transition>

    <Transition>
      <div v-if="showConfirmAddressForm" class="q-cell-1">
        <CheckoutConfirmAddressVue @hide-confirm-address="showConfirmAddressForm = false" />
      </div> 
    </Transition>
    
    <!-- Next Page -->
    <Transition>
      <div v-if="!showConfirmAddressForm" class="q-cell-1">
        <button @click="validateAddress(checkoutStore.shippingForm)">
          {{ nextPageButtonText }}<LoadingDotsVue v-if="isLoading" /><ArrowRightBoldVue v-else />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useCheckoutStore } from '../stores/checkoutStore.js';
import useShipping from '../composables/useShipping.js';
import usStates from '../utils/usStates.js';

// Components
import ArrowRightBoldVue from 'vue-material-design-icons/ArrowRightBold.vue';
import LoadingDotsVue from '../components/LoadingDots.vue';
import CheckoutConfirmAddressVue from '../components/CheckoutConfirmAddress.vue';

// Stores + Composables
const checkoutStore = useCheckoutStore();
const shipping = useShipping();
const isLoading = ref(false);
const showConfirmAddressForm = ref(false);

const nextPageButtonText = computed(() => {
  return isLoading.value ? 'Validating Address' : `Continue To Payment`;
});

async function validateAddress(shippingAddress) {
  try {
    if(checkoutStore.isShippingAddressValidated) {
      checkoutStore.changePage();
      return;
    }

    isLoading.value = true;
  
    const validationResponse = await shipping.validateAddress(shippingAddress);
    const { recommended_address } = validationResponse;

    if(recommended_address) {
      window.scrollTo(0,0);
      checkoutStore.validatedAddress = simplifyAddress(recommended_address);
      showConfirmAddressForm.value = true;
      return;
    }

    checkoutStore.validatedAddress = checkoutStore.shippingForm;
    checkoutStore.changePage();
  } catch (error) {
    checkoutStore.notify(error.message);
  } finally {
    isLoading.value = false;
  }
}

function simplifyAddress(addressToDeformat) {
  const keyMap = {
    street: 'address_line_1',
    city: 'city_locality',
    country: 'country_code',
    zipCode: 'postal_code',
    state: 'state_province'
  };

  const deformatted = {};

  for(const key in keyMap) {
    deformatted[key] = addressToDeformat[keyMap[key]];
  }

  return deformatted;
}
</script>

<style scoped>
input {
  margin-bottom: 15px;
}

label {
    text-transform: uppercase;
    font-size: 14px;
    display: block;
    font-weight: bold;
    margin-bottom: 6px;
}

button {
  width: 100%;
  background: #000;
}

.checkbox-container {
  padding: 0 0 20px 0;
}

.checkbox-container input {
  margin-right: 10px;
}

.pad {
  padding: 20px;
}

.pad-right {
  padding-right: 5px;
}

.pad-left {
  padding-left: 5px;
}
</style>
