<template>
  <div class="q-grid">
    
    <!-- Cart Items -->
    <div class="q-cell-1 items-container pad">
      <div class="q-grid">
        <div class="q-cell-1">
          <h4>Items In Order</h4>
        </div>
        <div class="q-cell-1">
          <CartItemVue 
          v-for="item in cartStore.items" 
          :key="item.title" 
          :item="item"
          @update-qty="cartStore.updateItemQuantity"
          @remove-item="cartStore.removeItem"
          />
        </div>
      </div>
    </div>
    
    <!-- Shipping Info -->
    <div class="q-cell-1 shipping-container pad">
      <div class="q-grid shipping-address">
        <div class="q-cell-1">
          <h4>Shipping Address</h4>
        </div>
        <div class="q-cell-1 edit right">
          <a @click="CheckoutStore.changePage(0)" class="edit-link"><b>Edit</b></a>
        </div>
        <div class="q-cell-1">
          <address>
            {{ CheckoutStore.shippingForm.customerName }}
            <br>
            {{ CheckoutStore.shippingForm.street }}
            <br>
            {{ CheckoutStore.shippingForm.city }}, {{ CheckoutStore.shippingForm.state }}
          </address>
        </div>
      </div>
      
    </div>
    
    <!-- Payment Details -->
    <div class="q-cell-1 payment-info-container pad">
      <div class="q-grid">
        <div class="q-cell-1">
          <h4>Payment Details</h4>
        </div>
        <div class="q-cell-1 edit right">
          <a @click="CheckoutStore.changePage(1)" class="edit-link"><b>Edit</b></a>
        </div>
        <div class="q-cell-1">
          <PaymentMethodRowVue :paymentMethod="brain.selectedPaymentMethod.value" :isSelected="true" />
        </div>
        
        <!-- Save Payment Method For Later Checkbox -->
        <div v-if="CheckoutStore.userId && !brain.selectedPaymentMethod.value.methodId" class="q-cell-1 save-for-later">
          <label class="align-items-center">
            <input type="checkbox" id="save-payment" v-model="CheckoutStore.savePaymentForLater" />
            <span>Save payment method for future purchases</span>
          </label>
        </div>
        
      </div>
      
    </div>
    
    <!-- Pay Button -->
    <div class="q-cell-1 checkout-button-container">
      <SlideToPayVue 
        :onComplete="initCheckout"
        :total="formatAsPrice(cartStore.total)"
      />
      <Transition>
      <div v-if="sendingCheckoutToServer" class="sending-to-server">
        <b>Placing your order</b> <LoadingDotsVue />
      </div> 
      </Transition>
    </div>
    
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CartItemVue from './CartItem.vue';
import PaymentMethodRowVue from './PaymentMethodRow.vue';
import LoadingDotsVue from '../components/LoadingDots.vue';
import SlideToPayVue from '../components/SlideToPay.vue';

import  { formatAsPrice } from '../utils/formats';
import { useCheckoutStore } from '../stores/checkoutStore';
import { useCartStore } from '../stores/cartStore';
import useBrain from '../composables/useBrain';

const CheckoutStore = useCheckoutStore();
const cartStore = useCartStore();
const brain = useBrain();

const sendingCheckoutToServer = ref(false);

async function initCheckout() {
  try {
    sendingCheckoutToServer.value = true;
    await CheckoutStore.submitCheckout();
  } catch (err) {
    CheckoutStore.notify(err.message);
    throw err;
  } finally {
    sendingCheckoutToServer.value = false;
  }
}
</script>

<style scoped>
h4 {
  text-decoration: underline;
}

.checkout-button-container {
  padding: 20px;
}

.checkout-button {
  font-family: 'Novecento Slab Bold';
  font-size: 1.4rem;
  width: 100%;
  padding: 20px;
  font-weight: bold;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-link {
  cursor: pointer;
}

.pad {
  padding: 20px;
}

.save-for-later {
  padding-top: 10px;
}

#save-payment {
  margin-right: 8px;
}

.sending-to-server {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  text-align: center;
  padding: 15px;
  border-radius: 4px;
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  margin-top: 10px;
}

</style>