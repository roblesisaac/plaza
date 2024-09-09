import { defineStore } from 'pinia';
import { nextTick } from 'vue';

// composables
import useApi from '../composables/useApi';
import useShipping from '../composables/useShipping';
import useListings from '../composables/useListings';
import { useUserStore } from './userStore';

import { formatProper } from '../utils/formats';
import { isValidZipCode } from '../utils/validation';

const { getListingCoverPhoto, getListingDescription } = useListings();
const shipping = useShipping();
const { get, post } = useApi();

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    isLoading: false,
    isInit: false,
    zipCode: '',
    status: null,
    shippingEstimate: 0,
    shippingError: null
  }),
  
  getters: {
    cartItemCount: (state) => state.items.reduce((total, item) => total + item.qty, 0),
    
    subtotal: (state) => {
      return state.items.reduce((total, item) => {
        return total + (item.price * item.qty) || 0;
      }, 0);
    },

    tax: (state) => {
      return state.subtotal * 0.0775;
    },

    total: (state) => {
      return state.subtotal + state.tax;
    }
  },
  
  actions: {
    async addItem(listing, qty = 1) {
      const existingItem = this.items.find((item) => item.title === listing.title);
      
      if (existingItem) {
        existingItem.qty += qty;
        existingItem.saveForLater = false;
        return await this.saveCart();
      }

      this.items.push({
        _id: listing._id,
        title: listing.title, 
        price: listing.price,
        description: getListingDescription(listing),
        coverPhoto: getListingCoverPhoto(listing),
        productsInListing: listing.productsInListing,
        qty,
        saveForLater: false
      });
      
      return await this.saveCart();
    },
    
    async clearCart({ force } = {}) {
      if(!force && !confirm('Are you sure you want to clear your cart?')) {
        return;
      }

      this.items = [];
      
      await this.saveCart();
    },


    async fetchShippingEstimate() {
      try {
        if(!(isValidZipCode(this.zipCode))) {
          return;
        }
  
        this.status = 'loading';
        const estimate = await shipping.fetchEstimate(this.zipCode);
  
        this.shippingEstimate = estimate.shipment_charge_total;
      } catch (err) {
        this.shippingError = err;
      } finally {
        this.status = null;
      }
    },
    
    async fetchUserCart() {
      try {
        const user = useUserStore();

        if (user.isLoggedOut) {
          return {
            items: []
          };
        }
        
        const response = await get('cart');
        return response;
      } catch (err) {
        console.error('Error fetching user cart:', err);
        return {
          items: []
        };
      }
    },

    findItem(title) {
      return this.items.find((item) => item.title === title);
    },
    
    async init() {
      if(this.isLoading) {
        return;
      }

      this.isLoading = true;
      const localCart = this.loadLocalCart();
      const userCart = await this.fetchUserCart();
     
      await this.mergeCarts(localCart, userCart.items);

      await nextTick();

      this.isLoading = false;
      this.isInit = true;
    },
    
    loadLocalCart() {
      const localCart = localStorage.getItem('cart');

      return JSON.parse(localCart || '[]');
    },
    
    async mergeCarts(localCart, userCart) {
      const mergedCart = [...userCart];
      let mergeCount = 0;
  
      if (!localCart.length) {
        this.items = mergedCart;
        return mergedCart;
      }

      for (const item of localCart) {

        const existingItem = mergedCart.find((i) => i.title === item.title);

        if (!existingItem) {
          mergeCount++;
          mergedCart.push(item);
          continue;
        }


        if(existingItem.qty !== item.qty) {
          mergeCount++;
          existingItem.qty = item.qty;
        }

      }
  
      this.items = mergedCart;

      if(mergeCount === 0) {
        return;
      }

      return await this.saveCart();
    },
    
    async removeItem(title) {
      if(!confirm(`Are you sure you want to remove '${formatProper(title)}' from your cart?`)) {
        return;
      }

      this.items = this.items.filter((item) => item.title !== title);
      await this.saveCart();
    },
    
    saveLocalCart() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    
    async saveUserCart() {
      const user = useUserStore();
      
      if (user.isLoggedOut) {
        return;
      }
      
      await post('cart', {
        items: this.items,
      });
    },
    
    async saveCart() {
      this.saveLocalCart();
      
      await this.saveUserCart();

      return this.items;
    },
    
    async updateItemQuantity(title, newQuantity) {
      const item = this.findItem(title);

      if(item.qty === 1 && newQuantity === -1) {
        return this.removeItem(title);
      }

      if (item) {
        item.qty = item.qty + newQuantity;
      }
      
      await this.saveCart();
    }
  },
});
