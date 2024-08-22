import { defineStore } from 'pinia';

import { useUserStore } from '../stores/userStore';
import { useCartStore } from './cartStore';
import useBrain from '../composables/useBrain';
import { isValidZipCode } from '../utils/validation';
import useApi from '../composables/useApi';

const { post } = useApi();
const brain = useBrain();

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    activePage: 0,
    continueAsGuest: false,
    createdOrder: null,
    notifications: [],
    savePaymentForLater: true,
    shippingForm: {
      customerName: '',
      email: '', // TO-DO
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    },
    useForBilling: true,
    validatedAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  }),
  getters: {
    isShippingAddressValidated: (state) =>  {
      if(!state.validatedAddress.street) {
        return false;
      }

      return Object.keys(state.validatedAddress).every(key =>
        state.validatedAddress[key] === state.shippingForm[key]
      );
    },
    selectedMethodId: () => {
      const selectedMethod = brain.selectedPaymentMethod.value || {};
      return selectedMethod.methodId || selectedMethod.nonce;
    },
    userId: () => {
      const userStore = useUserStore();
      
      return userStore.userData?._id || '';
    }
  },
  actions: {
    async init() {
      brain.init();
    },
    
    isPageComplete(pageName) {
      if(pageName === 'payment') {
        const { nonce, methodId } = brain.selectedPaymentMethod.value || {};
        
        return !!nonce || !!methodId;
      }

      if(pageName === 'shippingForm') {
        return this.isShippingAddressValidated;
      }

      if(pageName === 'review') {
        return !!this.createdOrder;
      }
      
      const data = this[pageName];
      
      if(!data) {
        return false;
      }
      
      if(['shippingForm', 'validatedAddress'].includes(pageName)) {
        const requiredFields = ['customerName', 'street', 'city', 'state', 'zipCode', 'country'];
        
        if(this.continueAsGuest) {
          requiredFields.push('email');
        }
        
        return isValidZipCode(this.shippingForm.zipCode) && requiredFields.every((field) => !!data[field]);
      }
    },
    
    changePage(pageIndex) {
      window.scrollTo(0,0);
      
      if(pageIndex === undefined) {
        return this.activePage++;
      }
      
      this.activePage = pageIndex;
    },
    
    notify(message) {
      window.scrollTo(0, 0);

      const duplicateMessage = this.notifications.find(m =>  m.message === message);
      const messageId = Math.random().toString();
      
      if(duplicateMessage) {
        duplicateMessage.messageId = messageId;
      } else {
        this.notifications.push({
          messageId,
          message
        });
      }
      
      setTimeout(() => {
        this.removeNotifcation(messageId);
      }, 5000);
    },
    
    removeNotifcation(messageId) {
      this.notifications = this.notifications.filter(n => n.messageId !== messageId);
    },

    async submitCheckout() {
      try {
        const cart = useCartStore();

        const { methodId, nonce } = brain.selectedPaymentMethod.value || {};
        const { deviceData } = brain.dataCollectorInstance.value || {};
  
        const order = {
          deviceData,
          orderItems: cart.items,
          shippingAddress: this.shippingForm,
          shouldSavePayment: !!this.savePaymentForLater && !!nonce,
          totalPrice: cart.total,
          paymentMethod: { methodId, nonce },
          status: 'PENDING',
          paymentStatus: 'AUTHORIZED'
        };
  
        const { createdOrder, savedPaymentMethod } = await post('orders/checkout', order);
  
        if(savedPaymentMethod) {
          delete brain.selectedPaymentMethod.value.nonce;
          brain.selectedPaymentMethod.value.methodId = savedPaymentMethod.methodId;
        }
  
        this.createdOrder = createdOrder;
        cart.clearCart(true);
        this.changePage();
      } catch (err) {
        throw err;
      }
    }
  }
});